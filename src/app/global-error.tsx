'use client';

/**
 * Catches unhandled server/client errors and shows a friendlier page.
 * The real error is in Vercel → Deployments → Logs.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="he" dir="rtl">
      <body style={{ fontFamily: 'system-ui', padding: '2rem', maxWidth: '32rem', margin: '0 auto' }}>
        <h1 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>שגיאה בטעינת האתר</h1>
        <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
          אירעה תקלה בשרת. נסו לרענן את הדף. אם הבעיה נמשכת, בדקו את לוגי השרת ב-Vercel.
        </p>
        {process.env.NODE_ENV === 'development' && (
          <pre style={{ fontSize: '0.75rem', overflow: 'auto', padding: '1rem', background: '#f3f4f6', borderRadius: '0.5rem' }}>
            {error.message}
          </pre>
        )}
        <button
          type="button"
          onClick={() => reset()}
          style={{
            padding: '0.5rem 1rem',
            background: '#1f2a44',
            color: 'white',
            border: 'none',
            borderRadius: '0.25rem',
            cursor: 'pointer',
          }}
        >
          נסה שוב
        </button>
      </body>
    </html>
  );
}
