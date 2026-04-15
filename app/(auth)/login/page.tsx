import type { Metadata } from "next";
import { LoginForm } from "@/components/forms/login-form";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your TMS account.",
};

export default function LoginPage() {
  return (
    <div className="rounded-2xl bg-white p-8 shadow-lg ring-1 ring-slate-200">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">Welcome Back</h1>
        <p className="mt-2 text-sm text-slate-500">
          Sign in to your account to continue
        </p>
      </div>
      <div className="mt-8">
        <LoginForm />
      </div>
      <p className="mt-6 text-center text-sm text-slate-500">
        Don&apos;t have an account?{" "}
        <a
          href="/signup"
          className="font-semibold text-indigo-600 hover:text-indigo-500"
        >
          Sign up free
        </a>
      </p>
    </div>
  );
}
