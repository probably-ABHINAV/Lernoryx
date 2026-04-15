"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signUp } from "@/modules/auth/auth.service";
import { useRouter } from "next/navigation";

export function SignupForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorStr, setErrorStr] = useState("");
  const [success, setSuccess] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setErrorStr("");

    const formData = new FormData(e.currentTarget);
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setErrorStr("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      await signUp(email, password, fullName);
      setSuccess(true);
      // Wait a moment then redirect to login or dashboard
      setTimeout(() => {
        router.push("/admin");
      }, 2000);
    } catch (err: any) {
      setErrorStr(err.message || "Failed to sign up.");
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
      {success && (
        <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-sm text-green-700">
          Signup successful! Redirecting...
        </div>
      )}
      <Input
        label="Full Name"
        name="fullName"
        type="text"
        placeholder="John Doe"
        required
        autoComplete="name"
      />
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
        autoComplete="new-password"
        helperText="Must be at least 8 characters"
      />
      <Input
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        placeholder="••••••••"
        required
        autoComplete="new-password"
      />
      <Button type="submit" isLoading={isLoading} className="w-full">
        Create Account
      </Button>
    </form>
  );
}
