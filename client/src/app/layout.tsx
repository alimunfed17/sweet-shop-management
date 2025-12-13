"use client";

import '@/app/globals.css';
import { ReactNode, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import Navbar from '@/components/Navbar';

export default function RootLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { checkAuth, isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    const publicRoutes = ['/login', '/register'];
    const isPublicRoute = publicRoutes.includes(pathname);

    if (!isLoading && !isAuthenticated && !isPublicRoute) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  const showNavbar = isAuthenticated && !['/login', '/register'].includes(pathname);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        {showNavbar && <Navbar />}
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#fff',
              color: '#333',
              padding: '16px',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            },
            success: {
              iconTheme: { primary: '#10b981', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#fff' },
            },
          }}
        />
      </body>
    </html>
  );
}
