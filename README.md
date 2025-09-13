# منوی رستوران - Restaurant Menu App

یک اپلیکیشن React کامل برای نمایش منوی رستوران با پنل مدیریت و Firebase.

## ویژگی‌ها

### صفحه اصلی (Landing Page)
- نمایش دسته‌بندی‌های غذا
- کارت‌های زیبای غذا با تصویر، نام، توضیح و قیمت
- فیلتر بر اساس دسته‌بندی
- طراحی RTL (راست‌چین) برای زبان فارسی
- طراحی ریسپانسیو برای موبایل و دسکتاپ

### پنل مدیریت (Admin Panel)
- ورود امن با Firebase Authentication
- مدیریت دسته‌بندی‌ها (اضافه، ویرایش، حذف)
- مدیریت غذاها (اضافه، ویرایش، حذف)
- آپلود تصاویر به Firebase Storage
- رابط کاربری مدرن و کاربرپسند

## تکنولوژی‌های استفاده شده

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Routing**: React Router Dom
- **State Management**: React Query (TanStack Query)
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Icons**: Lucide React
- **Font**: Vazirmatn (فونت فارسی)

## نصب و راه‌اندازی

### پیش‌نیازها
- Node.js (نسخه 16 یا بالاتر)
- npm یا yarn
- حساب Firebase

### مراحل نصب

1. **کلون کردن پروژه**
```bash
git clone https://github.com/mmrezriot/restaurant-menu.git
cd restaurant-menu
```

2. **نصب وابستگی‌ها**
```bash
npm install
```

3. **تنظیم Firebase**
   - پروژه جدید در [Firebase Console](https://console.firebase.google.com) ایجاد کنید
   - Authentication را فعال کنید (Email/Password)
   - Firestore Database ایجاد کنید
   - Storage ایجاد کنید
   - فایل `.env` ایجاد کنید و مقادیر Firebase را وارد کنید:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. **تنظیم قوانین امنیتی Firestore**

در Firebase Console، به بخش Firestore Database > Rules بروید و قوانین زیر را اعمال کنید:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Categories - فقط خواندن برای عموم
    match /categories/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Foods - فقط خواندن برای عموم
    match /foods/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

5. **ایجاد کاربر ادمین**
   - در Firebase Console، به بخش Authentication بروید
   - کاربر جدید با ایمیل و رمز عبور ایجاد کنید
   - این کاربر برای ورود به پنل مدیریت استفاده می‌شود

6. **اجرای پروژه**
```bash
npm run dev
```

پروژه روی `http://localhost:5173` اجرا می‌شود.

## ساختار پروژه

```
src/
├── components/           # کامپوننت‌های قابل استفاده مجدد
│   ├── ui/              # کامپوننت‌های UI پایه
│   ├── Admin/           # کامپوننت‌های پنل مدیریت
│   ├── FoodCard.tsx     # کارت نمایش غذا
│   ├── CategoryFilter.tsx # فیلتر دسته‌بندی
│   └── LoadingSpinner.tsx # اسپینر لودینگ
├── context/             # Context های React
│   └── AuthContext.tsx  # مدیریت احراز هویت
├── hooks/               # Custom Hooks
├── lib/                 # توابع کمکی
│   └── utils.ts         # توابع عمومی
├── pages/               # صفحات اصلی
│   ├── Landing.tsx      # صفحه اصلی
│   └── Admin/           # صفحات پنل مدیریت
│       ├── Login.tsx    # ورود ادمین
│       └── Dashboard.tsx # داشبورد مدیریت
├── services/            # سرویس‌های Firebase
│   ├── firebase.ts      # تنظیمات Firebase
│   └── firestore.ts     # عملیات دیتابیس
├── types/               # تعریف انواع TypeScript
│   └── index.ts         # انواع اصلی
├── App.tsx              # کامپوننت اصلی
└── main.tsx             # نقطه ورود
```

## استفاده از اپلیکیشن

### صفحه اصلی
- دسته‌بندی‌ها را انتخاب کنید تا غذاهای مربوطه را ببینید
- از دکمه "همه" برای نمایش تمام غذاها استفاده کنید

### پنل مدیریت
1. به آدرس `/admin/login` بروید
2. با ایمیل و رمز عبور ادمین وارد شوید
3. در تب "مدیریت دسته‌بندی‌ها":
   - دسته‌بندی جدید اضافه کنید
   - دسته‌بندی‌های موجود را ویرایش یا حذف کنید
4. در تب "مدیریت غذاها":
   - غذا جدید اضافه کنید (با آپلود تصویر)
   - غذاهای موجود را ویرایش یا حذف کنید

## دیپلوی

### Vercel
1. پروژه را به GitHub push کنید
2. در [Vercel](https://vercel.com) حساب ایجاد کنید
3. پروژه را import کنید
4. متغیرهای محیطی را در تنظیمات Vercel اضافه کنید
5. دیپلوی کنید

### Netlify
1. پروژه را به GitHub push کنید
2. در [Netlify](https://netlify.com) حساب ایجاد کنید
3. پروژه را import کنید
4. متغیرهای محیطی را در تنظیمات Netlify اضافه کنید
5. دیپلوی کنید

## اسکریپت‌های موجود

```bash
npm run dev          # اجرای پروژه در حالت توسعه
npm run build        # ساخت پروژه برای تولید
npm run preview      # پیش‌نمایش پروژه ساخته شده
npm run lint         # بررسی کد با ESLint
```

## مشارکت

1. Fork کنید
2. شاخه جدید ایجاد کنید (`git checkout -b feature/amazing-feature`)
3. تغییرات را commit کنید (`git commit -m 'Add some amazing feature'`)
4. به شاخه push کنید (`git push origin feature/amazing-feature`)
5. Pull Request ایجاد کنید

## لایسنس

این پروژه تحت لایسنس MIT منتشر شده است.

## پشتیبانی

اگر سوال یا مشکلی دارید، لطفاً issue جدید در GitHub ایجاد کنید.

---

**نکته**: قبل از استفاده در محیط تولید، حتماً متغیرهای محیطی را تنظیم کنید و قوانین امنیتی Firebase را بررسی کنید.