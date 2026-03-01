'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Briefcase, Users, LogOut, Hotel, ChevronRight, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { logout } from '@/app/actions/auth';

interface SidebarProps {
  userName: string;
  userRole: string;
}

const navItems = [
  { href: '/admin', label: 'דשבורד', icon: LayoutDashboard, exact: true },
  { href: '/admin/jobs', label: 'משרות', icon: Briefcase },
  { href: '/admin/applications', label: 'מועמדויות', icon: Users },
];

export function Sidebar({ userName, userRole }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const roleLabels: Record<string, string> = {
    ADMIN: 'מנהל מערכת',
    HR_MANAGER: 'מנהל/ת משאבי אנוש',
    RECRUITER: 'מגייס/ת',
    VIEWER: 'צופה',
  };

  return (
    <aside
      className={cn(
        'bg-[var(--color-surface)] border-l border-[var(--color-border)] flex flex-col h-screen sticky top-0 transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-[var(--color-border)]">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <Hotel className="h-5 w-5 text-[var(--color-accent)]" />
              <span className="font-semibold text-sm">ניהול גיוס</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-[var(--color-bg)] text-[var(--color-text-tertiary)] transition-colors cursor-pointer"
          >
            {collapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                isActive
                  ? 'bg-[var(--color-accent-light)] text-[var(--color-accent-hover)] font-medium'
                  : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)] hover:text-[var(--color-text-primary)]'
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-[var(--color-border)]">
        {!collapsed && (
          <div className="px-3 py-2 mb-2">
            <p className="text-sm font-medium truncate">{userName}</p>
            <p className="text-xs text-[var(--color-text-tertiary)]">{roleLabels[userRole] || userRole}</p>
          </div>
        )}
        <button
          onClick={() => logout().then(() => window.location.href = '/admin/login')}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm w-full transition-colors cursor-pointer',
            'text-[var(--color-text-secondary)] hover:bg-[var(--color-error-light)] hover:text-[var(--color-error)]'
          )}
          title={collapsed ? 'התנתק' : undefined}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span>התנתק</span>}
        </button>
      </div>
    </aside>
  );
}
