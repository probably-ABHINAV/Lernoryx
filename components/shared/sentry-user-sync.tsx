"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { useUser } from "@clerk/nextjs";

export function SentryUserSync() {
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      Sentry.setUser({
        id: user.id,
        email: user.primaryEmailAddress?.emailAddress,
      });
    } else {
      // Clear user config if logged out
      Sentry.setUser(null);
    }
  }, [user]);

  return null;
}
