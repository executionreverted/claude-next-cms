'use client';

import { useState, useEffect, FormEvent } from 'react';
import Image from 'next/image';

interface SiteSettings {
  logoText: string;
  hasLogo: boolean;
}

export default function SiteSettingsForm() {
  const [settings, setSettings] = useState<SiteSettings>({
    logoText: '',
    hasLogo: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/admin/site-settings');
        if (response.ok) {
          const data = await response.json();
          setSettings(data);
          if (data.hasLogo) {
            setPreviewUrl(`/api/logo-image?t=${Date.now()}`);
          }
        }
      } catch (error) {
        console.error('Error fetching site settings:', error);
        setMessage({ text: 'Failed to load settings', type: 'error' });
      } finally {
        setIsLoading(false);
      }
    }

    fetchSettings();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ text: '', type: '' });

    try {
      // If there's a new image file, upload it first
      if (imageFile) {
        // Create a FormData object to upload the file
        const formData = new FormData();
        formData.append('file', imageFile);

        const uploadResponse = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image');
        }

        // Set preview URL to the logo image endpoint with a timestamp to avoid caching
        setPreviewUrl(`/api/logo-image?t=${Date.now()}`);
      }

      // Update the site settings (text only)
      const response = await fetch('/api/admin/site-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          logoText: settings.logoText,
          removeLogoImage: imageFile === null && previewUrl === null
        }),
      });

      if (response.ok) {
        const updatedSettings = await response.json();
        setSettings(updatedSettings);
        setMessage({ text: 'Settings saved successfully', type: 'success' });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      setMessage({
        text: error instanceof Error ? error.message : 'An unknown error occurred',
        type: 'error'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Create a preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
    setSettings(prev => ({ ...prev, hasLogo: false }));
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="h-6 w-24 animate-pulse bg-gray-200 rounded mb-4"></div>
        <div className="h-32 w-full animate-pulse bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      {message.text && (
        <div className={`p-4 mb-6 rounded ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="logoText" className="block text-sm font-medium text-gray-700 mb-1">
            Logo Text
          </label>
          <input
            type="text"
            id="logoText"
            value={settings.logoText}
            onChange={(e) => setSettings(prev => ({ ...prev, logoText: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            This will be displayed if no logo image is uploaded.
          </p>
        </div>

        <div>
          <label htmlFor="logoImage" className="block text-sm font-medium text-gray-700 mb-1">
            Logo Image (optional)
          </label>
          <div className="mt-1 flex items-center space-x-4">
            <input
              type="file"
              id="logoImage"
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <label
              htmlFor="logoImage"
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
            >
              Select Image
            </label>
            {previewUrl && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-red-600 bg-white hover:bg-gray-50"
              >
                Remove Image
              </button>
            )}
          </div>

          {previewUrl && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">Preview:</p>
              <div className="relative h-16 w-48 border border-gray-200 rounded overflow-hidden">
                <Image
                  src={previewUrl}
                  alt="Logo preview"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          )}

          <p className="mt-2 text-sm text-gray-500">
            Recommended size: 120px × 40px. If no image is provided, the logo text will be displayed.
          </p>
        </div>

        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className={`px-4 py-2 rounded-md text-white font-medium ${isSaving ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
              }`}
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
