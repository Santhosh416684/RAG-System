export default function AnswerPanel({ answer, loading, error, cached }) {
  if (loading) return (
    <div style={{ padding: 20, color: "#888", fontStyle: "italic" }}>
      Model is thinking... this may take 30–60 seconds on CPU.
    </div>
  );

  if (error) return (
    <div style={{ padding: 16, background: "#fef2f2",
      borderRadius: 8, color: "#b91c1c" }}>{error}</div>
  );

  if (!answer) return null;

  return (
    <div style={{ padding: 20, background: "#f9fafb",
      borderRadius: 8, lineHeight: 1.8 }}>
      {cached && (
        <span style={{ fontSize: 11, background: "#dcfce7",
          color: "#166534", padding: "2px 8px",
          borderRadius: 20, marginBottom: 10, display: "inline-block" }}>
          Cached answer
        </span>
      )}
      <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{answer}</p>
    </div>
  );
}