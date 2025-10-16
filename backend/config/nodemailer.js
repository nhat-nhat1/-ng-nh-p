const nodemailer = require('nodemailer');

function createTransporter() {
  const { EMAIL_USER, EMAIL_PASS, SMTP_HOST, SMTP_PORT } = process.env;

  if (!EMAIL_USER || !EMAIL_PASS) {
    console.warn('EMAIL_USER/EMAIL_PASS not set. Emails will be logged to console.');
    // Use a stub transport that logs emails for development
    return {
      sendMail: async (options) => {
        console.log('--- Email (DEV LOG) ---');
        console.log('To:', options.to);
        console.log('Subject:', options.subject);
        console.log('HTML:', options.html);
        console.log('-----------------------');
        return { messageId: 'dev-log' };
      },
    };
  }

  // Support generic SMTP (e.g., Mailtrap) when SMTP_HOST is provided
  if (SMTP_HOST) {
    return nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT) || 587,
      auth: { user: EMAIL_USER, pass: EMAIL_PASS },
    });
  }

  // Default to Gmail if no SMTP_HOST provided
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user: EMAIL_USER, pass: EMAIL_PASS },
  });
}

module.exports = { createTransporter };
