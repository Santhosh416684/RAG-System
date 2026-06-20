from sentence_transformers import SentenceTransformer
from config import EMBED_MODEL

_model = SentenceTransformer(EMBED_MODEL,  local_files_only=True)



def embed_texts(texts: list[str]) -> list[list[float]]:
    vectors = _model.encode(texts, show_progress_bar=True, normalize_embeddings=True)
    return [v.tolist() for v in vectors]


def embed_query(query: str) -> list[float]:
    vector = _model.encode([query], normalize_embeddings=True)[0]
    return vector.tolist()