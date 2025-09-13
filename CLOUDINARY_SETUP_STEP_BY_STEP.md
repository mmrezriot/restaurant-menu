# راهنمای گام به گام تنظیم Cloudinary

## ✅ مرحله 1: اطلاعات دریافت شده
- **Cloud name**: `dko1nxamy` ✅
- **API key**: `981781844821532` ✅

## 🔧 مرحله 2: ایجاد Upload Preset

### 1. به Cloudinary Dashboard بروید:
- [console.cloudinary.com](https://console.cloudinary.com)
- با حساب کاربری خود وارد شوید

### 2. Settings را باز کنید:
- از منوی سمت چپ، **"Settings"** را کلیک کنید
- روی **"Upload"** کلیک کنید

### 3. Upload Preset ایجاد کنید:
- بخش **"Upload presets"** را پیدا کنید
- روی **"Add upload preset"** کلیک کنید

### 4. تنظیمات Preset:
- **Preset name**: `restaurant-menu`
- **Signing Mode**: **"Unsigned"** انتخاب کنید
- **Folder**: `restaurant-menu` (اختیاری)
- **Transformation**: خالی بگذارید
- **Access mode**: **"Public"** انتخاب کنید

### 5. ذخیره کنید:
- روی **"Save"** کلیک کنید

## 🧪 مرحله 3: تست آپلود

### 1. سرور را restart کنید:
```bash
npm run dev
```

### 2. به پنل مدیریت بروید:
- `http://localhost:5173/admin/login`

### 3. تست آپلود:
- کامپوننت "تست آپلود تصویر رایگان" را پیدا کنید
- تصویری انتخاب کنید
- روی "تست آپلود" کلیک کنید

## ✅ نتیجه مورد انتظار:

اگر همه چیز درست باشد، باید پیام زیر را ببینید:
```
✅ آپلود موفق! URL: https://res.cloudinary.com/dko1nxamy/image/upload/v1234567890/restaurant-menu/...
```

## 🔧 عیب‌یابی:

### اگر خطای "Invalid upload preset" دریافت کردید:
1. مطمئن شوید preset نام `restaurant-menu` دارد
2. مطمئن شوید preset روی "Unsigned" تنظیم شده
3. مطمئن شوید preset ذخیره شده است

### اگر خطای "Unauthorized" دریافت کردید:
1. Cloud name را دوباره چک کنید
2. مطمئن شوید preset public است

## 🎯 مراحل بعدی:

بعد از موفقیت‌آمیز بودن تست:
1. **کامپوننت تست را حذف کنید** (اختیاری)
2. **از آپلود واقعی استفاده کنید**
3. **تصاویر غذاها را آپلود کنید**

## 📱 ویژگی‌های Cloudinary:

- ✅ **رایگان تا 25GB**
- ✅ **CDN جهانی**
- ✅ **پردازش تصویر خودکار**
- ✅ **بهینه‌سازی خودکار**
- ✅ **بدون مشکل CORS**

## 🚀 آماده استفاده!

بعد از ایجاد Upload Preset، آپلود تصاویر کاملاً کار خواهد کرد!
