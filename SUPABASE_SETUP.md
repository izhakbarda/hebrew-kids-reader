# Hebrew Kids Reader - Supabase Setup

## הגדרת Supabase

### שלב 1: יצירת פרויקט Supabase

1. היכנס ל-[Supabase Dashboard](https://app.supabase.com)
2. צור פרויקט חדש או בחר פרויקט קיים
3. עבור ל-Settings → API
4. העתק את:
   - `Project URL` (URL של הפרויקט)
   - `anon public` key (המפתח הציבורי)

### שלב 2: הגדרת משתני סביבה

1. צור קובץ `.env` בתיקיית הפרויקט:
```bash
cp .env.example .env
```

2. ערוך את הקובץ `.env` והוסף את הפרטים שלך:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### שלב 3: הפעלת Authentication ב-Supabase

1. בדשבורד של Supabase, עבור ל-Authentication → Providers
2. ודא ש-Email provider מופעל
3. (אופציונלי) התאם את הגדרות האימייל ב-Authentication → Email Templates

### שלב 4: הרצת האפליקציה

```bash
npm run dev
```

## תכונות Authentication

- **הרשמה**: יוצר משתמש חדש עם מייל, סיסמה ושם ילד
- **התחברות**: מאמת משתמש קיים
- **שכחתי סיסמה**: שולח מייל לאיפוס סיסמה
- **שמירת פרטים**: שומר את שם הילד ב-user metadata

## הערות

- הסיסמאות מוצפנות ב-Supabase
- המידע מאוחסן בצורה מאובטחת
- ניתן להוסיף providers נוספים (Google, GitHub וכו') בעתיד
