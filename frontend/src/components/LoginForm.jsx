import { useState } from "react";

export default function LoginForm({ onLogin, error, loading }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit() {
    if (!username || !password) return;
    onLogin(username, password);
  }

  function handleKey(e) {
    if (e.key === "Enter") handleSubmit();
  }

  return (
    <div style={{
      minHeight: "100vh", display: "flex",
      alignItems: "center", justifyContent: "center",
      background: "#f9fafb"
    }}>
      <div style={{
        background: "#fff", padding: 40,
        borderRadius: 12, width: 360,
        boxShadow: "0 2px 16px rgba(0,0,0,0.08)"
      }}>
        <h1 style={{ fontSize: 22, marginBottom: 6 }}>📚 Book RAG</h1>
        <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 28 }}>
          Sign in to continue
        </p>

        <label style={{ fontSize: 13, color: "#374151" }}>Username</label>
        <input
          value={username}
          onChange={e => setUsername(e.target.value)}
          onKeyDown={handleKey}
          placeholder="admin or client"
          style={{
            width: "100%", padding: "10px 12px",
            borderRadius: 8, border: "1px solid #d1d5db",
            marginTop: 4, marginBottom: 16,
            fontSize: 14, boxSizing: "border-box"
          }}
        />

        <label style={{ fontSize: 13, color: "#374151" }}>Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Enter password"
          style={{
            width: "100%", padding: "10px 12px",
            borderRadius: 8, border: "1px solid #d1d5db",
            marginTop: 4, marginBottom: 24,
            fontSize: 14, boxSizing: "border-box"
          }}
        />

        {error && (
          <p style={{ color: "#b91c1c", fontSize: 13,
            marginBottom: 16 }}>{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%", padding: "11px 0",
            background: loading ? "#a5b4fc" : "#4f46e5",
            color: "#fff", border: "none",
            borderRadius: 8, fontSize: 15,
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </div>
    </div>
  );
}