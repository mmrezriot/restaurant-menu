import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Button from '../ui/Button';
import LoadingSpinner from '../LoadingSpinner';
import { uploadImage } from '../../services/firestore';

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
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(currentImageUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      
      // Validate file type
      if (!selectedFile.type.startsWith('image/')) {
        setError('فایل انتخاب شده باید تصویر باشد.');
        return;
      }
      
      // Validate file size (5MB limit)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('حجم فایل نباید بیشتر از 5 مگابایت باشد.');
        return;
      }
      
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: { 'image/*': [] }, 
    disabled: disabled || uploading,
    multiple: false
  });

  const handleUpload = async () => {
    if (!file) {
      setError('لطفاً یک تصویر انتخاب کنید.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const imageUrl = await uploadImage(file);
      onImageUploaded(imageUrl);
      setFile(null);
      setPreviewUrl(imageUrl);
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'خطا در آپلود تصویر. لطفاً دوباره تلاش کنید.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setFile(null);
    setPreviewUrl(currentImageUrl);
    setError(null);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        تصویر غذا
      </label>
      
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300 ${
          isDragActive 
            ? 'border-primary-500 bg-primary-50' 
            : 'border-gray-300 bg-gray-50 hover:border-primary-300 hover:bg-primary-50/30'
        } ${disabled || uploading ? 'opacity-60 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} disabled={disabled || uploading} />
        
        {uploading ? (
          <div className="flex flex-col items-center space-y-3">
            <LoadingSpinner size="lg" />
            <p className="text-primary-600 font-medium">در حال آپلود...</p>
          </div>
        ) : isDragActive ? (
          <div className="flex flex-col items-center space-y-3">
            <svg className="w-12 h-12 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-primary-600 font-medium">تصویر را اینجا رها کنید...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-3">
            <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <div>
              <p className="text-gray-600 font-medium">
                تصویر را اینجا بکشید یا کلیک کنید
              </p>
              <p className="text-sm text-gray-500 mt-1">
                PNG, JPG, GIF تا 5 مگابایت
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Preview */}
      {previewUrl && (
        <div className="relative">
          <img
            src={previewUrl}
            alt="پیش‌نمایش تصویر"
            className="w-full h-48 object-cover rounded-lg shadow-medium border border-gray-200"
          />
          {file && (
            <div className="absolute top-2 right-2">
              <button
                onClick={handleRemove}
                className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                disabled={uploading}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}

      {/* File Info */}
      {file && (
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 space-x-reverse">
              <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-gray-700">{file.name}</p>
                <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Upload Button */}
      {file && !uploading && (
        <Button
          onClick={handleUpload}
          className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white"
          disabled={disabled}
        >
          <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          آپلود تصویر
        </Button>
      )}
    </div>
  );
};

export default ImageUpload;
