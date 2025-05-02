"use client";
import { useState } from "react";
import axios from "axios";

export default function StoryUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const res = await axios.post("/api/stories/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Story uploaded!");
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
      setFile(null);
    }
  };

  return (
    <div className="bg-white p-4 rounded-md w-full max-w-sm mx-auto">
      <h2 className="text-lg font-semibold mb-3">Upload Story</h2>
      <input
        type="file"
        accept="image/*,video/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-3"
      />
      <button
        onClick={handleUpload}
        disabled={uploading || !file}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}
