import React, { useState } from 'react';
import { uploadImage } from '../../services/firestore';
import Button from '../ui/Button';
import LoadingSpinner from '../LoadingSpinner';

const ImageUploadTest: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setError(null);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);
    setResult(null);

    try {
      const imageUrl = await uploadImage(file);
      setResult(`✅ آپلود موفق! URL: ${imageUrl}`);
    } catch (err: any) {
      setError(`❌ خطا: ${err.message}`);
    } finally {
      setUploading(false);
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
    <div className="p-6 bg-white rounded-xl shadow-soft border border-gray-100 mb-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">تست آپلود تصویر رایگان</h3>
      
      <div className="space-y-4">
        <div>
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

        {file && (
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(file.size)} • {file.type}
                </p>
              </div>
            </div>
          </div>
        )}

        {previewUrl && (
          <div>
            <img src={previewUrl} alt="پیش‌نمایش" className="max-w-full h-40 object-cover rounded-lg shadow-medium" />
          </div>
        )}

        <Button
          onClick={handleUpload}
          disabled={!file || uploading}
          loading={uploading}
          className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white py-3 rounded-xl shadow-medium"
        >
          {uploading ? (
            <div className="flex items-center justify-center space-x-2 space-x-reverse">
              <LoadingSpinner size="sm" />
              <span>در حال آپلود...</span>
            </div>
          ) : (
            'تست آپلود'
          )}
        </Button>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {result && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-green-600 mb-2">{result}</p>
            {result.includes('http') && (
              <a 
                href={result.split('URL: ')[1]} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline text-xs break-all"
              >
                {result.split('URL: ')[1]}
              </a>
            )}
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <h4 className="text-sm font-medium text-blue-900 mb-2">راهنمای تنظیم:</h4>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• برای Cloudinary: حساب کاربری رایگان ایجاد کنید</li>
            <li>• برای ImgBB: API Key دریافت کنید</li>
            <li>• Base64: همیشه کار می‌کند (محدودیت 1MB)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadTest;
