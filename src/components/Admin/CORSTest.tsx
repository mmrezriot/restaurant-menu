import React, { useState } from 'react';
import { uploadImage } from '../../services/firestore';
import Button from '../ui/Button';
import LoadingSpinner from '../LoadingSpinner';

const CORSTest: React.FC = () => {
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

  return (
    <div className="p-6 bg-white rounded-xl shadow-soft border border-gray-100 mb-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">تست CORS Firebase Storage</h3>
      
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
            <p className="text-sm text-green-600">{result}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CORSTest;
