import redis
import json
import re
from embed import embed_query
from store import search_similar
from ollama_client import generate
from config import (
    REDIS_HOST, REDIS_PORT, CACHE_TTL,
    OLLAMA_MODEL_TEXT, OLLAMA_MODEL_CODE
)

_redis = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True)

CODE_KEYWORDS = [
    "code", "function", "syntax", "algorithm", "program",
    "python", "java", "c++", "loop", "recursion", "variable",
    "class", "method", "compile", "debug", "error", "output of",
    "implement", "write a program", "trace the code", "data structure",
    "array", "linked list", "stack", "queue", "tree", "complexity"
]


def is_code_question(question: str) -> bool:
    q = question.lower()
    if any(keyword in q for keyword in CODE_KEYWORDS):
        return True
    if re.search(r'[{}()\[\];]|def |class |import |print\(', question):
        return True
    return False


def choose_model(question: str, retrieved_text: str) -> str:
    combined = question + " " + retrieved_text
    if is_code_question(combined):
        return OLLAMA_MODEL_CODE
    return OLLAMA_MODEL_TEXT


def build_prompt(question: str, context: str, model: str) -> str:
    if model == OLLAMA_MODEL_CODE:
        return f"""You are a programming and computer science tutor. Use the passages below to answer the question.
Preserve code formatting exactly. Explain logic step by step. Give corrected or example code when useful.
If the answer is not in the passages, say "I don't have enough information."

Passages:
{context}

Question: {question}
Answer:"""
    else:
        return f"""You are a helpful study assistant. Answer the question using ONLY the passages below.
If the answer is not found, say "I don't have enough information."

Passages:
{context}

Question: {question}
Answer:"""


def answer_question(question: str, book_filter: str = None, mode: str = "auto") -> dict:
    cache_key = f"query:{question.strip().lower()}:{book_filter or 'all'}:{mode}"
    cached = _redis.get(cache_key)
    if cached:
        result = json.loads(cached)
        result["cached"] = True
        return result

    query_vector = embed_query(question)
    passages = search_similar(query_vector, top_k=3, book_filter=book_filter)

    if not passages:
        return {
            "answer": "No relevant passages found.",
            "sources": [], "cached": False, "model_used": None
        }

    context = "\n\n".join([f"[From: {p['book']}]\n{p['text']}" for p in passages])

    if mode == "code":
        selected_model = OLLAMA_MODEL_CODE
    elif mode == "story":
        selected_model = OLLAMA_MODEL_TEXT
    else:
        selected_model = choose_model(question, context)

    prompt = build_prompt(question, context, selected_model)
    answer = generate(prompt, model=selected_model)

    result = {
        "answer": answer,
        "sources": passages,
        "cached": False,
        "model_used": selected_model
    }

    _redis.setex(cache_key, CACHE_TTL, json.dumps(result))
    return result