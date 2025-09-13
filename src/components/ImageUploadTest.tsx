import React, { useState } from 'react';
import { uploadImage } from '../services/firestore';

const ImageUploadTest: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
      setResult('');
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError('');
    setResult('');

    try {
      const url = await uploadImage(file);
      setResult(`تصویر با موفقیت آپلود شد: ${url}`);
    } catch (err: any) {
      setError(err.message || 'خطا در آپلود تصویر');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-8 bg-white rounded-2xl shadow-large max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">تست آپلود تصویر</h2>
      
      <div className="space-y-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
        
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="w-full bg-primary-500 text-white py-3 px-4 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? 'در حال آپلود...' : 'آپلود تصویر'}
        </button>

        {result && (
          <div className="p-4 bg-green-100 text-green-800 rounded-lg text-sm">
            {result}
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-100 text-red-800 rounded-lg text-sm">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploadTest;
