'use client';

import { Toaster as SonnerToaster } from 'sonner';

function Toaster() {
  return (
    <SonnerToaster
      position="bottom-left"
      dir="rtl"
      toastOptions={{
        style: {
          background: 'var(--color-surface)',
          color: 'var(--color-text-primary)',
          border: '1px solid var(--color-border)',
          borderRadius: '0.75rem',
          fontFamily: 'var(--font-heebo), system-ui, sans-serif',
        },
      }}
    />
  );
}

export { Toaster };
