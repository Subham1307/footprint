import { AdminShell } from "@/components/admin/AdminShell";
import { ProfileForm } from "@/components/admin/forms/OtherForms";
import { site as staticSite } from "@/data/site";
import { adminDb } from "@/lib/admin/db";

export const instant = false;

export default async function AdminProfilePage() {
  const supabase = await adminDb();
  const { data } = await supabase.from("site_profile").select("*").limit(1).maybeSingle();
  const initial = data ?? {
    owner_name: staticSite.owner,
    wordmark: staticSite.wordmark,
    site_name: staticSite.name,
    email: staticSite.email,
    tagline: staticSite.tagline,
    timezone: "Asia/Kolkata",
    copyright_year: staticSite.copyrightYear,
    is_public: true,
  };
  return (
    <AdminShell title="Profile & about" description="Updates are versioned in site_profile_versions.">
      <ProfileForm initial={initial} />
    </AdminShell>
  );
}