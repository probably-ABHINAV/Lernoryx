import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Project-specific ignores:
    "scratch/**",
  ]),
  {
    rules: {
      // Downgrade to warning — too many existing `any` usages to fix at once.
      // Will tighten to "error" once the codebase is fully typed.
      "@typescript-eslint/no-explicit-any": "warn",
      // Unused vars: allow underscore-prefixed params (common pattern for unused callback args)
      "@typescript-eslint/no-unused-vars": ["warn", {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      }],
    },
  },
]);

export default eslintConfig;
