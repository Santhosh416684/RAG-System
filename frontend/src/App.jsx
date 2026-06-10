import { useAsk } from "./hooks/useAsk";
import { useBooks } from "./hooks/useBooks";
import SearchBar from "./components/SearchBar";
import AnswerPanel from "./components/AnswerPanel";
import SourceChunks from "./components/SourceChunks";
import BookUploader from "./components/BookUploader";
import BookList from "./components/BookList";

export default function App() {
  const { ask, answer, sources, loading, error, cached } = useAsk();
  const { books, loading: booksLoading, reload, remove } = useBooks();

  return (
    <div style={{ display: "flex", minHeight: "100vh",
      fontFamily: "system-ui, sans-serif" }}>

      {/* Sidebar */}
      <aside style={{ width: 260, padding: 24,
        borderRight: "1px solid #e5e7eb", background: "#fafafa" }}>
        <h2 style={{ fontSize: 16, marginBottom: 16 }}>Your Books</h2>
        <BookUploader onUploaded={reload} />
        <div style={{ marginTop: 20 }}>
          <BookList books={books} onDelete={remove} loading={booksLoading} />
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: 32, maxWidth: 800 }}>
        <h1 style={{ fontSize: 24, marginBottom: 8 }}>Book RAG</h1>
        <p style={{ color: "#6b7280", marginBottom: 24, fontSize: 14 }}>
          Ask questions about your ingested books. Powered by Mistral + ChromaDB.
        </p>
        <SearchBar onAsk={ask} loading={loading} />
        <div style={{ marginTop: 24 }}>
          <AnswerPanel answer={answer} loading={loading}
            error={error} cached={cached} />
          <SourceChunks sources={sources} />
        </div>
      </main>
    </div>
  );
}