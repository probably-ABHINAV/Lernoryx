"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect } from "react";

export default function TestPage() {
  useEffect(() => {
    async function test() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("test")
        .select("*");

      console.log(data, error);
    }

    test();
  }, []);

  return <div>Check console</div>;
}
