"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  // Don't show layout on login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const navItems = [
    { href: "/admin", label: "Add Vehicle", exact: true },
    { href: "/admin/vehicles", label: "View Vehicles", exact: false },
  ];

  const isActive = (href: string, exact: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      {/* Header */}
      <header className="bg-[#252525] border-b border-[#333]">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white">Vehicle Admin</h1>
              <p className="text-sm text-gray-400">Manage your EV catalog</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-gray-300 border border-[#333] rounded hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 transition-colors"
              >
                Logout
              </button>
              <Link
                href="/"
                className="px-4 py-2 text-sm text-gray-300 border border-[#333] rounded hover:bg-[#1a1a1a] transition-colors"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-[#252525] border-b border-[#333]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-3 text-sm font-medium transition-colors ${
                  isActive(item.href, item.exact)
                    ? "text-green-500 border-b-2 border-green-500"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <a
              href="/studio"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3 text-sm font-medium text-gray-400 hover:text-white transition-colors ml-auto"
            >
              Open Studio →
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-8 px-4">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
