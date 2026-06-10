from config import CHUNK_SIZE, CHUNK_OVERLAP


def chunk_text(text: str, book_name: str) -> list[dict]:
    words = text.split()
    chunks = []
    step = CHUNK_SIZE - CHUNK_OVERLAP
    chunk_index = 0

    for i in range(0, len(words), step):
        chunk_words = words[i: i + CHUNK_SIZE]
        if len(chunk_words) < 20:
            # skip tiny leftover fragments
            break
        chunk_id = f"{book_name}_chunk_{chunk_index}"
        chunks.append({
            "id": chunk_id,
            "text": " ".join(chunk_words),
            "book": book_name,
            "chunk_index": chunk_index
        })
        chunk_index += 1

    return chunks