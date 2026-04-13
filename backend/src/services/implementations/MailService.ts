import { IMailService } from '../interfaces/IMailService';
import { sendEmail } from '../../utils/email';

export class MailService implements IMailService {
  async sendEmail(options: { email: string; subject: string; message: string }): Promise<void> {
    await sendEmail(options);
  }

  async sendVerificationEmail(email: string, otp: string): Promise<void> {
    await this.sendEmail({
      email,
      subject: 'Account Verification',
      message: `Your code is ${otp}`
    });
  }

  async sendPasswordResetEmail(email: string, otp: string): Promise<void> {
    await this.sendEmail({
      email,
      subject: 'Password Recovery',
      message: `Your code is ${otp}`
    });
  }
}
