'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';

interface SiteSettings {
  logoText: string;
  hasLogo: boolean;
}

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    logoText: 'MyApp',
    hasLogo: false
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSiteSettings() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/admin/site-settings');
        if (response.ok) {
          const data = await response.json();
          setSiteSettings(data);
        }
      } catch (error) {
        console.error('Error fetching site settings:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSiteSettings();
  }, []);

  const isActive = (path: string) => {
    return pathname === path ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600';
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center px-2">
              <Link href="/" className="font-bold text-xl text-blue-600">
                {isLoading ? (
                  <div className="h-5 w-20 animate-pulse bg-gray-200 rounded"></div>
                ) : siteSettings.hasLogo ? (
                  <div className="flex items-center justify-center gap-2">
                    <Image
                      src="/api/logo-image"
                      alt={siteSettings.logoText}
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                    <p className='ml-2'>
                      {siteSettings.logoText}
                    </p>
                  </div>
                ) : (
                  siteSettings.logoText
                )}
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/" className={`inline-flex items-center border-b-2 ${pathname === '/' ? 'border-blue-500' : 'border-transparent'} px-1 pt-1 text-sm font-medium ${isActive('/')}`}>
                Home
              </Link>
              <Link href="/blogs" className={`inline-flex items-center border-b-2 ${pathname === '/blogs' || pathname.startsWith('/blogs/') ? 'border-blue-500' : 'border-transparent'} px-1 pt-1 text-sm font-medium ${isActive('/blogs')}`}>
                Blog
              </Link>
              {session && (
                <Link href="/dashboard" className={`inline-flex items-center border-b-2 ${pathname === '/dashboard' ? 'border-blue-500' : 'border-transparent'} px-1 pt-1 text-sm font-medium ${isActive('/dashboard')}`}>
                  Dashboard
                </Link>
              )}
              {session?.user?.role === 'ADMIN' && (
                <Link href="/admin" className={`inline-flex items-center border-b-2 ${pathname.startsWith('/admin') ? 'border-blue-500' : 'border-transparent'} px-1 pt-1 text-sm font-medium ${isActive('/admin')}`}>
                  Admin
                </Link>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            {status === 'loading' ? (
              <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
            ) : session ? (
              <>
                <div className="text-sm text-gray-700">
                  {session.user.name || session.user.email}
                </div>
                <div className="h-5 border-l border-gray-300"></div>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className={`text-sm font-medium ${isActive('/login')}`}>
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="space-y-1 px-2 pb-3 pt-2">
          <Link
            href="/"
            className={`block rounded-md px-3 py-2 text-base font-medium ${pathname === '/' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
              }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/blogs"
            className={`block rounded-md px-3 py-2 text-base font-medium ${pathname === '/blogs' || pathname.startsWith('/blogs/')
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
              }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Blog
          </Link>
          {session && (
            <Link
              href="/dashboard"
              className={`block rounded-md px-3 py-2 text-base font-medium ${pathname === '/dashboard' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
          )}
          {session?.user?.role === 'ADMIN' && (
            <Link
              href="/admin"
              className={`block rounded-md px-3 py-2 text-base font-medium ${pathname.startsWith('/admin') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Admin
            </Link>
          )}
        </div>
        <div className="border-t border-gray-200 pb-3 pt-4">
          {session ? (
            <div className="space-y-1 px-2">
              <div className="block rounded-md px-3 py-2 text-base font-medium text-gray-700">
                {session.user.name || session.user.email}
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  signOut({ callbackUrl: '/' });
                }}
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="space-y-1 px-2">
              <Link
                href="/login"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
