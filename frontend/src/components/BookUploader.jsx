import { useState } from "react";
import { uploadBook } from "../api/client";

export default function BookUploader({ onUploaded }) {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setMessage("");
    try {
      const data = await uploadBook(file);
      setMessage(`Done! Created ${data.chunks_created} chunks.`);
      onUploaded();
    } catch (err) {
      setMessage("Upload failed. Check the backend terminal for details.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div style={{ padding: 16, border: "2px dashed #d1d5db",
      borderRadius: 10, textAlign: "center" }}>
      <p style={{ margin: "0 0 10px", color: "#6b7280", fontSize: 14 }}>
        Drop a book to ingest it — EPUB, PDF, or TXT
      </p>
      <input type="file" accept=".epub,.pdf,.txt"
        onChange={handleFile} disabled={uploading}
        style={{ fontSize: 14 }} />
      {uploading && <p style={{ color: "#4f46e5", marginTop: 8 }}>
        Ingesting... this may take a minute for large books.
      </p>}
      {message && <p style={{ marginTop: 8, color: message.includes("failed")
        ? "#b91c1c" : "#166534", fontSize: 13 }}>{message}</p>}
    </div>
  );
}