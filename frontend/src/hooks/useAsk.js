import { useState } from "react";
import { askQuestion } from "../api/client";

export function useAsk() {
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cached, setCached] = useState(false);
  const [modelUsed, setModelUsed] = useState(null);

  async function ask(question, bookFilter = null, mode = "auto") {
    setLoading(true);
    setError("");
    setAnswer("");
    setSources([]);
    try {
      const data = await askQuestion(question, bookFilter, mode);
      setAnswer(data.answer);
      setSources(data.sources || []);
      setCached(data.cached || false);
      setModelUsed(data.model_used || null);
    } catch (e) {
      setError("Something went wrong. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  return { ask, answer, sources, loading, error, cached, modelUsed };
}