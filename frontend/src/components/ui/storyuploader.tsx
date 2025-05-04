// app/story-upload/page.tsx
"use client";

import { useEffect, useState } from "react";
import { uploadToCloudinary } from "./cloudinary-upload";
import { useRouter, useSearchParams } from "next/navigation";

export default function StoryUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const previewUrl = searchParams.get("preview");

  useEffect(() => {
    const savedFile = sessionStorage.getItem("story_file");
    if (savedFile) {
      const blob = new Blob([JSON.parse(savedFile)]);
      const newFile = new File([blob], "story", { type: blob.type });
      setFile(newFile);
    }
  }, []);

  const handleUpload = async () => {
    if (!file) return;

    try {
      setUploading(true);
      const uploadedUrl = await uploadToCloudinary(file);
      if (!uploadedUrl) throw new Error("Cloudinary upload failed");

      await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          backgroundMedia: uploadedUrl,
          text: "", // optional
        }),
      });

      alert("Story uploaded!");
      router.push("/"); // Redirect back
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-lg font-bold mb-4">Upload Story</h2>
      {previewUrl && (
        <img
          src={previewUrl}
          alt="Preview"
          className="w-full h-auto rounded mb-4"
        />
      )}
      <button
        onClick={handleUpload}
        disabled={uploading}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}
