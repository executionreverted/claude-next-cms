import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <main className="flex w-full flex-1 flex-col items-center justify-center px-4 text-center sm:px-20">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-6xl">
          Welcome to <span className="text-blue-600">MyApp</span>
        </h1>

        <p className="mt-3 text-xl text-gray-600 sm:mt-5">
          A Next.js application with Prisma and authentication
        </p>

        <div className="mt-8 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <Link
            href="/login"
            className="rounded-md bg-blue-600 px-8 py-3 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Sign In
          </Link>

          <Link
            href="/register"
            className="rounded-md border border-blue-600 bg-white px-8 py-3 text-base font-medium text-blue-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Register
          </Link>
        </div>

        <div className="mt-16 grid max-w-4xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="text-lg font-medium text-gray-900">Next.js App Router</h2>
            <p className="mt-2 text-gray-600">
              Built with the latest Next.js 14 features and the App Router.
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="text-lg font-medium text-gray-900">Prisma & PostgreSQL</h2>
            <p className="mt-2 text-gray-600">
              Type-safe database access with Prisma ORM and PostgreSQL.
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="text-lg font-medium text-gray-900">Authentication</h2>
            <p className="mt-2 text-gray-600">
              Secure user authentication with NextAuth.js.
            </p>
          </div>
        </div>
      </main>

      <footer className="w-full border-t border-gray-200 bg-white py-6">
        <div className="mx-auto flex max-w-7xl items-center justify-center px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} MyApp. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
