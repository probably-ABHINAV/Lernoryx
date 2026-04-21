import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "TMS SaaS — Modern Training Management",
  description:
    "Streamline your training operations with our all-in-one platform for organizations, trainers, and students.",
};

export default async function LandingPage() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Training Management,{" "}
            <span className="text-indigo-600">Reimagined</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            Streamline attendance, grades, sessions, and billing — all in one
            powerful platform built for modern training organizations.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="/sign-up"
              className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
            >
              Get Started Free
            </a>
            <a
              href="/pricing"
              className="text-sm font-semibold leading-6 text-slate-900 hover:text-indigo-600 transition-colors"
            >
              View Pricing <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-16 lg:px-8 bg-slate-50">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold tracking-tight">
            Everything You Need
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* TODO: Add feature cards */}
          </div>
        </div>
      </section>
    </div>
  );
}
