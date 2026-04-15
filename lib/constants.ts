/** Application-wide constants. */

export const APP_NAME = "TMS SaaS";
export const APP_DESCRIPTION =
  "Modern training management platform for organizations, trainers, and students.";

/** Pagination defaults. */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

/** Role display names. */
export const ROLE_LABELS = {
  admin: "Administrator",
  trainer: "Trainer",
  student: "Student",
} as const;

/** Attendance status display config. */
export const ATTENDANCE_STATUS = {
  present: { label: "Present", color: "success" },
  absent: { label: "Absent", color: "danger" },
  late: { label: "Late", color: "warning" },
  excused: { label: "Excused", color: "info" },
} as const;

/** Session status display config. */
export const SESSION_STATUS = {
  scheduled: { label: "Scheduled", color: "info" },
  in_progress: { label: "In Progress", color: "warning" },
  completed: { label: "Completed", color: "success" },
  cancelled: { label: "Cancelled", color: "danger" },
} as const;
