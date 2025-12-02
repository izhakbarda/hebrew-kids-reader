# מה נשמר ב-Supabase - סיכום

## 📊 נתונים שנשמרים ב-Supabase Authentication

### בהרשמה (Registration):
כאשר משתמש נרשם דרך `Login.jsx`, הפונקציה `supabase.auth.signUp()` נקראת עם:

```javascript
supabase.auth.signUp({
    email: email,              // כתובת המייל
    password: password,        // הסיסמה (מוצפנת אוטומטית)
    options: {
        data: {
            child_name: childName  // שם הילד
        }
    }
})
```

### מה נשמר בפועל:

#### 1. **טבלת auth.users** (מנוהלת אוטומטית על ידי Supabase):
- ✅ `id` - UUID ייחודי למשתמש
- ✅ `email` - כתובת המייל
- ✅ `encrypted_password` - הסיסמה מוצפנת
- ✅ `email_confirmed_at` - תאריך אימות המייל (null אם לא אומת)
- ✅ `created_at` - תאריך יצירת החשבון
- ✅ `updated_at` - תאריך עדכון אחרון
- ✅ `last_sign_in_at` - תאריך התחברות אחרונה
- ✅ `raw_user_meta_data` - מכיל: `{ "child_name": "שם הילד" }`

#### 2. **user_metadata** (נתונים נוספים):
- ✅ `child_name` - שם הילד/ה

### בהתחברות (Login):
כאשר משתמש מתחבר, הפונקציה `supabase.auth.signInWithPassword()` מאמתת:
- ✅ כתובת המייל קיימת
- ✅ הסיסמה נכונה (מול הסיסמה המוצפנת)
- ✅ מעדכנת את `last_sign_in_at`

### שכחתי סיסמה (Password Reset):
כאשר משתמש לוחץ "שכחתי סיסמה", הפונקציה `supabase.auth.resetPasswordForEmail()`:
- ✅ שולחת מייל אמיתי לכתובת המייל
- ✅ המייל מכיל קישור לאיפוס סיסמה
- ✅ הקישור מוביל ל-`window.location.origin` (האפליקציה שלנו)

## 📝 נתונים שנשמרים ב-localStorage (מקומי בדפדפן):

### lastLogin:
```javascript
{
    "childName": "שם הילד",
    "email": "email@example.com"
}
```
- מטרה: למלא אוטומטית את השדות בפעם הבאה

## ✅ סיכום:
כל הנתונים הנדרשים נשמרים ב-Supabase:
1. **מייל** - נשמר ב-auth.users
2. **סיסמה** - נשמרת מוצפנת ב-auth.users
3. **שם הילד** - נשמר ב-user_metadata

## 🔒 אבטחה:
- הסיסמאות מוצפנות אוטומטית על ידי Supabase
- אין גישה ישירה לסיסמאות (רק hash)
- ניתן לאפס סיסמה רק דרך מייל
