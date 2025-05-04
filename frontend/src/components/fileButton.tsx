import React, { useState } from 'react';

interface FileUploadButtonProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className: string;
}

const FileUploadButton: React.FC<FileUploadButtonProps> = ({ onChange, className }) => {
  return (
    <div className="flex flex-col items-center">

      <input
        type="file"
        id="fileInput"
        onChange={onChange}
        className="hidden"
      />

      
      <button
        type="button"
        onClick={() => document.getElementById('fileInput')?.click()} 
        className={className}
      >
        Select a file
      </button>
    </div>
  );
};

export default FileUploadButton;
