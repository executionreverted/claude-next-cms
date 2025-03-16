// app/admin/site-settings/page.tsx
import SiteSettings from '@/app/components/site-settings/SiteSettings';

export const metadata = {
  title: 'Site Settings - Admin',
  description: 'Manage your site settings',
};

export default function SiteSettingsPage() {
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Site Settings</h1>
      <SiteSettings />
    </div>
  );
}
