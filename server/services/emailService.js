const nodemailer = require("nodemailer");

const buildTransport = () => {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error("SMTP configuration is incomplete");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
};

const sendOtpEmail = async ({ to, name, purpose, code, ttlMinutes }) => {
  const transporter = buildTransport();
  const from = process.env.SMTP_FROM || "no-reply@packgo.local";

  const subjectMap = {
    register: "Verify your PackGo account",
    password_reset: "Reset your PackGo password",
    change_password: "Confirm your PackGo password change",
  };

  const actionMap = {
    register: "complete your registration",
    password_reset: "reset your password",
    change_password: "change your password",
  };

  const subject = subjectMap[purpose] || "Your PackGo verification code";
  const actionText = actionMap[purpose] || "continue";

  const text = `Hi ${name || "there"},\n\nYour PackGo verification code is ${code}. Use it to ${actionText}.\n\nThis code expires in ${ttlMinutes} minutes.\n\nIf you did not request this, you can ignore this email.\n\nThanks,\nPackGo Team`;

  await transporter.sendMail({
    from,
    to,
    subject,
    text,
  });
};

module.exports = {
  sendOtpEmail,
};
