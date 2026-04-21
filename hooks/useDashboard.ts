"use client";

import useSWR from "swr";
import { useUser } from "./useUser";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useDashboard() {
  const { profile } = useUser();
  const role = profile?.role || "pending";

  const endpoint = role ? `/api/dashboard/${role}` : null;

  const { data, error, isLoading } = useSWR(endpoint, fetcher, {
    revalidateOnFocus: false,
  });

  return {
    role,
    data: data?.data || {},
    loading: isLoading || (!data && !error),
    error: error || data?.error,
  };
}
