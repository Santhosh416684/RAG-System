import ebooklib
from ebooklib import epub
from bs4 import BeautifulSoup
from pathlib import Path


def load_book(file_path: str) -> str:
    path = Path(file_path)
    suffix = path.suffix.lower()

    if suffix == ".epub":
        return _load_epub(file_path)
    elif suffix == ".txt":
        return _load_txt(file_path)
    elif suffix == ".pdf":
        return _load_pdf(file_path)
    else:
        raise ValueError(f"Unsupported file type: {suffix}")


def _load_epub(path: str) -> str:
    book = epub.read_epub(path)
    chapters = []
    for item in book.get_items_of_type(ebooklib.ITEM_DOCUMENT):
        soup = BeautifulSoup(item.get_content(), "html.parser")
        text = soup.get_text(separator=" ", strip=True)
        if text:
            chapters.append(text)
    return "\n\n".join(chapters)


def _load_txt(path: str) -> str:
    with open(path, "r", encoding="utf-8") as f:
        return f.read()


def _load_pdf(path: str) -> str:
    try:
        import pdfplumber
        pages = []
        with pdfplumber.open(path) as pdf:
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    pages.append(text)
        return "\n\n".join(pages)
    except ImportError:
        raise ImportError("Run: pip install pdfplumber")