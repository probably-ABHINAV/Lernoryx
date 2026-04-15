"use client";

import { useState, useEffect } from "react";
import type { AttendanceRecord, AttendanceSummary } from "@/modules/attendance/attendance.types";

/**
 * useAttendance — fetch attendance data for a section or student.
 */
export function useAttendance(params?: {
  sectionId?: string;
  studentId?: string;
  sessionId?: string;
}) {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [summary, setSummary] = useState<AttendanceSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params?.sectionId && !params?.studentId) return;

    setIsLoading(true);
    setError(null);

    // TODO: Fetch from attendance API
    // const query = new URLSearchParams(params).toString();
    // fetch(`/api/attendance?${query}`)
    //   .then(res => res.json())
    //   .then(data => {
    //     setRecords(data.records);
    //     setSummary(data.summary);
    //   })
    //   .catch(err => setError(err.message))
    //   .finally(() => setIsLoading(false));

    setIsLoading(false);
  }, [params?.sectionId, params?.studentId, params?.sessionId]);

  return { records, summary, isLoading, error };
}
