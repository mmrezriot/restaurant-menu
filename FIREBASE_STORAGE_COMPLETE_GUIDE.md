# راهنمای کامل حل مشکل CORS Firebase Storage

## 🔍 علت مشکل CORS:

مشکل CORS در Firebase Storage معمولاً به دلایل زیر اتفاق می‌افتد:

1. **استفاده از REST API به جای Firebase SDK**
2. **تنظیمات نادرست CORS**
3. **مشکل در احراز هویت**
4. **تنظیمات نادرست bucket**

## ✅ راه‌حل کامل:

### 1. استفاده از Firebase SDK (توصیه شده)

کد ما حالا از Firebase SDK استفاده می‌کند که مشکل CORS ندارد:

```typescript
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const uploadImage = async (file: File): Promise<string> => {
  try {
    // Create storage reference
    const storageRef = ref(storage, `food-images/${fileName}`);
    
    // Upload with metadata
    const snapshot = await uploadBytes(storageRef, file, metadata);
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    // Handle errors
  }
};
```

### 2. تنظیمات Firebase Storage Rules

در [Firebase Console](https://console.firebase.google.com):

1. **Storage > Rules** را باز کنید
2. کد زیر را جایگزین کنید:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow read access to all files
    match /{allPaths=**} {
      allow read: if true;
    }
    
    // Allow write access only to authenticated users
    match /food-images/{allPaths=**} {
      allow write: if request.auth != null;
    }
  }
}
```

### 3. تنظیمات CORS (اختیاری)

اگر هنوز مشکل دارید، CORS را تنظیم کنید:

```bash
# 1. احراز هویت
gcloud auth login

# 2. تنظیم پروژه
gcloud config set project restaurant-menu-6cb97

# 3. اعمال CORS
gsutil cors set cors-config.json gs://restaurant-menu-6cb97.appspot.com

# 4. بررسی
gsutil cors get gs://restaurant-menu-6cb97.appspot.com
```

### 4. تنظیمات Environment Variables

مطمئن شوید که `.env` درست تنظیم شده:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=restaurant-menu-6cb97.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=restaurant-menu-6cb97
VITE_FIREBASE_STORAGE_BUCKET=restaurant-menu-6cb97.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 🚀 ویژگی‌های پیاده‌سازی شده:

### 1. کامپوننت ImageUpload پیشرفته:
- ✅ انتخاب فایل با drag & drop
- ✅ پیش‌نمایش تصویر
- ✅ اعتبارسنجی نوع و حجم فایل
- ✅ نمایش پیشرفت آپلود
- ✅ مدیریت خطاها
- ✅ پشتیبانی از RTL

### 2. مدیریت خطاهای Firebase:
- ✅ `storage/unauthorized` - مشکل احراز هویت
- ✅ `storage/canceled` - لغو آپلود
- ✅ `storage/unknown` - خطای نامشخص
- ✅ `storage/invalid-format` - فرمت نامعتبر
- ✅ `storage/invalid-checksum` - فایل آسیب دیده

### 3. ویژگی‌های امنیتی:
- ✅ اعتبارسنجی نوع فایل (فقط تصویر)
- ✅ محدودیت حجم (5 مگابایت)
- ✅ نام فایل منحصر به فرد
- ✅ متادیتای سفارشی

## 🧪 تست:

1. **سرور را restart کنید:**
   ```bash
   npm run dev
   ```

2. **به پنل مدیریت بروید:**
   - `http://localhost:5173/admin/login`

3. **آپلود تصویر را تست کنید:**
   - تصاویر مختلف (JPG, PNG, WEBP)
   - حجم‌های مختلف
   - فرمت‌های نامعتبر

## 🔧 عیب‌یابی:

### اگر هنوز مشکل CORS دارید:

1. **مطمئن شوید از Firebase SDK استفاده می‌کنید**
2. **احراز هویت انجام شده باشد**
3. **Storage Rules درست تنظیم شده باشد**
4. **نام bucket صحیح باشد**

### اگر آپلود کار نمی‌کند:

1. **Console را بررسی کنید**
2. **Network tab را چک کنید**
3. **احراز هویت را بررسی کنید**
4. **Storage Rules را چک کنید**

## 📱 پشتیبانی از مرورگرها:

- ✅ Chrome 88+
- ✅ Firefox 85+
- ✅ Safari 14+
- ✅ Edge 88+

## 🎯 نتیجه:

با این پیاده‌سازی:
- ✅ مشکل CORS حل شده
- ✅ آپلود سریع و قابل اعتماد
- ✅ تجربه کاربری بهتر
- ✅ مدیریت خطای پیشرفته
- ✅ پشتیبانی کامل از RTL

## 📞 پشتیبانی:

اگر مشکل ادامه داشت:
1. Console errors را بررسی کنید
2. Network requests را چک کنید
3. Firebase Console logs را بررسی کنید
4. Storage Rules را دوباره تنظیم کنید
