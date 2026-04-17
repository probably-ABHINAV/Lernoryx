"use client";

import useSWR from "swr";
import { useUser } from "./useUser";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useDashboard() {
  const { role } = useUser();

  // Dynamically resolve target role.
  const endpoint = role ? `/api/dashboard/${role}` : null;

  // Utilize SWR to deeply cache identical GET requests out to the respective endpoints.
  const { data, error, isLoading } = useSWR(endpoint, fetcher, {
    revalidateOnFocus: false, // Prevents aggressive requery if tab switching
  });

  return {
    data: data?.data || {},
    loading: isLoading || (!data && !error),
    error: error || data?.error,
  };
}
