import { useState } from "react";
import { askQuestion } from "../api/client";

export function useAsk() {
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cached, setCached] = useState(false);

  async function ask(question) {
    setLoading(true);
    setError("");
    setAnswer("");
    setSources([]);
    try {
      const data = await askQuestion(question);
      setAnswer(data.answer);
      setSources(data.sources || []);
      setCached(data.cached || false);
    } catch (e) {
      setError("Something went wrong. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  return { ask, answer, sources, loading, error, cached };
}