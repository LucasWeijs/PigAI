import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export function ImageUpload({ onImageSelect, isLoading, disabled }: ImageUploadProps) {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (disabled || isLoading) return;
      
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        onImageSelect(file);
      }
    },
    [onImageSelect, disabled, isLoading]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled || isLoading) return;
      
      const file = e.target.files?.[0];
      if (file) {
        onImageSelect(file);
      }
    },
    [onImageSelect, disabled, isLoading]
  );

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className={`w-full max-w-xl p-8 border-2 border-dashed rounded-lg transition-colors ${
        disabled
          ? 'border-gray-200 cursor-not-allowed'
          : 'border-gray-300 hover:border-blue-500 cursor-pointer'
      }`}
    >
      <label className={`flex flex-col items-center justify-center space-y-4 ${
        disabled ? 'cursor-not-allowed' : 'cursor-pointer'
      }`}>
        <Upload className={`w-12 h-12 ${disabled ? 'text-gray-300' : 'text-gray-400'}`} />
        <div className="text-center">
          <p className={`text-lg font-medium ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>
            {disabled ? 'Loading AI model...' : 'Drag and drop your image here'}
          </p>
          <p className={`text-sm ${disabled ? 'text-gray-300' : 'text-gray-500'}`}>
            {disabled ? 'Please wait' : 'or click to select a file'}
          </p>
        </div>
        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleChange}
          disabled={disabled || isLoading}
        />
      </label>
    </div>
  );
}