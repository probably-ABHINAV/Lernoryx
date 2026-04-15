/** An individual training session instance. */
export interface Session {
  id: string;
  sectionId: string;
  trainerId: string;
  title: string;
  description?: string;
  date: string;       // YYYY-MM-DD
  startTime: string;  // HH:mm
  endTime: string;    // HH:mm
  status: SessionStatus;
  cancelReason?: string;
  createdAt: string;
  updatedAt: string;
}

export type SessionStatus = "scheduled" | "in_progress" | "completed" | "cancelled";

export interface CreateSessionInput {
  sectionId: string;
  trainerId: string;
  title: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
}

export interface UpdateSessionInput {
  title?: string;
  description?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  status?: SessionStatus;
}
