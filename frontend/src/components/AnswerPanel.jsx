export default function AnswerPanel({ answer, loading, error, cached, modelUsed }) {
  if (loading) return (
    <div style={{ padding: 20, color: "#888", fontStyle: "italic" }}>
      Thinking... this may take 30–60 seconds.
    </div>
  );

  if (error) return (
    <div style={{ padding: 16, background: "#fef2f2",
      borderRadius: 8, color: "#b91c1c" }}>{error}</div>
  );

  if (!answer) return null;

  const isCode = modelUsed && modelUsed.includes("qwen");

  return (
    <div style={{ padding: 20, background: "#f9fafb",
      borderRadius: 8, lineHeight: 1.8 }}>
      <div style={{ marginBottom: 10, display: "flex", gap: 8 }}>
        {cached && (
          <span style={{ fontSize: 11, background: "#dcfce7",
            color: "#166534", padding: "2px 8px", borderRadius: 20 }}>
            Cached answer
          </span>
        )}
        {modelUsed && (
          <span style={{
            fontSize: 11,
            background: isCode ? "#e0e7ff" : "#fef3c7",
            color: isCode ? "#4338ca" : "#92400e",
            padding: "2px 8px", borderRadius: 20
          }}>
            {isCode ? "Code model (Qwen2.5)" : "Text model (Llama3.2)"}
          </span>
        )}
      </div>
      <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{answer}</p>
    </div>
  );
}