export default function SourceChunks({ sources }) {
  if (!sources || sources.length === 0) return null;

  return (
    <div style={{ marginTop: 24 }}>
      <h3 style={{ fontSize: 14, color: "#6b7280", marginBottom: 10 }}>
        Retrieved passages ({sources.length})
      </h3>
      {sources.map((s, i) => (
        <div key={i} style={{
          padding: 14, marginBottom: 10,
          background: "#fff", border: "1px solid #e5e7eb",
          borderRadius: 8, fontSize: 13
        }}>
          <div style={{ fontWeight: 500, color: "#4f46e5",
            marginBottom: 6, fontSize: 12 }}>
            {s.book} — relevance: {(s.score * 100).toFixed(1)}%
          </div>
          <p style={{ margin: 0, color: "#374151",
            lineHeight: 1.6 }}>{s.text.slice(0, 300)}...</p>
        </div>
      ))}
    </div>
  );
}