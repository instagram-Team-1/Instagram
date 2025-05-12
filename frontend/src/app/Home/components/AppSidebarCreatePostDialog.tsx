import { useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { jwtDecode } from "jwt-decode";
import { API } from "@/utils/api";

export default function CreatePostDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (val: boolean) => void;
}) {
  const [step, setStep] = useState(1);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);

  const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;
  const UPLOAD_PRESET = "PostsInstagram";

  const uploadImageToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      setUploading(true);
      const response = await axios.post(CLOUDINARY_URL, formData);
      const url = response.data.secure_url;
      setUploadedImageUrl(url); // Image successfully uploaded
    } catch (error) {
      console.error("Upload алдаа:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && !uploadedImageUrl) {
      const file = e.target.files[0];
      setSelectedImage(file);
      uploadImageToCloudinary(file);
    }
  };

  const handleNext = () => {
    if (step === 1 && !uploadedImageUrl) return;
    setStep((prev) => prev + 1);
  };

  const handleBack = () => setStep((prev) => prev - 1);

  const handlePost = async () => {
    if (!uploadedImageUrl) return;

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token not found!");
      return;
    }

    interface DecodedToken {
      id: string;
      email: string;
    }

    const decoded = jwtDecode<DecodedToken>(token);
    const userId = decoded.id;

    try {
      await axios.post(`${API}/api/CreatePost`, {
        userId,
        caption,
        imageUrl: uploadedImageUrl,
      });

      setStep(1);
      setCaption("");
      setSelectedImage(null);
      setUploadedImageUrl("");
      onOpenChange(false);
    } catch (error) {
      console.error("Error posting:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]  sm:max-h-[1000px] space-y-4">
        <DialogHeader>
          <DialogTitle>Create Post</DialogTitle>
          <DialogDescription>
            {step === 1 && "Step 1: Choose an image"}
            {step === 2 && "Step 2: Write a caption"}
            {step === 3 && "Ready to post"}
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4">
            {!uploadedImageUrl && (
              <FileUpload
                onChange={(files: File[]) => {
                  if (files.length > 0) {
                    const file = files[0];
                    setSelectedImage(file);
                    uploadImageToCloudinary(file);
                  }
                }}
              />
            )}
            {uploading && <p>Uploading image...</p>}
            {uploadedImageUrl && (
              <div className="flex justify-center items-center relative w-[500px] ">
                <img
                  src={uploadedImageUrl}
                  alt="uploaded"
                  className="object-cover rounded"
                />
                <Button
                  variant="outline"
                  onClick={() => {
                    setUploadedImageUrl("");
                    setSelectedImage(null);
                  }}
                  className="absolute top-2 right-2"
                >
                  Remove
                </Button>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 flex">
            {uploadedImageUrl && (
              <img
                src={uploadedImageUrl}
                alt="uploaded"
                className="w-full h-auto max-h-[250px] object-cover rounded"
              />
            )}
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-[300px] h-[150px] p-1.5 ml-2"
            ></textarea>
            {/* <Input
                placeholder=""
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className=""
              /> */}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <p className="font-semibold">Preview:</p>
            {uploadedImageUrl && (
              <img
                src={uploadedImageUrl}
                alt="uploaded"
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
              disabled={step === 1 && !uploadedImageUrl}
            >
              Next
            </Button>
          ) : (
            <Button onClick={handlePost} disabled={!uploadedImageUrl}>
              Post
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
