import redis
import json
from embed import embed_query
from store import search_similar
from ollama_client import generate
from config import REDIS_HOST, REDIS_PORT, CACHE_TTL

_redis = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True)


def answer_question(question: str) -> dict:
    # Step 1 — Check Redis cache first
    cache_key = f"query:{question.strip().lower()}"
    cached = _redis.get(cache_key)
    if cached:
        result = json.loads(cached)
        result["cached"] = True
        return result

    # Step 2 — Embed the question
    query_vector = embed_query(question)

    # Step 3 — Retrieve similar passages from ChromaDB
    passages = search_similar(query_vector, top_k=5)

    if not passages:
        return {
            "answer": "No relevant passages found. Please ingest some books first.",
            "sources": [],
            "cached": False
        }

    # Step 4 — Build prompt with context
    context = "\n\n".join([
        f"[From: {p['book']}]\n{p['text']}" for p in passages
    ])



    prompt = f"""
You are a helpful literary assistant.

Use the provided passages to answer the user's question.

If the user asks for a summary, summarize the information contained in the passages.

If the passages contain partial information, provide the best possible answer based on them.

Only say "I don't have enough information in the ingested books to answer that"
when the passages are completely unrelated to the question.

Passages:
{context}

Question:
{question}

Answer:
"""
    
    print("\n===== PROMPT =====")
    print(prompt[:3000])
    print("==================")

    # Step 5 — Generate answer with Mistral
    answer = generate(prompt)

    result = {
        "answer": answer,
        "sources": passages,
        "cached": False
    }

    # Step 6 — Cache result in Redis
    _redis.setex(cache_key, CACHE_TTL, json.dumps(result))

    return result