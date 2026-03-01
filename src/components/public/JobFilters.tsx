'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

interface FilterOption {
  value: string;
  label: string;
}

interface JobFiltersProps {
  hotels: FilterOption[];
  departments: FilterOption[];
}

export function JobFilters({ hotels, departments }: JobFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/jobs?${params.toString()}`);
    },
    [router, searchParams]
  );

  const employmentTypes = [
    { value: 'FULL_TIME', label: 'משרה מלאה' },
    { value: 'PART_TIME', label: 'משרה חלקית' },
    { value: 'CONTRACT', label: 'חוזה' },
    { value: 'TEMPORARY', label: 'זמני' },
    { value: 'INTERNSHIP', label: 'התמחות' },
  ];

  return (
    <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] px-5 py-4 md:px-6 md:py-5 shadow-sm/40">
      <div className="flex items-center justify-between gap-4 mb-4">
        <p className="text-xs text-[var(--color-text-secondary)]">
          סננו לפי מלון, מחלקה או סוג משרה כדי לדייק את החיפוש.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-tertiary)]" />
          <Input
            placeholder="חיפוש לפי תפקיד, עיר או מילות מפתח"
            className="pe-10"
            defaultValue={searchParams.get('q') || ''}
            onChange={(e) => {
              const timeout = setTimeout(() => updateFilter('q', e.target.value), 300);
              return () => clearTimeout(timeout);
            }}
          />
        </div>
        <Select
          options={hotels}
          placeholder="כל המלונות"
          value={searchParams.get('hotel') || ''}
          onChange={(e) => updateFilter('hotel', e.target.value)}
        />
        <Select
          options={departments}
          placeholder="כל המחלקות"
          value={searchParams.get('department') || ''}
          onChange={(e) => updateFilter('department', e.target.value)}
        />
        <Select
          options={employmentTypes}
          placeholder="סוג משרה"
          value={searchParams.get('type') || ''}
          onChange={(e) => updateFilter('type', e.target.value)}
        />
      </div>
    </div>
  );
}
