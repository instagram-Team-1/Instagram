import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { HighlightType } from "@/lib/types";

const Highligth = () => {
  const [showHighlightModal, setShowHighlightModal] = useState(false);
  const [highlights, setHighlights] = useState<HighlightType[]>([]);
  const [highlightTitle, setHighlightTitle] = useState("");

  const handleCreateHighlight = () => {
    if (!highlightTitle.trim()) return;

    const newHighlight: HighlightType = {
      id: crypto.randomUUID(),
      title: highlightTitle.trim(),
    };

    setHighlights((prev) => [...prev, newHighlight]);
    setHighlightTitle("");
    setShowHighlightModal(false);
  };

  return (
    <div className="w-full flex flex-row items-center gap-4">
      {/* Highlight нэмэх товч */}
      <div
        role="tab"
        className="w-[89px] flex flex-col items-center cursor-pointer"
        onClick={() => setShowHighlightModal(true)}
      >
        <div className="w-[89px] h-[89px] rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center">
          <div className="w-[77px] h-[77px] rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
            <Plus className="w-16" />
          </div>
        </div>
        <div>New</div>
      </div>

      {/* Highlight list */}
      <div className="flex gap-4 overflow-x-auto">
        {highlights.map((highlight) => (
          <div
            key={highlight.id}
            className="w-[89px] flex-shrink-0 flex flex-col items-center"
          >
            <div className="w-[89px] h-[89px] rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center">
              <div className="w-[77px] h-[77px] rounded-full bg-white/10 dark:bg-black/10 backdrop-blur-md flex items-center justify-center" />
            </div>
            <div className="truncate max-w-[89px] text-sm">{highlight.title}</div>
          </div>
        ))}
      </div>


      {/* Modal */}
      {showHighlightModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#353535] p-6 rounded-xl shadow-lg w-[300px]">
            <h2 className="text-lg font-semibold mb-4">New Highlight</h2>
            <Input
              type="text"
              value={highlightTitle}
              onChange={(e) => setHighlightTitle(e.target.value)}
              placeholder="Highlight name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4 dark:bg-[#191919]"
            />
            <div className="flex justify-end gap-2">
              <button
                className="text-white hover:text-black"
                onClick={() => setShowHighlightModal(false)}
              >
                Cancel
              </button>
              <button
                className=" text-white px-4 py-2 rounded-md"
                onClick={handleCreateHighlight}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Highligth;
