"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
// Cache for Ethereal test account to speed up development
let cachedTestAccount = null;
const sendEmail = async (options) => {
    let transporter;
    // 1. Use SMTP credentials if BOTH User and Pass are provided
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        transporter = nodemailer_1.default.createTransport({
            service: process.env.EMAIL_SERVICE || (process.env.EMAIL_USER.includes('gmail') ? 'gmail' : undefined),
            host: process.env.EMAIL_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.EMAIL_PORT || '587'),
            secure: process.env.EMAIL_SECURE === 'true',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }
    // 2. FALLBACK: Use Ethereal (Real Test Email Service)
    else {
        if (!cachedTestAccount) {
            cachedTestAccount = await nodemailer_1.default.createTestAccount();
        }
        transporter = nodemailer_1.default.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: cachedTestAccount.user,
                pass: cachedTestAccount.pass,
            },
        });
    }
    const otp = options.message.match(/\d{6}/)?.[0] || '------';
    const mailOptions = {
        from: `"BlogSpace Creator Studio" <${process.env.EMAIL_USER || 'no-reply@blogspace.io'}>`,
        to: options.email,
        subject: options.subject || `🔐 ${otp} is your verification code`,
        text: options.message,
        html: `
      <!DOCTYPE html>
      <html>
      <body style="margin: 0; padding: 0; background-color: #030712; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
          <tr>
            <td align="center" style="padding: 60px 0;">
              <table border="0" cellpadding="0" cellspacing="0" width="500" style="background-color: #0f172a; border-radius: 24px; overflow: hidden; border: 1px solid rgba(255,255,255,0.05);">
                <tr>
                  <td style="padding: 50px 40px 30px; text-align: center;">
                    <div style="width: 64px; height: 64px; background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); border-radius: 16px; margin: 0 auto 24px; display: inline-block; line-height: 64px; text-align: center;">
                      <span style="color: white; font-size: 32px; vertical-align: middle;">🖋️</span>
                    </div>
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.02em;">BlogSpace</h1>
                    <p style="color: #6366f1; margin: 4px 0 0; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.3em;">Creator Studio</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0 40px 40px; text-align: center;">
                    <h2 style="color: #f8fafc; margin: 0 0 12px; font-size: 20px; font-weight: 700;">${options.subject}</h2>
                    <p style="color: #94a3b8; font-size: 15px; line-height: 1.6; margin: 0 0 32px;">
                      Use the secure key below to verify your session in the Creator Studio.
                    </p>
                    <div style="background-color: rgba(255,255,255,0.03); border-radius: 16px; padding: 32px; border: 1px solid rgba(255,255,255,0.05);">
                      <div style="font-size: 36px; font-weight: 800; color: #ffffff; letter-spacing: 8px; font-family: 'Courier New', Courier, monospace;">${otp}</div>
                    </div>
                    <p style="color: #64748b; font-size: 13px; margin: 32px 0 0;">
                      Code expires in <strong style="color: #6366f1;">10 minutes</strong>.<br>
                      If you did not request this, please secure your account.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 24px 40px; text-align: center; background-color: rgba(255,255,255,0.02); border-top: 1px solid rgba(255,255,255,0.05); color: #475569; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em;">
                    &copy; 2026 BlogSpace Creator Studio &bull; End-to-End Encrypted
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
        headers: {
            'List-Unsubscribe': `<mailto:no-reply@blogspace.io?subject=unsubscribe>`,
            'X-Entity-Ref-ID': Date.now().toString()
        }
    };
    try {
        await transporter.sendMail(mailOptions);
    }
    catch (error) {
        throw error;
    }
};
exports.sendEmail = sendEmail;
//# sourceMappingURL=email.js.map