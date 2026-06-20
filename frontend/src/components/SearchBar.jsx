import { useState } from "react";

export default function SearchBar({ onAsk, loading, books }) {
  const [question, setQuestion] = useState("");
  const [selectedBook, setSelectedBook] = useState("");
  const [mode, setMode] = useState("auto");

  function handleSubmit() {
    if (!question.trim() || loading) return;
    onAsk(question, selectedBook || null, mode);
  }

  function handleKey(e) {
    if (e.key === "Enter") handleSubmit();
  }

  const modes = [
    { value: "auto", label: "Auto" },
    { value: "story", label: "Story / General" },
    { value: "code", label: "Code / Technical" },
  ];

  return (
    <div>
      <select
        value={selectedBook}
        onChange={e => setSelectedBook(e.target.value)}
        style={{
          marginBottom: 8, padding: "8px 12px",
          borderRadius: 8, border: "1px solid #ddd",
          fontSize: 14, width: "100%"
        }}
      >
        <option value="">Search all books</option>
        {books.map(book => (
          <option key={book} value={book}>{book}</option>
        ))}
      </select>

      <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
        {modes.map(m => (
          <button
            key={m.value}
            onClick={() => setMode(m.value)}
            style={{
              flex: 1, padding: "8px 0",
              borderRadius: 8, fontSize: 13,
              border: mode === m.value ? "2px solid #4f46e5" : "1px solid #ddd",
              background: mode === m.value ? "#eef2ff" : "#fff",
              color: mode === m.value ? "#4338ca" : "#374151",
              cursor: "pointer",
              fontWeight: mode === m.value ? 600 : 400
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={question}
          onChange={e => setQuestion(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask anything..."
          disabled={loading}
          style={{
            flex: 1, padding: "10px 14px",
            fontSize: 15, borderRadius: 8,
            border: "1px solid #ddd", outline: "none"
          }}
        />
        <button
          onClick={handleSubmit}
          disabled={loading || !question.trim()}
          style={{
            padding: "10px 22px", borderRadius: 8,
            background: loading ? "#aaa" : "#4f46e5",
            color: "#fff", border: "none",
            cursor: loading ? "not-allowed" : "pointer", fontSize: 15
          }}
        >
          {loading ? "Thinking..." : "Ask"}
        </button>
      </div>
    </div>
  );
}