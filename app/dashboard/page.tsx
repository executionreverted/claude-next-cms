'use client';

import { useSession, signOut } from 'next-auth/react';

export default function DashboardPage() {
  const { data: session } = useSession();

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between rounded-lg bg-white p-6 shadow-md">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {session?.user?.name || 'User'}!</h1>
          <p className="text-gray-600">This is your personal dashboard</p>
        </div>
        <button
          onClick={handleSignOut}
          className="rounded-md bg-red-100 px-4 py-2 text-red-600 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Sign out
        </button>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Dashboard content goes here */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-lg font-medium text-gray-900">Your Profile</h2>
          <div className="space-y-2">
            <p className="text-gray-600">
              <strong>Email:</strong> {session?.user?.email}
            </p>
            <p className="text-gray-600">
              <strong>User ID:</strong> {session?.user?.id}
            </p>
            <p className="text-gray-600">
              <strong>Role:</strong> {session?.user?.role}
            </p>
            <p className="mt-2">
              <a href="/dashboard/profile" className="text-blue-600 hover:underline">
                Edit Profile
              </a>
            </p>
            {session?.user?.role === 'ADMIN' && (
              <p className="mt-2">
                <a href="/admin" className="text-blue-600 hover:underline">
                  Access Admin Dashboard
                </a>
              </p>
            )}
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-lg font-medium text-gray-900">Getting Started</h2>
          <p className="text-gray-600">
            This is a template dashboard. You can customize it to fit your needs.
          </p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-lg font-medium text-gray-900">Recent Activity</h2>
          <p className="text-gray-600">No recent activity</p>
        </div>
      </div>
    </div>
  );
}
