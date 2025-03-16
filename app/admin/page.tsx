'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function AdminDashboard() {
  const { data: session } = useSession();

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between rounded-lg bg-white p-6 shadow-md">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome, {session?.user?.name}</p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="rounded-md bg-red-100 px-4 py-2 text-red-600 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Sign out
        </button>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/admin/users" className="rounded-lg bg-white p-6 shadow-md hover:shadow-lg transition-shadow">
          <h2 className="mb-4 text-lg font-medium text-gray-900">User Management</h2>
          <p className="text-gray-600">
            View, add, edit, and delete users
          </p>
          <div className="mt-4 text-blue-600">Manage Users →</div>
        </Link>

        <Link href="/admin/blogs" className="rounded-lg bg-white p-6 shadow-md hover:shadow-lg transition-shadow">
          <h2 className="mb-4 text-lg font-medium text-gray-900">Blog Management</h2>
          <p className="text-gray-600">
            Create and manage blog posts with markdown
          </p>
          <div className="mt-4 text-blue-600">Manage Blogs →</div>
        </Link>
        <Link href="/admin/site-settings" className="rounded-lg bg-white p-6 shadow-md hover:shadow-lg transition-shadow">
          <h2 className="mb-4 text-lg font-medium text-gray-900">Site Settings</h2>
          <p className="text-gray-600">
            Customize logo and application appearance
          </p>
          <div className="mt-4 text-blue-600">Manage Settings →</div>
        </Link>
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-lg font-medium text-gray-900">System Status</h2>
          <p className="text-gray-600">
            Your role: <span className="font-semibold">{session?.user?.role}</span>
          </p>
          <p className="text-gray-600 mt-2">
            User ID: <span className="font-mono text-xs">{session?.user?.id}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
