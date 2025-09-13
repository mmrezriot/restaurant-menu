# راهنمای حل مشکل CORS Firebase Storage

## مشکل:
```
Access to XMLHttpRequest at 'https://firebasestorage.googleapis.com/v0/b/restaurant-menu-6cb97.firebasestorage.app/o?name=food-images%2F...' from origin 'http://localhost:5173' has been blocked by CORS policy
```

## راه‌حل:

### 1. نصب Google Cloud SDK
اگر Google Cloud SDK نصب نیست، ابتدا آن را نصب کنید:
- Windows: از [اینجا](https://cloud.google.com/sdk/docs/install-sdk#windows) دانلود کنید
- یا از Chocolatey: `choco install gcloudsdk`

### 2. احراز هویت
```bash
gcloud auth login
gcloud config set project restaurant-menu-6cb97
```

### 3. اعمال تنظیمات CORS
فایل `cors-config.json` در ریشه پروژه ایجاد شده است. حالا آن را روی bucket اعمال کنید:

```bash
gsutil cors set cors-config.json gs://restaurant-menu-6cb97.appspot.com
```

### 4. بررسی تنظیمات
برای اطمینان از اعمال شدن تنظیمات:
```bash
gsutil cors get gs://restaurant-menu-6cb97.appspot.com
```

### 5. تست
بعد از اعمال تنظیمات:
1. سرور development را restart کنید
2. به پنل مدیریت بروید (`/admin/login`)
3. سعی کنید تصویری آپلود کنید

## تنظیمات CORS اعمال شده:

```json
[
  {
    "origin": ["http://localhost:5173", "https://localhost:5173"],
    "method": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    "responseHeader": ["Content-Type", "Authorization", "X-Requested-With"],
    "maxAgeSeconds": 3600
  }
]
```

## نکات مهم:

1. **نام bucket صحیح:** `restaurant-menu-6cb97.appspot.com`
2. **پورت development:** `5173`
3. **پروتکل‌ها:** HTTP و HTTPS هر دو پشتیبانی می‌شوند
4. **متدها:** تمام متدهای مورد نیاز پشتیبانی می‌شوند

## عیب‌یابی:

اگر مشکل ادامه داشت:
1. مطمئن شوید که Google Cloud SDK نصب است
2. احراز هویت انجام شده باشد
3. پروژه صحیح انتخاب شده باشد
4. دستورات را در PowerShell یا Command Prompt اجرا کنید

## دستورات کامل:

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
