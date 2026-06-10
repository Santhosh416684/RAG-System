import { useState, useEffect } from "react";
import { fetchBooks, deleteBook } from "../api/client";

export function useBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const data = await fetchBooks();
      setBooks(data.books || []);
    } catch {
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }

  async function remove(bookName) {
    await deleteBook(bookName);
    await load();
  }

  useEffect(() => { load(); }, []);

  return { books, loading, reload: load, remove };
}