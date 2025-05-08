// components/CommentModal.tsx
"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { API } from "@/utils/api";
import { toast } from "react-toastify";

type Comment = {
  comment: string;
  user: {
    username: string;
  };
};

type CommentModalProps = {
  postId: string;
  currentUserId: string;
  currentUserUsername: string;
  isOpen: boolean;
  onClose: () => void;
};

export const CommentModal = ({
  postId,
  currentUserId,
  currentUserUsername,
  isOpen,
  onClose,
}: CommentModalProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    const fetchComments = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API}/api/posts/comment/${postId}`);
        setComments(res.data);
      } catch (error) {
        console.error("Сэтгэгдэл татахад алдаа гарлаа:", error);
        toast.error("Сэтгэгдэл ачааллахад алдаа гарлаа");
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      await axios.post(`${API}/api/posts/comment/${postId}`, {
        userId: currentUserId,
        comment,
      });

      const newComment = {
        comment,
        user: {
          username: currentUserUsername,
        },
      };

      setComments((prev) => [...prev, newComment]);
      setComment("");
    } catch (error) {
      console.error("Сэтгэгдэл нэмэхэд алдаа гарлаа:", error);
      toast.error("Сэтгэгдэл бичихэд алдаа гарлаа");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-neutral-900 rounded-lg w-[90%] max-w-lg p-6 relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-600 dark:text-white">
          <X size={24} />
        </button>
        <h2 className="text-lg font-semibold text-center text-gray-800 dark:text-white mb-4">Сэтгэгдлүүд</h2>

        <div className="max-h-64 overflow-y-auto mb-4">
          {loading ? (
            <p className="text-gray-400 text-sm text-center">Түр хүлээнэ үү...</p>
          ) : comments.length === 0 ? (
            <p className="text-center text-sm text-gray-500">Сэтгэгдэл алга</p>
          ) : (
            comments.map((c, idx) => (
              <div key={idx} className="mb-2 border-b pb-2 border-gray-300 dark:border-neutral-700">
                <p className="font-semibold text-sm text-gray-800 dark:text-white">
                  @{c.user.username}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">{c.comment}</p>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Сэтгэгдэл бичих..."
            className="flex-1 px-3 py-2 border rounded-md outline-none text-sm bg-white dark:bg-neutral-800 dark:text-white"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600"
          >
            Илгээх
          </button>
        </form>
      </div>
    </div>
  );
};
