'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string | null;
  };
}

export default function BlogsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/blogs');

        if (!response.ok) {
          throw new Error('Failed to fetch blog posts');
        }

        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError('Failed to load blog posts');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  // Helper to truncate content for preview
  const truncateContent = (content: string, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  // Helper to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Our Blog</h1>
        <p className="mt-2 text-lg text-gray-600">The latest news and updates</p>
      </div>

      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4 text-red-600">
          {error}
        </div>
      )}

      {posts.length === 0 ? (
        <div className="mt-12 text-center text-gray-500">
          No blog posts available at this time.
        </div>
      ) : (
        <div className="mt-12 space-y-10">
          {posts.map((post) => (
            <article key={post.id} className="flex flex-col overflow-hidden rounded-lg shadow-lg">
              <div className="flex-1 bg-white p-6">
                <div className="flex items-center text-sm text-gray-500">
                  <span>{formatDate(post.createdAt)}</span>
                  <span className="mx-1">&bull;</span>
                  <span>By {post.author.name || 'Anonymous'}</span>
                </div>
                <Link href={`/blogs/${post.slug}`} className="mt-2 block">
                  <h2 className="text-xl font-semibold text-gray-900 hover:text-blue-600">
                    {post.title}
                  </h2>
                  <p className="mt-3 text-gray-500">
                    {truncateContent(post.content.replace(/[#*`]/g, ''))}
                  </p>
                </Link>
                <div className="mt-6">
                  <Link
                    href={`/blogs/${post.slug}`}
                    className="text-blue-600 hover:text-blue-500"
                  >
                    Read more &rarr;
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
