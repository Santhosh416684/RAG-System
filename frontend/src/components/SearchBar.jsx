import { useState } from "react";

export default function SearchBar({ onAsk, loading }) {
  const [question, setQuestion] = useState("");

  function handleSubmit() {
    if (!question.trim() || loading) return;
    onAsk(question);
  }

  function handleKey(e) {
    if (e.key === "Enter") handleSubmit();
  }

  return (
    <div style={{ display: "flex", gap: 8 }}>
      <input
        value={question}
        onChange={e => setQuestion(e.target.value)}
        onKeyDown={handleKey}
        placeholder="Ask anything about your books..."
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
  );
}