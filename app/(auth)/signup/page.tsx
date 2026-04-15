import type { Metadata } from "next";
import { SignupForm } from "@/components/forms/signup-form";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your TMS account and get started for free.",
};

export default function SignupPage() {
  return (
    <div className="rounded-2xl bg-white p-8 shadow-lg ring-1 ring-slate-200">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">Create Account</h1>
        <p className="mt-2 text-sm text-slate-500">
          Start managing your training operations today
        </p>
      </div>
      <div className="mt-8">
        <SignupForm />
      </div>
      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <a
          href="/login"
          className="font-semibold text-indigo-600 hover:text-indigo-500"
        >
          Sign in
        </a>
      </p>
    </div>
  );
}
