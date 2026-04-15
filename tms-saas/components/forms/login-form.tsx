"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { login } from "@/modules/auth/auth.service";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorStr, setErrorStr] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setErrorStr("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await login(email, password);
      router.push("/admin"); // Redirecting to admin dashboard for now
    } catch (err: any) {
      setErrorStr(err.message || "Failed to log in.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {errorStr && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
          {errorStr}
        </div>
      )}
      <Input
        label="Email"
        name="email"
        type="email"
        placeholder="you@example.com"
        required
        autoComplete="email"
      />
      <Input
        label="Password"
        name="password"
        type="password"
        placeholder="••••••••"
        required
        autoComplete="current-password"
      />
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="remember"
            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="text-slate-600">Remember me</span>
        </label>
        <a
          href="/forgot-password"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          Forgot password?
        </a>
      </div>
      <Button type="submit" isLoading={isLoading} className="w-full">
        Sign In
      </Button>
    </form>
  );
}
