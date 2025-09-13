# راهنمای تنظیم آپلود تصویر رایگان

## 🆓 گزینه‌های رایگان:

### 1. **Cloudinary** (توصیه می‌شود)
- ✅ رایگان تا 25GB storage
- ✅ CDN جهانی
- ✅ آپلود مستقیم از مرورگر
- ✅ بدون مشکل CORS
- ✅ پردازش تصویر خودکار

### 2. **ImgBB** (ساده‌ترین)
- ✅ کاملاً رایگان
- ✅ بدون ثبت‌نام
- ✅ API ساده
- ✅ محدودیت 32MB

### 3. **Base64** (محلی)
- ✅ کاملاً رایگان
- ✅ بدون وابستگی خارجی
- ✅ محدودیت 1MB

## 🚀 تنظیم Cloudinary:

### مرحله 1: ایجاد حساب کاربری
1. به [cloudinary.com](https://cloudinary.com) بروید
2. روی "Sign Up For Free" کلیک کنید
3. حساب کاربری ایجاد کنید

### مرحله 2: دریافت اطلاعات
بعد از ورود، از Dashboard:
- **Cloud Name**: کپی کنید
- **API Key**: کپی کنید (اختیاری)
- **API Secret**: کپی کنید (اختیاری)

### مرحله 3: تنظیم Upload Preset
1. **Settings > Upload** را باز کنید
2. **Upload presets** را پیدا کنید
3. **Add upload preset** کلیک کنید
4. نام preset: `restaurant-menu`
5. **Signing Mode**: `Unsigned` انتخاب کنید
6. **Save** کنید

### مرحله 4: به‌روزرسانی کد
فایل `src/services/cloudinary.ts` را ویرایش کنید:

```typescript
const CLOUDINARY_CLOUD_NAME = 'your-actual-cloud-name'; // جایگزین کنید
const CLOUDINARY_UPLOAD_PRESET = 'restaurant-menu'; // همین نام را استفاده کنید
```

## 🔧 تنظیم ImgBB:

### مرحله 1: دریافت API Key
1. به [imgbb.com](https://imgbb.com) بروید
2. روی "Get API Key" کلیک کنید
3. API Key را کپی کنید

### مرحله 2: به‌روزرسانی کد
فایل `src/services/cloudinary.ts` را ویرایش کنید:

```typescript
// در تابع uploadImageToImgBB
const response = await fetch('https://api.imgbb.com/1/upload?key=YOUR_ACTUAL_API_KEY', {
  method: 'POST',
  body: formData,
});
```

## 📱 تست:

1. **سرور را restart کنید:**
   ```bash
   npm run dev
   ```

2. **به پنل مدیریت بروید:**
   - `http://localhost:5173/admin/login`

3. **آپلود تصویر را تست کنید:**
   - تصویری انتخاب کنید
   - روی "آپلود تصویر" کلیک کنید
   - نتیجه را بررسی کنید

## 🔄 ترتیب اولویت آپلود:

کد ما به ترتیب زیر سعی می‌کند:

1. **Cloudinary** (اگر تنظیم شده باشد)
2. **ImgBB** (اگر API Key داشته باشید)
3. **Base64** (همیشه کار می‌کند)
4. **Placeholder** (در صورت شکست همه)

## 💡 نکات مهم:

### Cloudinary:
- رایگان تا 25GB
- CDN جهانی
- پردازش تصویر خودکار
- بهترین کیفیت

### ImgBB:
- کاملاً رایگان
- بدون محدودیت زمانی
- ساده‌ترین تنظیم
- بدون CDN

### Base64:
- کاملاً محلی
- بدون وابستگی
- محدودیت حجم
- کندتر

## 🎯 نتیجه:

با این تنظیمات:
- ✅ آپلود تصویر رایگان
- ✅ بدون مشکل CORS
- ✅ چندین گزینه پشتیبان
- ✅ تجربه کاربری بهتر

## 📞 پشتیبانی:

اگر مشکل داشتید:
1. Console errors را بررسی کنید
2. API Keys را چک کنید
3. Network requests را بررسی کنید
4. مراحل تنظیم را دوباره انجام دهید
