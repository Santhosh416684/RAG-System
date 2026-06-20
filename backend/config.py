import os
from dotenv import load_dotenv
load_dotenv()

OLLAMA_URL = "http://localhost:11434/api/generate"

# Two models — one for general/story questions, one for code/technical questions
OLLAMA_MODEL_TEXT = os.getenv("OLLAMA_MODEL_TEXT", "llama3.2:3b")
OLLAMA_MODEL_CODE = os.getenv("OLLAMA_MODEL_CODE", "qwen2.5:3b")

CHROMA_PATH = "./chroma_data"
COLLECTION_NAME = "Company_Docs"

REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
CACHE_TTL = 3600

CHUNK_SIZE = 500
CHUNK_OVERLAP = 100
EMBED_MODEL = "all-MiniLM-L6-v2"
# VECTOR_SIZE = 384
# EMBED_MODEL = "BAAI/bge-base-en-v1.5"
#  VECTOR_SIZE = 768  # was 384 for MiniLM