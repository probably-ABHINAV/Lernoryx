export interface Session {
  id: string;
  section_id: string;
  trainer_id?: string;
  topic?: string;
  session_date: string;
  org_id: string;
}

export interface CreateSessionInput {
  section_id: string;
  trainer_id?: string;
  topic?: string;
  session_date: string;
  org_id: string;
}
