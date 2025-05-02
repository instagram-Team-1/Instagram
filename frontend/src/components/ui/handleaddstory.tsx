"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import type { Story } from "@/lib/types";

export default function HandleAddStory() {
  const { data: session } = useSession();
  const [stories, setStories] = useState<Story[]>([]);

  const handleAddStory = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*,video/*";

    input.onchange = async () => {
      if (input.files && input.files[0]) {
        const file = input.files[0];
        const formData = new FormData();
        formData.append("file", file);
        formData.append("userId", session?.user?.id || "");

        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/stories/upload`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          setStories((prev) => [...prev, res.data]);
        } catch (err) {
          console.error("Story upload failed", err);
          alert("Story upload амжилтгүй боллоо");
        }
      }
    };

    input.click();
  };

  return <button onClick={handleAddStory}>Add Story</button>;
}
