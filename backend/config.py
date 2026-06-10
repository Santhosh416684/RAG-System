import os
from dotenv import load_dotenv
load_dotenv()

OLLAMA_URL = "http://localhost:11434/api/generate"
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.2:3b")

CHROMA_PATH = "./chroma_data"
COLLECTION_NAME = "Company_Docs"

REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
CACHE_TTL = 3600

CHUNK_SIZE = 500
CHUNK_OVERLAP = 100
EMBED_MODEL = "all-MiniLM-L6-v2"