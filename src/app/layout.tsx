import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/core/infrastructure/query-client";
import AuthProvider from "@/core/providers/auth-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sistema de Gestión de Cementerios",
  description: "Sistema de gestión de cementerios y nichos",
  metadataBase: new URL('http://localhost:3000'),
  other: {
    'charset': 'UTF-8',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            {children}
            <Toaster position="top-right" richColors closeButton />
          </QueryClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
