# حل مشکل CORS Firebase Storage

## مشکل:
```
Access to XMLHttpRequest at 'https://firebasestorage.googleapis.com/v0/b/restaurant-menu-6cb97.firebasestorage.app/o?name=food-images%2F...' from origin 'http://localhost:5173' has been blocked by CORS policy
```

## راه‌حل:

### 1. تنظیم Firebase Storage Rules
به [Firebase Console](https://console.firebase.google.com) بروید:

1. پروژه `restaurant-menu-6cb97` را انتخاب کنید
2. از منوی سمت چپ، "Storage" را انتخاب کنید
3. به تب "Rules" بروید
4. کد زیر را جایگزین کنید:

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

5. روی "Publish" کلیک کنید

### 2. تنظیم CORS برای localhost
اگر مشکل ادامه داشت، باید CORS را برای localhost تنظیم کنید:

1. به [Google Cloud Console](https://console.cloud.google.com) بروید
2. پروژه `restaurant-menu-6cb97` را انتخاب کنید
3. از منوی سمت چپ، "Cloud Storage" را انتخاب کنید
4. روی نام bucket کلیک کنید
5. به تب "Permissions" بروید
6. "Add Principal" کلیک کنید
7. در فیلد "New principals" بنویسید: `allUsers`
8. در فیلد "Role" انتخاب کنید: `Storage Object Viewer`
9. "Save" کلیک کنید

### 3. تست
بعد از اعمال تغییرات:
1. صفحه را refresh کنید
2. به پنل مدیریت بروید (`/admin/login`)
3. سعی کنید تصویری آپلود کنید

### 4. راه‌حل موقت
اگر مشکل ادامه داشت، اپلیکیشن از تصاویر placeholder استفاده می‌کند تا زمانی که مشکل حل شود.

## نکات مهم:
- مطمئن شوید که کاربر لاگین شده است
- Storage bucket درست تنظیم شده است
- قوانین امنیتی اعمال شده‌اند
