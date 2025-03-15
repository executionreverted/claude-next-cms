'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string | null;
    profile: {
      bio: string | null;
    };
  };
}

interface Params {
  params: {
    slug: string;
  };
}

export default function BlogDetailPage({ params }: Params) {
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/blogs/${params.slug}`);

        if (response.status === 404) {
          setError('Blog post not found');
          setIsLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch blog post');
        }

        const data = await response.json();
        setPost(data);
      } catch (err) {
        setError('Failed to load blog post');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [params.slug]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-md bg-red-50 p-4 text-center text-red-600">
          {error || 'Blog post not found'}
        </div>
        <div className="mt-6 text-center">
          <Link href="/blogs" className="text-blue-600 hover:text-blue-500">
            &larr; Back to all posts
          </Link>
        </div>
      </div>
    );
  }

  // Helper to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Simple Markdown renderer
  const renderMarkdown = (content: string) => {
    return {
      __html: content
        .replace(/\n/g, '<br/>')
        .replace(/#{3} (.*?)(?:\n|$)/g, '<h3 class="text-xl font-semibold mt-4 mb-2">$1</h3>')
        .replace(/#{2} (.*?)(?:\n|$)/g, '<h2 class="text-2xl font-semibold mt-6 mb-2">$1</h2>')
        .replace(/#{1} (.*?)(?:\n|$)/g, '<h1 class="text-3xl font-bold mt-8 mb-4">$1</h1>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 rounded">$1</code>')
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-600 hover:underline">$1</a>')
        .replace(/^\* (.*?)(?:\n|$)/gm, '<li class="ml-6">$1</li>')
    };
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <article className="overflow-hidden rounded-lg bg-white shadow-lg">
        <div className="p-6 sm:p-8">
          <Link href="/blogs" className="text-blue-600 hover:text-blue-500">
            &larr; Back to all posts
          </Link>

          <h1 className="mt-6 text-3xl font-bold text-gray-900 sm:text-4xl">
            {post.title}
          </h1>

          <div className="mt-3 flex items-center space-x-2 text-gray-500">
            <span>By {post.author.name || 'Anonymous'}</span>
            <span>&bull;</span>
            <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
          </div>

          <div className="prose prose-blue mt-8 max-w-none">
            <div dangerouslySetInnerHTML={renderMarkdown(post.content)} />
          </div>

          {post.author.profile?.bio && (
            <div className="mt-12 rounded-lg bg-gray-50 p-6">
              <h3 className="text-lg font-medium text-gray-900">About the Author</h3>
              <p className="mt-2 text-gray-600">{post.author.profile.bio}</p>
            </div>
          )}
        </div>
      </article>
    </div>
  );
}
