import React, { useState } from 'react';
import { uploadImage } from '../../services/firestore';
import Button from '../ui/Button';
import LoadingSpinner from '../LoadingSpinner';

const ImageUploadTest: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setError(null);
      setDownloadUrl(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('لطفاً یک تصویر انتخاب کنید.');
      return;
    }

    setUploading(true);
    setError(null);
    setDownloadUrl(null);

    try {
      const url = await uploadImage(file);
      setDownloadUrl(url);
      alert('تصویر با موفقیت آپلود شد!');
    } catch (err: any) {
      setError(err.message || 'خطا در آپلود تصویر.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-soft border border-gray-100 mb-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">تست آپلود تصویر</h3>
      <div className="mb-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-primary-50 file:text-primary-700
            hover:file:bg-primary-100"
        />
      </div>
      {previewUrl && (
        <div className="mb-4">
          <img src={previewUrl} alt="پیش‌نمایش" className="max-w-full h-40 object-cover rounded-lg shadow-medium" />
        </div>
      )}
      <Button
        onClick={handleUpload}
        disabled={!file || uploading}
        loading={uploading}
        className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-6 py-3 rounded-2xl shadow-medium"
      >
        {uploading ? (
          <div className="flex items-center justify-center space-x-2 space-x-reverse">
            <LoadingSpinner size="sm" />
            <span>در حال آپلود...</span>
          </div>
        ) : (
          'آپلود تصویر'
        )}
      </Button>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {downloadUrl && (
        <div className="mt-4">
          <p className="text-green-600 font-medium">تصویر با موفقیت آپلود شد:</p>
          <a href={downloadUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline break-all">
            {downloadUrl}
          </a>
        </div>
      )}
    </div>
  );
};

export default ImageUploadTest;
