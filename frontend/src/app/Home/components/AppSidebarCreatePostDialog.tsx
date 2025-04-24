"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CreatePostDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (val: boolean) => void;
}) {
  const [step, setStep] = useState(1);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [caption, setCaption] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleNext = () => {
    if (step === 1 && !selectedImage) return;
    setStep((prev) => prev + 1);
  };

  const handleBack = () => setStep((prev) => prev - 1);

  const handlePost = () => {
    console.log("Posting:", { selectedImage, caption });
    setStep(1);
    setCaption("");
    setSelectedImage(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] space-y-4">
        <DialogHeader>
          <DialogTitle>Create Post</DialogTitle>
          <DialogDescription>
            {step === 1 && "Step 1: Choose an image"}
            {step === 2 && "Step 2: Write a caption"}
            {step === 3 && "Ready to post"}
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4 ">
            <Input type="file" accept="image/*" onChange={handleFileChange} />
            {selectedImage && (
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="preview"
                className="w-full h-auto max-h-[300px] object-contain rounded"
              />
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            {selectedImage && (
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="preview"
                className="w-full h-auto max-h-[300px] object-contain rounded"
              />
            )}
            <Input
              placeholder="Write a caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <p className="font-semibold">Preview:</p>
            {selectedImage && (
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="preview"
                className="w-full h-auto max-h-[300px] object-contain rounded"
              />
            )}
            <p className="text-gray-600 dark:text-gray-300">
              Caption: {caption}
            </p>
          </div>
        )}

        <div className="flex justify-between pt-4">
          {step > 1 ? (
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <Button
              onClick={handleNext}
              disabled={step === 1 && !selectedImage}
            >
              Next
            </Button>
          ) : (
            <Button onClick={handlePost} disabled={!selectedImage}>
              Post
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
