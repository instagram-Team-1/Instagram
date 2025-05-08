import React, { useRef, useState } from "react";

interface FileUploadButtonProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className: string;
  children?: React.ReactNode;
}

const FileUploadButton: React.FC<FileUploadButtonProps> = ({
  onChange,
  className,
  children,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
    }

    onChange(e);
  };

  return (
    <div className="flex flex-col items-center">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className={className}
      >
        {preview ? (
          <img
            src={preview}
            alt="preview"
            className="object-cover w-full h-full rounded-full"
          />
        ) : (
          children
        )}
      </button>
    </div>
  );
};

export default FileUploadButton;
