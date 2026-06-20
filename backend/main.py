from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
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
from auth import require_admin, require_client_or_admin, create_access_token
from users import authenticate_user
from models import LoginRequest, TokenResponse

app = FastAPI(title="Book RAG API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

BOOKS_DIR = Path("./books")
BOOKS_DIR.mkdir(exist_ok=True)


class QuestionRequest(BaseModel):
    question: str
    book_filter: str | None = None
    mode: str = "auto"


# ─── Public route — no login needed ───────────────────────
@app.get("/")
def root():
    return {"status": "Book RAG API is running"}


# ─── Login — returns JWT token ─────────────────────────────
@app.post("/login", response_model=TokenResponse)
def login(request: LoginRequest):
    user = authenticate_user(request.username, request.password)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Incorrect username or password."
        )
    token = create_access_token({
        "sub": user["username"],
        "role": user["role"]
    })
    return {
        "access_token": token,
        "token_type": "bearer",
        "role": user["role"]
    }


# ─── Upload — admin only ───────────────────────────────────
@app.post("/upload")
async def upload_book(
    file: UploadFile = File(...),
    current_user: dict = Depends(require_admin)
):
    allowed = {".epub", ".txt", ".pdf"}
    suffix = Path(file.filename).suffix.lower()

    if suffix not in allowed:
        raise HTTPException(400, f"Unsupported file type: {suffix}")

    save_path = BOOKS_DIR / file.filename
    with open(save_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    try:
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


# ─── Ask — both admin and client ──────────────────────────
@app.post("/ask")
def ask(
    request: QuestionRequest,
    current_user: dict = Depends(require_client_or_admin)
):
    if not request.question.strip():
        raise HTTPException(400, "Question cannot be empty.")
    result = answer_question(
        request.question,
        book_filter=request.book_filter,
        mode=request.mode
    )
    result["asked_by"] = current_user["username"]
    return result


# ─── List books — both admin and client ───────────────────
@app.get("/books")
def list_books(current_user: dict = Depends(require_client_or_admin)):
    books = get_ingested_books()
    return {"books": books}


# ─── Delete book — admin only ──────────────────────────────
@app.delete("/books/{book_name}")
def remove_book(
    book_name: str,
    current_user: dict = Depends(require_admin)
):
    delete_book(book_name)
    return {"message": f"'{book_name}' removed."}


# ─── Get current user info ─────────────────────────────────
@app.get("/me")
def get_me(current_user: dict = Depends(require_client_or_admin)):
    return {
        "username": current_user["username"],
        "role": current_user["role"]
    }