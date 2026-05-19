/**
 * Email templates helper for PackGo
 * Optimized for bulletproof mobile centering using table-based alignment
 */

/**
 * Generate highly visual HTML template for OTP codes
 */
exports.getOtpEmailTemplate = (name, otp, purposeText) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verification - PackGo</title>
  <style>
    body {
      font-family: "Poppins", "Roboto", "Helvetica Neue", Helvetica, Arial, sans-serif;
      background-color: #f5f7fa;
      color: #2d3748;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .container {
      max-width: 500px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 10px 25px rgba(63, 81, 181, 0.08);
      border: 1px solid rgba(63, 81, 181, 0.05);
    }
    .header {
      background: linear-gradient(135deg, #3f51b5 0%, #757de8 100%);
      padding: 35px 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 30px;
      font-weight: 800;
      color: #ffffff;
      letter-spacing: 2px;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .header-sub {
      color: rgba(255, 255, 255, 0.85);
      font-size: 13px;
      margin-top: 5px;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      font-weight: 600;
    }
    .content {
      padding: 40px 30px;
      text-align: center;
    }
    .content h2 {
      margin-top: 0;
      margin-bottom: 25px;
      font-size: 24px;
      font-weight: 700;
      color: #3f51b5;
    }
    .greeting {
      font-size: 17px;
      color: #2d3748;
      font-weight: 600;
      margin-bottom: 8px;
    }
    .purpose {
      font-size: 15px;
      color: #718096;
      margin-bottom: 25px;
      line-height: 1.5;
    }
    .otp-wrapper {
      width: 100%;
      text-align: center;
      margin: 25px 0 35px 0;
    }
    .otp-table {
      margin: 0 auto;
      text-align: center;
    }
    .otp-box {
      background-color: #f0f2fd;
      border: 1.5px solid rgba(63, 81, 181, 0.12);
      border-radius: 16px;
      padding: 16px 32px;
      text-align: center;
      box-shadow: 0 4px 10px rgba(63, 81, 181, 0.03);
    }
    .otp-code {
      font-size: 38px;
      font-weight: 800;
      letter-spacing: 8px;
      color: #3f51b5;
      font-family: 'Courier New', Courier, monospace;
      text-align: center;
      margin-left: 8px; /* Offsets final letter-spacing space for true centering */
    }
    .expiry {
      font-size: 14px;
      font-weight: 600;
      color: #718096;
      margin-bottom: 35px;
    }
    .expiry strong {
      color: #ff6e40; /* PackGo Coral secondary accent */
    }
    .divider {
      height: 1px;
      background-color: rgba(63, 81, 181, 0.08);
      margin: 25px 0;
    }
    .footer {
      font-size: 12px;
      color: #a0aec0;
      line-height: 1.6;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>PackGo</h1>
      <div class="header-sub">Your Smart Travel Companion</div>
    </div>
    <div class="content">
      <h2>Email Verification</h2>
      <div class="greeting">Hi ${name || "Traveler"},</div>
      <div class="purpose">${purposeText || "Your one time verification code is:"}</div>
      
      <div class="otp-wrapper">
        <table class="otp-table" align="center" role="presentation" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td class="otp-box">
              <div class="otp-code">${otp}</div>
            </td>
          </tr>
        </table>
      </div>
      
      <div class="expiry">This verification code expires in <strong>5 minutes</strong>.</div>
      
      <div class="divider"></div>
      
      <div class="footer">
        If you did not make this request on PackGo, please safely ignore this email. Your account credentials remain fully secure.
      </div>
    </div>
  </div>
</body>
</html>
  `;
};

/**
 * Generate highly visual HTML template for Password Reset links
 */
exports.getPasswordResetTemplate = (name, resetUrl) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Password - PackGo</title>
  <style>
    body {
      font-family: "Poppins", "Roboto", "Helvetica Neue", Helvetica, Arial, sans-serif;
      background-color: #f5f7fa;
      color: #2d3748;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .container {
      max-width: 500px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 10px 25px rgba(63, 81, 181, 0.08);
      border: 1px solid rgba(63, 81, 181, 0.05);
    }
    .header {
      background: linear-gradient(135deg, #3f51b5 0%, #757de8 100%);
      padding: 35px 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 30px;
      font-weight: 800;
      color: #ffffff;
      letter-spacing: 2px;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .header-sub {
      color: rgba(255, 255, 255, 0.85);
      font-size: 13px;
      margin-top: 5px;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      font-weight: 600;
    }
    .content {
      padding: 40px 30px;
      text-align: center;
    }
    .content h2 {
      margin-top: 0;
      margin-bottom: 20px;
      font-size: 24px;
      font-weight: 700;
      color: #3f51b5;
    }
    .greeting {
      font-size: 17px;
      color: #2d3748;
      font-weight: 600;
      margin-bottom: 12px;
    }
    .message {
      font-size: 15px;
      color: #718096;
      line-height: 1.6;
      margin-bottom: 35px;
    }
    .btn-wrapper {
      margin: 30px 0;
    }
    .btn {
      display: inline-block;
      background: linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%);
      color: #ffffff !important;
      text-decoration: none;
      padding: 14px 35px;
      border-radius: 12px;
      font-weight: 700;
      font-size: 15px;
      box-shadow: 0 6px 20px rgba(63, 81, 181, 0.25);
      transition: all 0.2s;
    }
    .expiry {
      font-size: 14px;
      font-weight: 600;
      color: #718096;
      margin-bottom: 30px;
    }
    .expiry strong {
      color: #ff6e40; /* PackGo Coral accent */
    }
    .divider {
      height: 1px;
      background-color: rgba(63, 81, 181, 0.08);
      margin: 25px 0;
    }
    .footer {
      font-size: 12px;
      color: #a0aec0;
      line-height: 1.6;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>PackGo</h1>
      <div class="header-sub">Your Smart Travel Companion</div>
    </div>
    <div class="content">
      <h2>Reset Password</h2>
      <div class="greeting">Hi ${name || "Traveler"},</div>
      <div class="message">
        You requested a password reset for your PackGo account. Click the button below to establish a new password and secure your credentials.
      </div>
      
      <div class="btn-wrapper">
        <a href="${resetUrl}" class="btn" target="_blank">Reset Password</a>
      </div>
      
      <div class="expiry">This link will expire in <strong>10 minutes</strong>.</div>
      
      <div class="divider"></div>
      
      <div class="footer">
        If you did not request a password reset, you can safely ignore this email. Your credentials remain 100% secure.
      </div>
    </div>
  </div>
</body>
</html>
  `;
};
