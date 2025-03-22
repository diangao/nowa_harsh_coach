import React, { useState, useRef } from 'react';

interface FoodImageUploadProps {
  onImageSelected: (imageFile: File) => void;
}

const FoodImageUpload: React.FC<FoodImageUploadProps> = ({ onImageSelected }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if the file is an image
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Create a preview URL
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    onImageSelected(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="upload-container">
      <div className="image-preview">
        {imagePreview ? (
          <div className="preview-container">
            <img 
              src={imagePreview} 
              alt="Food preview" 
              className="preview-image"
            />
          </div>
        ) : (
          <div className="empty-preview">
            <p>No image selected</p>
          </div>
        )}
      </div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        style={{ display: 'none' }}
      />
      <button 
        onClick={handleButtonClick}
        className="upload-button"
      >
        {imagePreview ? 'Change Image' : 'Take Photo / Upload'}
      </button>

      <style>
        {`
        .upload-container {
          width: 100%;
          margin-bottom: 20px;
        }
        .image-preview {
          width: 100%;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 16px;
        }
        .preview-container {
          display: flex;
          justify-content: center;
        }
        .preview-image {
          max-height: 300px;
          border-radius: 8px;
        }
        .empty-preview {
          height: 200px;
          background-color: #f7fafc;
          border-radius: 8px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .upload-button {
          width: 100%;
          padding: 12px;
          background-color: #319795;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 16px;
          cursor: pointer;
        }
        .upload-button:hover {
          background-color: #2c7a7b;
        }
        `}
      </style>
    </div>
  );
};

export default FoodImageUpload; 