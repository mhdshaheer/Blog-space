import nodemailer from 'nodemailer';

// Cache for Ethereal test account to speed up development
let cachedTestAccount: nodemailer.TestAccount | null = null;

export const sendEmail = async (options: { email: string; subject: string; message: string }) => {
  let transporter: nodemailer.Transporter;
  let isTestAccount = false;

  // 1. Use SMTP credentials if BOTH User and Pass are provided
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
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
    isTestAccount = true;
    
    if (!cachedTestAccount) {
      cachedTestAccount = await nodemailer.createTestAccount();
    }

    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: cachedTestAccount.user,
        pass: cachedTestAccount.pass,
      },
    });
  }


  const mailOptions = {
    from: `"Event Platform Support" <${process.env.EMAIL_USER || 'no-reply@eventmanagement.com'}>`,
    to: options.email,
    subject: `🔐 ${options.message.match(/\d{6}/)?.[0]} is your verification code`,
    text: `Your verification code is: ${options.message.match(/\d{6}/)?.[0]}. Valid for 10 minutes.`,
    html: `
      <!DOCTYPE html>
      <html>
      <body style="margin: 0; padding: 0; background-color: #f4f7fa; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
          <tr>
            <td align="center" style="padding: 40px 0;">
              <table border="0" cellpadding="0" cellspacing="0" width="450" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                <tr>
                  <td style="padding: 40px; text-align: center;">
                    <h2 style="color: #1a1f36; margin: 0 0 10px;">Verify your email</h2>
                    <p style="color: #4f566b; font-size: 16px; margin: 0 0 30px;">Use the following code to complete your registration.</p>
                    
                    <div style="background-color: #f7f9fc; border-radius: 4px; padding: 25px; border: 1px solid #e3e8ee;">
                      <span style="font-size: 32px; font-weight: bold; color: #6366f1; letter-spacing: 5px;">${options.message.match(/\d{6}/)?.[0] || '------'}</span>
                    </div>
                    
                    <p style="color: #697386; font-size: 14px; margin: 30px 0 0;">
                      This code will expire in 10 minutes.<br>
                      If you didn't request this, you can safely ignore this email.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px; text-align: center; background-color: #fcfcfd; border-top: 1px solid #e3e8ee; color: #a3acb9; font-size: 12px;">
                    &copy; 2025 Event Management Platform
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
    // Important headers to reduce spam score
    headers: {
      'List-Unsubscribe': `<mailto:no-reply@eventmanagement.com?subject=unsubscribe>`,
      'X-Entity-Ref-ID': Date.now().toString()
    }
  };

  try {
    const info = await transporter.sendMail(mailOptions);
  } catch (error) {
    throw error;
  }
};
