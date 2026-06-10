from sentence_transformers import SentenceTransformer
from config import EMBED_MODEL

# Load once at import time — slow to load, fast to use
_model = SentenceTransformer(EMBED_MODEL)


def embed_texts(texts: list[str]) -> list[list[float]]:
    vectors = _model.encode(texts, show_progress_bar=True)
    return [v.tolist() for v in vectors]


def embed_query(query: str) -> list[float]:
    vector = _model.encode([query])[0]
    return vector.tolist()