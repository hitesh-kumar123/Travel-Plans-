const nodemailer = require("nodemailer");

let transporter;

const parseBoolean = (value, fallback = false) => {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  return ["true", "1", "yes", "on"].includes(String(value).toLowerCase());
};

const buildTransporter = () => {
  const service = (process.env.EMAIL_SERVICE || process.env.SMTP_SERVICE || "")
    .trim()
    .toLowerCase();
  const hostFromEnv = process.env.EMAIL_HOST || process.env.SMTP_HOST;
  const user = process.env.EMAIL_USER || process.env.SMTP_USER;
  const pass = process.env.EMAIL_PASS || process.env.SMTP_PASS;

  if (!user || !pass) {
    throw new Error(
      "Email credentials are not configured. Set EMAIL_USER and EMAIL_PASS, or SMTP_USER and SMTP_PASS.",
    );
  }

  let host = hostFromEnv;
  if (!host) {
    if (
      service === "gmail" ||
      (!service && user.toLowerCase().includes("gmail.com"))
    ) {
      host = "smtp.gmail.com";
    } else if (service === "resend") {
      host = "smtp.resend.com";
    } else {
      throw new Error(
        "Email host is not configured. Set EMAIL_HOST/SMTP_HOST or EMAIL_SERVICE to gmail or resend.",
      );
    }
  }

  const port = Number(process.env.EMAIL_PORT || process.env.SMTP_PORT || 587);
  const secure = parseBoolean(
    process.env.EMAIL_SECURE ?? process.env.SMTP_SECURE,
    port === 465,
  );

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
};

const getTransporter = () => {
  if (!transporter) {
    transporter = buildTransporter();
  }

  return transporter;
};

const sendEmail = async (options) => {
  const activeTransporter = getTransporter();
  const fromEmail =
    process.env.EMAIL_FROM ||
    process.env.FROM_EMAIL ||
    process.env.EMAIL_USER ||
    process.env.SMTP_USER;
  const fromName =
    process.env.EMAIL_FROM_NAME || process.env.FROM_NAME || "PackGo";

  const message = {
    from: `${fromName} <${fromEmail}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  try {
    await activeTransporter.verify();
    return await activeTransporter.sendMail(message);
  } catch (error) {
    const wrappedError = new Error(
      `Failed to send email to ${options.email}: ${error.message}`,
    );
    wrappedError.cause = error;
    throw wrappedError;
  }
};

module.exports = sendEmail;
