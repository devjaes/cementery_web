"use client";

// Note: This provider is kept for backwards compatibility
// but no longer uses NextAuth. Authentication is now handled
// via Zustand store (useAuthStore)
export default function AuthProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
