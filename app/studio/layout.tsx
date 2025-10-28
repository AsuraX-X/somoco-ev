import React from "react";

// Keep studio static as before
export const dynamic = "force-static";

export default function StudioLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // This layout intentionally does NOT include the global Header/Footer
  // so the Sanity Studio is rendered standalone.
  return <div className="min-h-screen bg-primary text-white">{children}</div>;
}
