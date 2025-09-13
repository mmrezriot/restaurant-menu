// Cloudinary configuration
const CLOUDINARY_UPLOAD_PRESET = 'restaurant-menu'; // You'll need to create this in Cloudinary
const CLOUDINARY_CLOUD_NAME = 'your-cloud-name'; // Replace with your actual cloud name

export interface CloudinaryUploadResponse {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

// Upload image to Cloudinary
export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('فایل انتخاب شده باید تصویر باشد');
    }

    // Validate file size (max 10MB for Cloudinary free tier)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error('حجم فایل نباید بیشتر از 10 مگابایت باشد');
    }

    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', 'restaurant-menu'); // Organize images in a folder

    console.log('Uploading to Cloudinary...', { 
      fileName: file.name, 
      size: file.size, 
      type: file.type 
    });

    // Upload to Cloudinary
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Cloudinary upload failed: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data: CloudinaryUploadResponse = await response.json();
    console.log('Cloudinary upload successful:', data);

    return data.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('File too large')) {
        throw new Error('حجم فایل خیلی بزرگ است. لطفاً تصویر کوچک‌تری انتخاب کنید.');
      } else if (error.message.includes('Invalid file type')) {
        throw new Error('فرمت فایل پشتیبانی نمی‌شود. لطفاً تصویر انتخاب کنید.');
      } else {
        throw new Error(`خطا در آپلود تصویر: ${error.message}`);
      }
    }
    
    throw new Error('خطای نامشخص در آپلود تصویر');
  }
};

// Alternative: Upload to ImgBB (completely free, no signup required)
export const uploadImageToImgBB = async (file: File): Promise<string> => {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('فایل انتخاب شده باید تصویر باشد');
    }

    // Validate file size (max 32MB for ImgBB)
    const maxSize = 32 * 1024 * 1024; // 32MB
    if (file.size > maxSize) {
      throw new Error('حجم فایل نباید بیشتر از 32 مگابایت باشد');
    }

    // Convert file to base64
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]); // Remove data:image/...;base64, prefix
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    console.log('Uploading to ImgBB...', { 
      fileName: file.name, 
      size: file.size, 
      type: file.type 
    });

    // Upload to ImgBB
    const formData = new FormData();
    formData.append('image', base64);

    const response = await fetch('https://api.imgbb.com/1/upload?key=YOUR_API_KEY', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('خطا در آپلود به ImgBB');
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(`ImgBB upload failed: ${data.error?.message || 'Unknown error'}`);
    }

    console.log('ImgBB upload successful:', data);
    return data.data.url;
  } catch (error) {
    console.error('Error uploading to ImgBB:', error);
    
    if (error instanceof Error) {
      throw new Error(`خطا در آپلود تصویر: ${error.message}`);
    }
    
    throw new Error('خطای نامشخص در آپلود تصویر');
  }
};

// Fallback: Convert to base64 and store locally
export const convertToBase64 = async (file: File): Promise<string> => {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('فایل انتخاب شده باید تصویر باشد');
    }

    // Validate file size (max 1MB for base64)
    const maxSize = 1024 * 1024; // 1MB
    if (file.size > maxSize) {
      throw new Error('حجم فایل نباید بیشتر از 1 مگابایت باشد (برای ذخیره محلی)');
    }

    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  } catch (error) {
    console.error('Error converting to base64:', error);
    throw new Error('خطا در تبدیل تصویر');
  }
};
