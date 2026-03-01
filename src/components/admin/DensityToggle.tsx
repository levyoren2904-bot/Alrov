'use client';

import { useState, useEffect } from 'react';
import { AlignJustify, List } from 'lucide-react';
import { cn } from '@/lib/utils';

export function DensityToggle() {
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');

  useEffect(() => {
    const saved = localStorage.getItem('admin-density') as 'comfortable' | 'compact';
    if (saved) {
      setDensity(saved);
      document.documentElement.classList.toggle('density-compact', saved === 'compact');
      document.documentElement.classList.toggle('density-comfortable', saved === 'comfortable');
    } else {
      document.documentElement.classList.add('density-comfortable');
    }
  }, []);

  const toggle = (value: 'comfortable' | 'compact') => {
    setDensity(value);
    localStorage.setItem('admin-density', value);
    document.documentElement.classList.toggle('density-compact', value === 'compact');
    document.documentElement.classList.toggle('density-comfortable', value === 'comfortable');
  };

  return (
    <div className="flex items-center bg-[var(--color-bg)] rounded-lg p-0.5">
      <button
        onClick={() => toggle('comfortable')}
        className={cn(
          'p-1.5 rounded-md transition-colors cursor-pointer',
          density === 'comfortable'
            ? 'bg-[var(--color-surface)] shadow-sm text-[var(--color-text-primary)]'
            : 'text-[var(--color-text-tertiary)]'
        )}
        title="תצוגה מרווחת"
      >
        <List className="h-4 w-4" />
      </button>
      <button
        onClick={() => toggle('compact')}
        className={cn(
          'p-1.5 rounded-md transition-colors cursor-pointer',
          density === 'compact'
            ? 'bg-[var(--color-surface)] shadow-sm text-[var(--color-text-primary)]'
            : 'text-[var(--color-text-tertiary)]'
        )}
        title="תצוגה צפופה"
      >
        <AlignJustify className="h-4 w-4" />
      </button>
    </div>
  );
}
