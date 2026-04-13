export interface IMailService {
  sendEmail(options: { email: string; subject: string; message: string }): Promise<void>;
  sendVerificationEmail(email: string, otp: string): Promise<void>;
  sendPasswordResetEmail(email: string, otp: string): Promise<void>;
}
