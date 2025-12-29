"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmail = async (options) => {
    let transporter;
    // 1. Use SMTP credentials if provided in .env
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        transporter = nodemailer_1.default.createTransport({
            host: process.env.EMAIL_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.EMAIL_PORT || '587'),
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }
    // 2. FALLBACK: Use Ethereal (Real Test Email Service) - No Password Needed!
    else {
        const testAccount = await nodemailer_1.default.createTestAccount();
        transporter = nodemailer_1.default.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });
    }
    const mailOptions = {
        from: `"Event Management" <${process.env.EMAIL_FROM || 'no-reply@eventmanagement.com'}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #6366f1; margin: 0;">Verification Code</h1>
          <p style="color: #64748b; font-size: 16px;">Secure your account with the code below</p>
        </div>
        
        <div style="background-color: #f8fafc; border: 2px dashed #e2e8f0; border-radius: 8px; padding: 30px; text-align: center; margin-bottom: 30px;">
          <span style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #1e293b; font-family: monospace;">${options.message.match(/\d{6}/)?.[0] || '------'}</span>
        </div>
        
        <div style="color: #475569; line-height: 1.6; font-size: 14px;">
          <p>Hello,</p>
          <p>You are receiving this email because a request was made to register/verify your account on our platform.</p>
          <p><strong>This code will expire in 10 minutes.</strong></p>
          <p>If you did not request this code, please ignore this email safely.</p>
        </div>
        
        <div style="border-top: 1px solid #e2e8f0; margin-top: 30px; padding-top: 20px; text-align: center; color: #94a3b8; font-size: 12px;">
          <p>&copy; 2025 Event Management Platform. All rights reserved.</p>
        </div>
      </div>
    `
    };
    const info = await transporter.sendMail(mailOptions);
    // If using Ethereal, log the preview URL
    if (!process.env.EMAIL_USER) {
        console.log('\n---------------------------------------------------------');
        console.log('📧 TEST EMAIL SENT (Ethereal)');
        console.log(`To: ${options.email}`);
        console.log(`Preview URL: ${nodemailer_1.default.getTestMessageUrl(info)}`);
        console.log('---------------------------------------------------------\n');
    }
};
exports.sendEmail = sendEmail;
//# sourceMappingURL=email.js.map