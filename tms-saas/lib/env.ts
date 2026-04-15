/**
 * Type-safe environment variable access.
 * Validates required env vars at build time.
 */

function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key] ?? defaultValue;
  if (value === undefined) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

export const env = {
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: getEnvVar("NEXT_PUBLIC_SUPABASE_URL", ""),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: getEnvVar("NEXT_PUBLIC_SUPABASE_ANON_KEY", ""),
  SUPABASE_SERVICE_ROLE_KEY: getEnvVar("SUPABASE_SERVICE_ROLE_KEY", ""),

  // Stripe
  STRIPE_SECRET_KEY: getEnvVar("STRIPE_SECRET_KEY", ""),
  STRIPE_WEBHOOK_SECRET: getEnvVar("STRIPE_WEBHOOK_SECRET", ""),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: getEnvVar("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", ""),

  // App
  NEXT_PUBLIC_APP_URL: getEnvVar("NEXT_PUBLIC_APP_URL", "http://localhost:3000"),
  NODE_ENV: getEnvVar("NODE_ENV", "development"),
} as const;
