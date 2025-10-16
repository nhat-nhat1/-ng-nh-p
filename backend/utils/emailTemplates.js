const appName = process.env.APP_NAME || 'My App';

function baseEmailTemplate(content) {
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;background:#f6f9fc;padding:20px;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e6ebf1;">
      <tr>
        <td style="background:#0d6efd;color:#fff;padding:16px 24px;font-size:18px;font-weight:bold;">${appName}</td>
      </tr>
      <tr>
        <td style="padding:24px;color:#333;line-height:1.6;">
          ${content}
        </td>
      </tr>
      <tr>
        <td style="padding:16px 24px;color:#6b7280;font-size:12px;background:#f9fafb;">© ${new Date().getFullYear()} ${appName}. All rights reserved.</td>
      </tr>
    </table>
  </div>`;
}

function otpEmailTemplate(otp) {
  const content = `
    <h2 style="margin-top:0;margin-bottom:12px;color:#111827;">Xác thực tài khoản</h2>
    <p style="margin:0 0 12px;">Mã xác thực của bạn là:</p>
    <p style="font-size:24px;letter-spacing:6px;font-weight:bold;margin:12px 0;">${otp}</p>
    <p style="margin:0 0 12px;">Mã có hiệu lực trong <strong>10 phút</strong>.</p>
  `;
  return baseEmailTemplate(content);
}

function forgotPasswordEmailTemplate(resetUrl) {
  const content = `
    <h2 style="margin-top:0;margin-bottom:12px;color:#111827;">Đặt lại mật khẩu</h2>
    <p style="margin:0 0 12px;">Click link để đặt lại mật khẩu:</p>
    <p style="margin:0 0 12px;"><a style="color:#0d6efd;" href="${resetUrl}" target="_blank" rel="noopener noreferrer">${resetUrl}</a></p>
    <p style="margin:0;">Link hết hạn sau <strong>1 giờ</strong>.</p>
  `;
  return baseEmailTemplate(content);
}

module.exports = { otpEmailTemplate, forgotPasswordEmailTemplate };
