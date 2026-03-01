import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { Sidebar } from '@/components/admin/Sidebar';
import { DensityToggle } from '@/components/admin/DensityToggle';

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/admin/login');
  }

  return (
    <div className="flex min-h-screen bg-[var(--color-bg)]">
      <Sidebar
        userName={session.user.name || ''}
        userRole={(session.user as { role: string }).role}
      />
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        <header className="bg-[var(--color-surface)] border-b border-[var(--color-border)] px-6 h-14 flex items-center justify-end sticky top-0 z-30">
          <DensityToggle />
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

