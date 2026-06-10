const BASE = "/api";

export async function askQuestion(question) {
  const res = await fetch(`${BASE}/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function uploadBook(file) {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${BASE}/upload`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function fetchBooks() {
  const res = await fetch(`${BASE}/books`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteBook(bookName) {
  const res = await fetch(`${BASE}/books/${encodeURIComponent(bookName)}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}