import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'מדיניות פרטיות',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-8">מדיניות פרטיות</h1>

      <div className="prose prose-sm max-w-none space-y-6 text-[var(--color-text-secondary)] leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-3">כללי</h2>
          <p>
            אלרוב נכסים ומלונאות בע״מ (להלן: &quot;החברה&quot;) מכבדת את פרטיות המשתמשים באתר הקריירה שלה.
            מדיניות זו מתארת כיצד אנו אוספים, משתמשים ומגנים על המידע האישי שלך.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-3">איסוף מידע</h2>
          <p>
            במסגרת הגשת מועמדות למשרות באתר, אנו אוספים את המידע הבא:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>שם מלא</li>
            <li>כתובת אימייל</li>
            <li>מספר טלפון</li>
            <li>עיר מגורים</li>
            <li>קישור לפרופיל LinkedIn (אופציונלי)</li>
            <li>קורות חיים (קובץ)</li>
            <li>תשובות לשאלות סינון</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-3">שימוש במידע</h2>
          <p>
            המידע שנאסף משמש אך ורק לצורכי תהליך הגיוס, לרבות:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>בחינת התאמתך למשרות פנויות</li>
            <li>יצירת קשר בנוגע לתהליך המיון</li>
            <li>שמירת המידע לצורך משרות עתידיות (בכפוף להסכמתך)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-3">אחסון ואבטחה</h2>
          <p>
            אנו נוקטים באמצעי אבטחה מתאימים כדי להגן על המידע האישי שלך מפני גישה בלתי מורשית,
            שימוש לרעה או חשיפה. המידע מאוחסן בשרתים מאובטחים בהתאם לתקנות הגנת הפרטיות.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-3">שמירת המידע</h2>
          <p>
            מידע אישי של מועמדים נשמר למשך 12 חודשים ממועד ההגשה, אלא אם כן ניתנה הסכמה
            לשמירה ממושכת יותר. לאחר תקופה זו, המידע יימחק או יעבור אנונימיזציה.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-3">זכויות המועמד</h2>
          <p>
            בהתאם לחוק הגנת הפרטיות, עומדות לך הזכויות הבאות:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>זכות לעיין במידע השמור אודותיך</li>
            <li>זכות לתקן מידע שגוי</li>
            <li>זכות לבקש מחיקת המידע</li>
            <li>זכות לבטל הסכמה לשמירת מידע</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-3">יצירת קשר</h2>
          <p>
            לשאלות בנוגע למדיניות פרטיות זו או לצורך מימוש זכויותיך, ניתן לפנות אלינו:
          </p>
          <p className="mt-2" dir="ltr">
            hr@alrov.co.il
          </p>
        </section>

        <p className="text-xs text-[var(--color-text-tertiary)] pt-6 border-t border-[var(--color-border)]">
          עדכון אחרון: פברואר 2026
        </p>
      </div>
    </div>
  );
}
