import React, { useRef, useState } from 'react';
import { UploadIcon, LoadingSpinnerIcon } from './icons';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  isLoading: boolean;
  uploadedImage: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, isLoading, uploadedImage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  return (
    <div 
      className={`relative group p-4 border-2 border-dashed rounded-xl transition-all duration-300 ${isDragging ? 'border-cyan-400 bg-slate-800' : 'border-slate-600 hover:border-cyan-500 hover:bg-slate-800/50'}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
      />
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <LoadingSpinnerIcon className="w-12 h-12" />
            <p className="mt-4 text-lg">Parsing receipt with AI...</p>
        </div>
      ) : uploadedImage ? (
        <div className="relative h-96">
          <img src={uploadedImage} alt="Uploaded Receipt" className="object-contain w-full h-full rounded-lg" />
          <button
            onClick={handleClick}
            className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"
          >
            <div className="text-center text-white">
                <UploadIcon className="w-8 h-8 mx-auto" />
                <p>Upload another image</p>
            </div>
          </button>
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center h-64 cursor-pointer"
          onClick={handleClick}
        >
          <UploadIcon className="w-12 h-12 text-slate-500 group-hover:text-cyan-400 transition-colors" />
          <p className="mt-4 text-slate-400">
            <span className="font-semibold text-cyan-400">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-slate-500 mt-1">PNG, JPG, or WEBP</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
