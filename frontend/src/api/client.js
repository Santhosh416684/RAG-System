const BASE = "/api";

// Save token to memory
let authToken = null;
let userRole = null;

export function setAuth(token, role) {
  authToken = token;
  userRole = role;
}

export function getRole() {
  return userRole;
}

export function clearAuth() {
  authToken = null;
  userRole = null;
}

function authHeaders() {
  return {
    "Content-Type": "application/json",
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
  };
}

export async function login(username, password) {
  const res = await fetch(`${BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error("Invalid username or password.");
  return res.json();
}

export async function askQuestion(question) {
  const res = await fetch(`${BASE}/ask`, {
    method: "POST",
    headers: authHeaders(),
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
    headers: {
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
    },
    body: form,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function fetchBooks() {
  const res = await fetch(`${BASE}/books`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteBook(bookName) {
  const res = await fetch(`${BASE}/books/${encodeURIComponent(bookName)}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}