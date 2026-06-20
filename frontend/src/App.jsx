import { useAsk } from "./hooks/useAsk";
import { useBooks } from "./hooks/useBooks";
import { useAuth } from "./hooks/useAuth";
import SearchBar from "./components/SearchBar";
import AnswerPanel from "./components/AnswerPanel";
import SourceChunks from "./components/SourceChunks";
import BookUploader from "./components/BookUploader";
import BookList from "./components/BookList";
import LoginForm from "./components/LoginForm";

export default function App() {
  const { user, error, loading: authLoading, handleLogin, handleLogout } = useAuth();
  const { ask, answer, sources, loading, error: askError, cached, modelUsed } = useAsk();
  const { books, loading: booksLoading, reload, remove } = useBooks(!!user);  // ← changed

  if (!user) {
    return (
      <LoginForm
        onLogin={handleLogin}
        error={error}
        loading={authLoading}
      />
    );
  }

  const isAdmin = user.role === "admin";


  return (
    <div style={{ display: "flex", minHeight: "100vh",
      fontFamily: "system-ui, sans-serif" }}>

      {/* Sidebar */}
      <aside style={{ width: 260, padding: 24,
        borderRight: "1px solid #e5e7eb", background: "#fafafa" }}>

        {/* User info */}
        <div style={{ marginBottom: 24, padding: 12,
          background: "#ede9fe", borderRadius: 8 }}>
          <p style={{ fontSize: 13, color: "#4f46e5", margin: 0 }}>
            Logged in as <strong>{user.username}</strong>
          </p>
          <p style={{ fontSize: 12, color: "#7c3aed",
            margin: "2px 0 8px" }}>
            Role: {user.role}
          </p>
          <button onClick={handleLogout} style={{
            fontSize: 12, color: "#6b7280",
            background: "none", border: "none",
            cursor: "pointer", padding: 0
          }}>
            Sign out
          </button>
        </div>

        <h2 style={{ fontSize: 16, marginBottom: 16 }}>Books</h2>

        {/* Upload — admin only */}
        {isAdmin && <BookUploader onUploaded={reload} />}

        <div style={{ marginTop: 20 }}>
          <BookList
            books={books}
            onDelete={isAdmin ? remove : null}
            loading={booksLoading}
          />
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: 32, maxWidth: 800 }}>
        <h1 style={{ fontSize: 24, marginBottom: 8 }}>Book RAG</h1>
        <p style={{ color: "#6b7280", marginBottom: 24, fontSize: 14 }}>
          {isAdmin
            ? "Admin — you can upload books and ask questions."
            : "Ask questions about the books."}
        </p>
        <SearchBar onAsk={ask} loading={loading} books={books} />
        <div style={{ marginTop: 24 }}>
          <AnswerPanel answer={answer} loading={loading}
            error={askError} cached={cached} modelUsed={modelUsed} />
          <SourceChunks sources={sources} />
        </div>
      </main>
    </div>
  );
}