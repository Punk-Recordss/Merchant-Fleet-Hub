'use client';

import { VERSION } from '@/lib/version';

export function VersionFooter() {
  return (
    <footer className="fixed bottom-4 right-4 text-[10px] font-mono text-[var(--text-muted)] opacity-50 hover:opacity-100 transition-opacity">
      <span title="Fleet Version">v{VERSION}</span>
    </footer>
  );
}
