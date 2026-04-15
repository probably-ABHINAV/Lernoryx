/**
 * EmailService — send transactional emails.
 * Integrates with Resend, SendGrid, or similar provider.
 */
export class EmailService {
  /**
   * Send a welcome email after signup.
   */
  static async sendWelcome(params: { to: string; name: string }) {
    // TODO: Implement with email provider
    console.log(`[Email] Welcome email → ${params.to}`);
  }

  /**
   * Send a password reset email.
   */
  static async sendPasswordReset(params: { to: string; resetUrl: string }) {
    console.log(`[Email] Password reset → ${params.to}`);
  }

  /**
   * Send an invitation to join an organization.
   */
  static async sendInvitation(params: {
    to: string;
    orgName: string;
    inviteUrl: string;
    inviterName: string;
  }) {
    console.log(`[Email] Invitation → ${params.to}`);
  }

  /**
   * Send attendance summary (scheduled).
   */
  static async sendAttendanceSummary(params: {
    to: string;
    studentName: string;
    summary: { present: number; absent: number; rate: number };
  }) {
    console.log(`[Email] Attendance summary → ${params.to}`);
  }
}
