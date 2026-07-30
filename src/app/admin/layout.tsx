import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions, ADMIN_ROLES } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;

  if (!session || !ADMIN_ROLES.includes(role as (typeof ADMIN_ROLES)[number])) {
    redirect("/signin");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <nav className="flex gap-4 text-sm font-medium">
          <Link href="/admin">Articles</Link>
          <Link href="/admin/categories">Categories</Link>
          <Link href="/admin/tags">Tags</Link>
          <Link href="/admin/analytics">Analytics</Link>
          <Link href="/admin/ads">Ads</Link>
          <Link href="/admin/settings">Settings</Link>
          <Link href="/admin/articles/new" className="text-brand-500">
            + New Article
          </Link>
        </nav>
        <span className="text-xs text-gray-400">
          {session.user?.email} · {role}
        </span>
      </div>
      {children}
    </div>
  );
}
