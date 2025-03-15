'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function AdminTestPage() {
  const { data: session } = useSession();

  return (
    <div className="mx-auto max-w-3xl p-6 bg-white rounded-lg shadow-md mt-10">
      <h1 className="text-2xl font-bold text-center mb-6">Admin Test Page</h1>

      <div className="p-4 bg-green-100 rounded-lg mb-6">
        <p className="text-green-700 font-semibold">
          If you can see this page, the admin middleware is working correctly and you have admin privileges.
        </p>
      </div>

      <div className="border p-4 rounded-lg mb-6">
        <h2 className="font-bold mb-2">Your session info:</h2>
        <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
          {JSON.stringify({
            name: session?.user?.name,
            email: session?.user?.email,
            role: session?.user?.role
          }, null, 2)}
        </pre>
      </div>

      <div className="flex justify-between mt-8">
        <Link
          href="/admin"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Back to Admin Dashboard
        </Link>

        <Link
          href="/dashboard"
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
        >
          Go to User Dashboard
        </Link>
      </div>
    </div>
  );
}
