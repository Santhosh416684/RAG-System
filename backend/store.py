import chromadb
import redis
import json
from config import (
    CHROMA_PATH, COLLECTION_NAME,
    REDIS_HOST, REDIS_PORT
)

# ChromaDB
_chroma_client = chromadb.PersistentClient(path=CHROMA_PATH)
_collection = _chroma_client.get_or_create_collection(
    name=COLLECTION_NAME,
    metadata={"hnsw:space": "cosine"}
)

# Redis
_redis = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True)


def store_chunks(chunks: list[dict], vectors: list[list[float]]):
    ids = [c["id"] for c in chunks]
    texts = [c["text"] for c in chunks]
    metadatas = [
        {"book": c["book"], "chunk_index": c["chunk_index"]}
        for c in chunks
    ]

    # Batch upsert to ChromaDB — handles duplicates + large docs
    batch_size = 500
    for i in range(0, len(ids), batch_size):
        _collection.upsert(
            ids=ids[i:i + batch_size],
            embeddings=vectors[i:i + batch_size],
            documents=texts[i:i + batch_size],
            metadatas=metadatas[i:i + batch_size]
        )
        print(f"Stored batch {i // batch_size + 1} / {(len(ids) // batch_size) + 1}")

    # Redis pipeline batch write
    pipe = _redis.pipeline()
    for chunk in chunks:
        pipe.set(chunk["id"], json.dumps({
            "text": chunk["text"],
            "book": chunk["book"]
        }))
    pipe.execute()
    print(f"Stored {len(chunks)} chunks in Redis")


def search_similar(query_vector: list[float], top_k: int = 5, book_filter: str = None) -> list[dict]:
    query_params = {
        "query_embeddings": [query_vector],
        "n_results": top_k,
        "include": ["documents", "metadatas", "distances"]
    }

    # If a specific book is selected, filter results to that book only
    if book_filter:
        query_params["where"] = {"book": book_filter}

    results = _collection.query(**query_params)

    passages = []
    for i, doc in enumerate(results["documents"][0]):
        passages.append({
            "text": doc,
            "book": results["metadatas"][0][i]["book"],
            "score": round(1 - results["distances"][0][i], 3)
        })
    return passages


def get_ingested_books() -> list[str]:
    result = _collection.get(include=["metadatas"])
    books = set()
    for meta in result["metadatas"]:
        books.add(meta["book"])
    return sorted(list(books))


def delete_book(book_name: str):
    results = _collection.get(
        where={"book": book_name},
        include=["metadatas"]
    )
    if results["ids"]:
        _collection.delete(ids=results["ids"])
        # Also clean Redis
        pipe = _redis.pipeline()
        for chunk_id in results["ids"]:
            pipe.delete(chunk_id)
        pipe.execute()