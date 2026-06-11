import { useState } from "react";
import { login, setAuth, clearAuth } from "../api/client";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(username, password) {
    setLoading(true);
    setError("");
    try {
      const data = await login(username, password);
      setAuth(data.access_token, data.role);
      setUser({ username, role: data.role });
    } catch (e) {
      setError("Invalid username or password.");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    clearAuth();
    setUser(null);
  }

  return { user, error, loading, handleLogin, handleLogout };
}