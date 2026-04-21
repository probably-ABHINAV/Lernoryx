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
import { auth } from '@clerk/nextjs/server'

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId } = await auth();

  return (
    <ClerkProvider>
      <html lang="en" className={cn("h-full", "antialiased", inter.variable, "font-sans", geist.variable)}>
        <body className="min-h-full flex flex-col font-sans">

          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
