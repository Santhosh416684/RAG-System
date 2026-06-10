from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import shutil
import os
from pathlib import Path

from ingest import load_book
from chunker import chunk_text
from embed import embed_texts
from store import store_chunks, get_ingested_books, delete_book
from query import answer_question

app = FastAPI(title="Book RAG API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_methods=["*"],
    allow_headers=["*"],
)

BOOKS_DIR = Path("./books")
BOOKS_DIR.mkdir(exist_ok=True)


class QuestionRequest(BaseModel):
    question: str


@app.get("/")
def root():
    return {"status": "Book RAG API is running"}


@app.post("/upload")
async def upload_book(file: UploadFile = File(...)):
    allowed = {".epub", ".txt", ".pdf"}
    suffix = Path(file.filename).suffix.lower()

    if suffix not in allowed:
        raise HTTPException(400, f"Unsupported file type: {suffix}. Use EPUB, TXT, or PDF.")

    save_path = BOOKS_DIR / file.filename
    with open(save_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    try:
        # Full ingestion pipeline
        text = load_book(str(save_path))
        book_name = Path(file.filename).stem
        chunks = chunk_text(text, book_name)
        vectors = embed_texts([c["text"] for c in chunks])
        store_chunks(chunks, vectors)
    except Exception as e:
        os.remove(save_path)
        raise HTTPException(500, f"Ingestion failed: {str(e)}")

    return {
        "message": f"Successfully ingested '{file.filename}'",
        "chunks_created": len(chunks)
    }


@app.post("/ask")
def ask(request: QuestionRequest):
    if not request.question.strip():
        raise HTTPException(400, "Question cannot be empty.")
    result = answer_question(request.question)
    return result


@app.get("/books")
def list_books():
    books = get_ingested_books()
    return {"books": books}


@app.delete("/books/{book_name}")
def remove_book(book_name: str):
    delete_book(book_name)
    return {"message": f"'{book_name}' removed from the database."}