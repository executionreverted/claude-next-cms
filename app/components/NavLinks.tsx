'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function NavLinks() {
  const { data: session } = useSession();

  return (
    <nav className="flex items-center space-x-6">
      <Link href="/" className="text-gray-800 hover:text-blue-600">
        Home
      </Link>
      <Link href="/blogs" className="text-gray-800 hover:text-blue-600">
        Blog
      </Link>
      {session ? (
        <>
          <Link href="/dashboard" className="text-gray-800 hover:text-blue-600">
            Dashboard
          </Link>
          {session.user.role === 'ADMIN' && (
            <Link href="/admin" className="text-gray-800 hover:text-blue-600">
              Admin
            </Link>
          )}
        </>
      ) : (
        <>
          <Link href="/login" className="text-gray-800 hover:text-blue-600">
            Login
          </Link>
          <Link href="/register" className="text-gray-800 hover:text-blue-600">
            Register
          </Link>
        </>
      )}
    </nav>
  );
}
