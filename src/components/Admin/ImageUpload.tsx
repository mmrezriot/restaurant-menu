import React, { useState, useRef } from 'react';
import { uploadImage } from '../../services/firestore';
import Button from '../ui/Button';
import LoadingSpinner from '../LoadingSpinner';

interface ImageUploadProps {
  onImageUploaded: (imageUrl: string) => void;
  currentImageUrl?: string;
  disabled?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onImageUploaded, 
  currentImageUrl, 
  disabled = false 
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    
    if (!selectedFile) {
      setFile(null);
      setPreviewUrl(null);
      setError(null);
      return;
    }

    // Validate file type
    if (!selectedFile.type.startsWith('image/')) {
      setError('فایل انتخاب شده باید تصویر باشد');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (selectedFile.size > maxSize) {
      setError('حجم فایل نباید بیشتر از 5 مگابایت باشد');
      return;
    }

    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    setError(null);
    setProgress(0);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('لطفاً یک تصویر انتخاب کنید');
      return;
    }

    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      const imageUrl = await uploadImage(file);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      // Call the callback with the uploaded image URL
      onImageUploaded(imageUrl);
      
      // Reset form
      setFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Show success message briefly
      setTimeout(() => {
        setProgress(0);
      }, 1000);
      
    } catch (err: any) {
      setError(err.message || 'خطا در آپلود تصویر');
      setProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setFile(null);
    setPreviewUrl(null);
    setError(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Current Image Display */}
      {currentImageUrl && !previewUrl && (
        <div className="relative">
          <img 
            src={currentImageUrl} 
            alt="تصویر فعلی" 
            className="w-full h-32 object-cover rounded-xl border border-gray-200"
          />
          <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
            <span className="text-xs font-medium text-gray-600">تصویر فعلی</span>
          </div>
        </div>
      )}

      {/* File Input */}
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={disabled || uploading}
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className={`block w-full p-4 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
            disabled || uploading
              ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
              : 'border-primary-300 hover:border-primary-400 hover:bg-primary-50'
          }`}
        >
          <div className="text-center">
            <div className="mx-auto w-12 h-12 mb-4 flex items-center justify-center">
              {uploading ? (
                <LoadingSpinner size="md" />
              ) : (
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              )}
            </div>
            <p className="text-sm text-gray-600">
              {uploading ? 'در حال آپلود...' : 'برای انتخاب تصویر کلیک کنید'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              PNG, JPG, WEBP تا 5 مگابایت
            </p>
          </div>
        </label>
      </div>

      {/* File Info */}
      {file && (
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {file.name}
              </p>
              <p className="text-xs text-gray-500">
                {formatFileSize(file.size)}
              </p>
            </div>
            <button
              type="button"
              onClick={handleRemoveImage}
              disabled={uploading}
              className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Preview */}
      {previewUrl && (
        <div className="relative">
          <img 
            src={previewUrl} 
            alt="پیش‌نمایش" 
            className="w-full h-32 object-cover rounded-xl border border-gray-200"
          />
          <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
            <span className="text-xs font-medium text-gray-600">پیش‌نمایش</span>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      {uploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>در حال آپلود...</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-500 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Upload Button */}
      {file && !uploading && (
        <Button
          type="button"
          onClick={handleUpload}
          disabled={disabled}
          className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white py-3 rounded-xl shadow-medium"
        >
          آپلود تصویر
        </Button>
      )}
    </div>
  );
};

export default ImageUpload;
