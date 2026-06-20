import { useState, useEffect } from "react";
import { fetchBooks, deleteBook } from "../api/client";

export function useBooks(isLoggedIn) {
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

  // Only fetch books once user is logged in
  useEffect(() => {
    if (isLoggedIn) {
      load();
    }
  }, [isLoggedIn]);

  return { books, loading, reload: load, remove };
}