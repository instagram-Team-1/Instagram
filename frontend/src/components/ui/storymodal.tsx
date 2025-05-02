import { Dialog } from "@headlessui/react";

type StoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  mediaUrl: string;
  type: "image" | "video";
};

export default function StoryModal({
  isOpen,
  onClose,
  mediaUrl,
  type,
}: StoryModalProps) {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
      <Dialog.Panel className="relative z-50 max-w-md w-full bg-black rounded-md p-2">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white text-sm"
        >
          ✕
        </button>
        {type === "image" ? (
          <img
            src={mediaUrl}
            alt="story"
            className="rounded-md w-full h-auto"
          />
        ) : (
          <video
            src={mediaUrl}
            controls
            autoPlay
            className="rounded-md w-full"
          />
        )}
      </Dialog.Panel>
    </Dialog>
  );
}
