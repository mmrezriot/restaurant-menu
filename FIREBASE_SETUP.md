# راهنمای تنظیم Firebase

## مرحله 1: ایجاد فایل .env

در ریشه پروژه، فایل `.env` ایجاد کنید و مقادیر زیر را در آن قرار دهید:

```env
VITE_FIREBASE_API_KEY=AIzaSyAdSPoG54vcXr41kvq3NaGmBpbJ1hvWigY
VITE_FIREBASE_AUTH_DOMAIN=restaurant-menu-6cb97.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=restaurant-menu-6cb97
VITE_FIREBASE_STORAGE_BUCKET=restaurant-menu-6cb97.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=372521231713
VITE_FIREBASE_APP_ID=1:372521231713:web:3865cac6374bb95b83d120
```

## مرحله 2: تنظیم Firebase Console

### 1. فعال‌سازی Authentication
- به [Firebase Console](https://console.firebase.google.com) بروید
- پروژه `restaurant-menu-6cb97` را انتخاب کنید
- از منوی سمت چپ، "Authentication" را انتخاب کنید
- روی "Get started" کلیک کنید
- در تب "Sign-in method"، "Email/Password" را فعال کنید

### 2. ایجاد کاربر ادمین
- در همان صفحه Authentication، به تب "Users" بروید
- روی "Add user" کلیک کنید
- ایمیل و رمز عبور برای ادمین وارد کنید
- کاربر را ایجاد کنید

### 3. تنظیم Firestore Database
- از منوی سمت چپ، "Firestore Database" را انتخاب کنید
- روی "Create database" کلیک کنید
- "Start in test mode" را انتخاب کنید
- منطقه جغرافیایی مناسب را انتخاب کنید

### 4. تنظیم Storage
- از منوی سمت چپ، "Storage" را انتخاب کنید
- روی "Get started" کلیک کنید
- "Start in test mode" را انتخاب کنید
- منطقه جغرافیایی مناسب را انتخاب کنید

### 5. تنظیم قوانین امنیتی Firestore
- در Firestore Database، به تب "Rules" بروید
- کد زیر را جایگزین کنید:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Categories - فقط خواندن برای عموم، نوشتن فقط برای کاربران لاگین شده
    match /categories/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Foods - فقط خواندن برای عموم، نوشتن فقط برای کاربران لاگین شده
    match /foods/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

- روی "Publish" کلیک کنید

## مرحله 3: تست اپلیکیشن

1. سرور توسعه را اجرا کنید:
```bash
npm run dev
```

2. به آدرس `http://localhost:5173` بروید
3. صفحه اصلی منو را مشاهده کنید
4. برای تست پنل مدیریت، به `/admin/login` بروید
5. با ایمیل و رمز عبور ادمین وارد شوید

## مرحله 4: اضافه کردن داده‌های نمونه

### اضافه کردن دسته‌بندی‌ها:
1. وارد پنل مدیریت شوید
2. در تب "مدیریت دسته‌بندی‌ها"، دسته‌بندی‌های زیر را اضافه کنید:
   - پیش‌غذا
   - غذای اصلی
   - نوشیدنی
   - دسر

### اضافه کردن غذاها:
1. در تب "مدیریت غذاها"، غذاهای مختلف اضافه کنید
2. برای هر غذا، تصویر آپلود کنید
3. نام، توضیح، قیمت و دسته‌بندی را مشخص کنید

## مرحله 5: دیپلوی

### Vercel:
1. پروژه را به GitHub push کنید
2. در [Vercel](https://vercel.com) حساب ایجاد کنید
3. پروژه را import کنید
4. متغیرهای محیطی را در تنظیمات Vercel اضافه کنید
5. دیپلوی کنید

### Netlify:
1. پروژه را به GitHub push کنید
2. در [Netlify](https://netlify.com) حساب ایجاد کنید
3. پروژه را import کنید
4. متغیرهای محیطی را در تنظیمات Netlify اضافه کنید
5. دیپلوی کنید

## نکات مهم:

- فایل `.env` را هرگز در Git commit نکنید
- قوانین امنیتی Firebase را حتماً تنظیم کنید
- قبل از دیپلوی، اطمینان حاصل کنید که تمام متغیرهای محیطی تنظیم شده‌اند
