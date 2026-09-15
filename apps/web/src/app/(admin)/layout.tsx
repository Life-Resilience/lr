import { Suspense } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AdminNavbar } from '@/components/admin/AdminNavbar';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminSessionGuard } from '@/components/admin/AdminSessionGuard';
import { verifyAdminToken, getAdminConfig } from '@/lib/admin-auth';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const isLocked = cookieStore.get('lr-admin-locked')?.value === 'true';
  const sessionToken = cookieStore.get('lr_admin_session')?.value;

  if (isLocked) {
    redirect('/admin/mfa');
  }

  if (!sessionToken) {
    redirect('/admin/login');
  }

  const { adminEmail } = getAdminConfig();
  const { valid, email } = verifyAdminToken(sessionToken);
  
  if (!valid || !adminEmail || email?.toLowerCase() !== adminEmail) {
    redirect('/admin/login?error=unauthorized');
  }

  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-foreground selection:text-background">
      <AdminNavbar />
      
      <div className="flex-1 flex flex-col md:flex-row pt-[72px]">
        <AdminSidebar />
        
        <main className="flex-1 w-full relative">
          <Suspense fallback={<div className="w-full flex justify-center py-24"><div className="w-4 h-4 rounded-full border-2 border-foreground/20 border-t-foreground animate-spin" /></div>}>
            <AdminSessionGuard>
              {children}
            </AdminSessionGuard>
          </Suspense>
        </main>
      </div>

      <footer className="border-t border-border/40 py-6 px-6 lg:px-8 mt-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          <span>Life & Resilience</span>
          <span>Admin Workspace</span>
          <span>Secure Session</span>
        </div>
      </footer>
    </div>
  );
}
