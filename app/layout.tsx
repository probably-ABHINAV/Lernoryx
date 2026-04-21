import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "TMS SaaS — Training Management System",
    template: "%s | TMS SaaS",
  },
  description:
    "Modern training management platform for organizations, trainers, and students.",
};

import { ClerkProvider, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { setSentryUserContext } from "@/lib/sentryUser";
import { SentryUserSync } from "@/components/shared/sentry-user-sync";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 1. Establish rich Server-side Sentry DB context for API / Server Actions
  await setSentryUserContext();

  return (
    <ClerkProvider>
      <html lang="en" className={cn("h-full", "antialiased", inter.variable, "font-sans", geist.variable)}>
        <body className="min-h-full flex flex-col font-sans">
          {/* 2. Hydrate Sentry context asynchronously on the client for frontend crashes */}
          <SentryUserSync />
          
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
