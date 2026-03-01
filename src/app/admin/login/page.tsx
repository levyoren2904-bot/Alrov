'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Hotel } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { login } from '@/app/actions/auth';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const result = await login(formData);

      if (result.error) {
        setError(result.error);
      } else {
        router.push('/admin');
        router.refresh();
      }
    } catch {
      setError('אירעה שגיאה. נא לנסות שנית.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-soft-bg)] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-[var(--color-accent)]/10 flex items-center justify-center mx-auto mb-4">
            <Hotel className="h-7 w-7 text-[var(--color-accent)]" />
          </div>
          <h1 className="text-xl font-bold">כניסה למערכת הניהול</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            אלרוב נכסים ומלונאות
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-[var(--color-error-light)] text-[var(--color-error)] text-sm text-center">
            {error}
          </div>
        )}

        <Card>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="אימייל"
                name="email"
                type="email"
                required
                placeholder="you@alrov.co.il"
                dir="ltr"
              />
              <Input
                label="סיסמה"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                dir="ltr"
              />
              <Button type="submit" className="w-full" loading={loading}>
                התחבר
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
