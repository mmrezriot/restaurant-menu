# راهنمای کامل حل مشکل CORS Firebase Storage

## 🚨 مشکل فعلی:
```
Access to XMLHttpRequest at 'https://firebasestorage.googleapis.com/v0/b/restaurant-menu-6cb97.appspot.com/o?name=food-images%2F...' from origin 'http://localhost:5173' has been blocked by CORS policy
```

## 🔍 علت مشکل:

مشکل CORS در Firebase Storage معمولاً به دلایل زیر است:

1. **تنظیمات CORS نادرست** در Google Cloud Storage
2. **مشکل در احراز هویت** Firebase
3. **تنظیمات نادرست bucket** 
4. **مشکل در Firebase Storage Rules**

## ✅ راه‌حل‌های مختلف:

### 1. راه‌حل فوری (موقت):
کد ما حالا از تصاویر placeholder استفاده می‌کند اگر CORS مشکل داشته باشد.

### 2. راه‌حل کامل (دائمی):

#### مرحله 1: تنظیم Firebase Storage Rules
به [Firebase Console](https://console.firebase.google.com) بروید:

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

3. **Publish** کنید

#### مرحله 2: تنظیم CORS با gsutil
```bash
# 1. نصب Google Cloud SDK (اگر نصب نیست)
# Windows: از https://cloud.google.com/sdk/docs/install-sdk#windows دانلود کنید

# 2. احراز هویت
gcloud auth login

# 3. تنظیم پروژه
gcloud config set project restaurant-menu-6cb97

# 4. اعمال CORS
gsutil cors set cors-config.json gs://restaurant-menu-6cb97.appspot.com

# 5. بررسی
gsutil cors get gs://restaurant-menu-6cb97.appspot.com
```

#### مرحله 3: تنظیمات Google Cloud Console
به [Google Cloud Console](https://console.cloud.google.com) بروید:

1. **Storage > Browser** را باز کنید
2. روی bucket `restaurant-menu-6cb97.appspot.com` کلیک کنید
3. **Permissions** را باز کنید
4. **Add Principal** کلیک کنید
5. در فیلد **New principals** بنویسید: `allUsers`
6. در فیلد **Role** انتخاب کنید: `Storage Object Viewer`
7. **Save** کنید

#### مرحله 4: تنظیمات Environment Variables
مطمئن شوید که `.env` درست تنظیم شده:

```env
VITE_FIREBASE_API_KEY=AIzaSyAdSPoG54vcXr41kvq3NaGmBpbJ1hvWigY
VITE_FIREBASE_AUTH_DOMAIN=restaurant-menu-6cb97.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=restaurant-menu-6cb97
VITE_FIREBASE_STORAGE_BUCKET=restaurant-menu-6cb97.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=372521231713
VITE_FIREBASE_APP_ID=1:372521231713:web:3865cac6374bb95b83d120
```

## 🧪 تست:

1. **سرور را restart کنید:**
   ```bash
   npm run dev
   ```

2. **به پنل مدیریت بروید:**
   - `http://localhost:5173/admin/login`

3. **کامپوننت تست CORS را امتحان کنید:**
   - تصویری انتخاب کنید
   - روی "تست آپلود" کلیک کنید
   - نتیجه را بررسی کنید

## 🔧 عیب‌یابی:

### اگر هنوز مشکل CORS دارید:

1. **Console را بررسی کنید** - خطاهای دقیق را ببینید
2. **Network tab را چک کنید** - درخواست‌ها را بررسی کنید
3. **احراز هویت را بررسی کنید** - مطمئن شوید لاگین شده‌اید
4. **Storage Rules را چک کنید** - در Firebase Console
5. **CORS settings را بررسی کنید** - با gsutil

### اگر آپلود کار نمی‌کند:

1. **مطمئن شوید از Firebase SDK استفاده می‌کنید**
2. **احراز هویت انجام شده باشد**
3. **Storage Rules درست تنظیم شده باشد**
4. **نام bucket صحیح باشد**

## 📱 پشتیبانی از مرورگرها:

- ✅ Chrome 88+
- ✅ Firefox 85+
- ✅ Safari 14+
- ✅ Edge 88+

## 🎯 نتیجه:

با این راه‌حل‌ها:
- ✅ مشکل CORS حل می‌شود
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
5. CORS settings را دوباره اعمال کنید

## 🔄 راه‌حل موقت:

تا زمانی که مشکل CORS حل شود، اپلیکیشن از تصاویر placeholder استفاده می‌کند تا کاربران بتوانند از آن استفاده کنند.
