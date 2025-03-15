'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

interface BlogFormData {
  title: string;
  content: string;
  published: boolean;
  authorId: string;
}

interface User {
  id: string;
  name: string | null;
  email: string;
}

interface Params {
  params: {
    id: string;
  };
}

export default function BlogForm({ params }: Params) {
  const router = useRouter();
  const { data: session } = useSession();
  const isNewPost = params.id === 'new';
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    content: '',
    published: false,
    authorId: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch users for author selection
        const usersResponse = await fetch('/api/admin/users');
        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          setUsers(usersData);
        }

        // Set current user as default author for new posts
        if (isNewPost && session?.user?.id) {
          setFormData(prev => ({
            ...prev,
            authorId: session.user.id as string
          }));
        }

        // Fetch post data if editing
        if (!isNewPost) {
          const postResponse = await fetch(`/api/admin/blogs/${params.id}`);
          if (postResponse.ok) {
            const postData = await postResponse.json();
            setFormData({
              title: postData.title,
              content: postData.content,
              published: postData.published,
              authorId: postData.author.id,
            });
          } else {
            throw new Error('Failed to fetch blog post');
          }
        }
      } catch (err) {
        setError('Error loading data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isNewPost, params.id, session?.user?.id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    if (!formData.content.trim()) {
      setError('Content is required');
      return;
    }

    try {
      setIsSaving(true);

      const response = await fetch(
        isNewPost ? '/api/admin/blogs' : `/api/admin/blogs/${params.id}`,
        {
          method: isNewPost ? 'POST' : 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save blog post');
      }

      // Redirect back to blogs list
      router.push('/admin/blogs');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An error occurred while saving');
      }
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {isNewPost ? 'Create New Blog Post' : 'Edit Blog Post'}
        </h1>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setPreview(!preview)}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {preview ? 'Edit' : 'Preview'}
          </button>
          <Link
            href="/admin/blogs"
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Back to Blogs
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4 text-red-600">
          {error}
        </div>
      )}

      {!preview ? (
        <form onSubmit={handleSubmit} className="space-y-6 rounded-lg bg-white p-6 shadow-md">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              placeholder="Enter blog title"
            />
          </div>

          <div>
            <label htmlFor="authorId" className="block text-sm font-medium text-gray-700">
              Author
            </label>
            <select
              id="authorId"
              name="authorId"
              value={formData.authorId}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            >
              <option value="">Select an author</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name || user.email}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                Content (Markdown)
              </label>
              <span className="text-xs text-gray-500">
                Supports Markdown formatting
              </span>
            </div>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={15}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 font-mono shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              placeholder="Write your blog content in Markdown..."
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="published"
              name="published"
              checked={formData.published}
              onChange={e => setFormData(prev => ({ ...prev, published: e.target.checked }))}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="published" className="ml-2 block text-sm text-gray-700">
              Publish immediately
            </label>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Post'}
            </button>
          </div>
        </form>
      ) : (
        <div className="rounded-lg bg-white p-6 shadow-md">
          <div className="mb-6 border-b pb-4">
            <h2 className="text-3xl font-bold text-gray-900">{formData.title}</h2>
            <div className="mt-2 text-sm text-gray-500">
              Author: {users.find(u => u.id === formData.authorId)?.name || 'Unknown'}
            </div>
          </div>

          <div className="prose max-w-none">
            {/* This is a simplified Markdown preview, in production use a proper Markdown renderer */}
            <div dangerouslySetInnerHTML={{
              __html: formData.content
                .replace(/\n/g, '<br/>')
                .replace(/#{3} (.*?)(?:\n|$)/g, '<h3>$1</h3>')
                .replace(/#{2} (.*?)(?:\n|$)/g, '<h2>$1</h2>')
                .replace(/#{1} (.*?)(?:\n|$)/g, '<h1>$1</h1>')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/`(.*?)`/g, '<code>$1</code>')
                .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
                .replace(/^\* (.*?)(?:\n|$)/gm, '<li>$1</li>')
            }} />
          </div>
        </div>
      )}
    </div>
  );
}
