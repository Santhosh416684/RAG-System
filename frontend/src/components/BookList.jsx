export default function BookList({ books, onDelete, loading }) {
  if (loading) return <p style={{ color: "#9ca3af", fontSize: 13 }}>Loading...</p>;
  if (books.length === 0) return (
    <p style={{ color: "#9ca3af", fontSize: 13 }}>No books ingested yet.</p>
  );

  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {books.map(book => (
        <li key={book} style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", padding: "8px 0",
          borderBottom: "1px solid #f3f4f6"
        }}>
          <span style={{ fontSize: 14 }}>{book}</span>
          {/* Only show delete button if onDelete is passed (admin only) */}
          {onDelete && (
            <button onClick={() => onDelete(book)} style={{
              background: "none", border: "none",
              color: "#ef4444", cursor: "pointer", fontSize: 13
            }}>Remove</button>
          )}
        </li>
      ))}
    </ul>
  );
}