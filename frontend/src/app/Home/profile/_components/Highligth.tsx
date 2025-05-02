import React from 'react'

import { Input } from "@/components/ui/input";
import { Plus, Camera } from "lucide-react";
import { useState } from "react";

const Highligth = () => {

      const [showHighlightModal, setShowHighlightModal] = useState(false);
  return (
    <div className="w-full">
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

      {showHighlightModal && (
        <div className="fixed inset-0 bg-black bg-opacity-100 flex items-center justify-center z-50">
          <div className="bg-gray-700 p-6 rounded-xl shadow-lg w-[300px]">
            <h2 className="text-lg font-semibold mb-4">New Highlight</h2>
            <Input
              type="text"
              placeholder="Highlight name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                className="text-gray-600 hover:text-black"
                onClick={() => setShowHighlightModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-black text-white px-4 py-2 rounded-md"
                onClick={() => {
                  // Highlight creation logic here
                  setShowHighlightModal(false);
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Highligth