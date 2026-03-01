'use client';

import { Share2 } from 'lucide-react';

interface ShareButtonsProps {
  url: string;
  title: string;
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="flex items-center gap-3">
      <Share2 className="h-4 w-4 text-[var(--color-text-tertiary)]" />
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors"
      >
        LinkedIn
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors"
      >
        Facebook
      </a>
      <a
        href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors"
      >
        WhatsApp
      </a>
    </div>
  );
}
