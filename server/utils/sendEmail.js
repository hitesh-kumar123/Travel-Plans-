const nodemailer = require("nodemailer");

let transporter;

const parseBoolean = (value, fallback = false) => {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  return ["true", "1", "yes", "on"].includes(String(value).toLowerCase());
};

const buildTransporter = async () => {
  const service = (process.env.EMAIL_SERVICE || process.env.SMTP_SERVICE || "")
    .trim()
    .toLowerCase();
  const hostFromEnv = process.env.EMAIL_HOST || process.env.SMTP_HOST;
  const user = process.env.EMAIL_USER || process.env.SMTP_USER;
  const pass = process.env.EMAIL_PASS || process.env.SMTP_PASS;

  if (!user || !pass) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "Email credentials are not configured. Set EMAIL_USER and EMAIL_PASS, or SMTP_USER and SMTP_PASS.",
      );
    }

    const testAccount = await nodemailer.createTestAccount();
    const etherealTransport = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      family: 4,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    console.warn(
      "No SMTP credentials found. Using Nodemailer Ethereal fallback for email delivery. Preview emails from the generated Ethereal account.",
    );

    return etherealTransport;
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
    family: 4,
    auth: {
      user,
      pass,
    },
  });
};

const getTransporter = async () => {
  if (!transporter) {
    transporter = await buildTransporter();
  }

  return transporter;
};

const sendEmail = async (options) => {
  const activeTransporter = await getTransporter();
  const fromEmail =
    process.env.EMAIL_FROM ||
    process.env.FROM_EMAIL ||
    process.env.EMAIL_USER ||
    process.env.SMTP_USER ||
    "noreply@packgo.com";
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
    const info = await activeTransporter.sendMail(message);

    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`Ethereal preview URL: ${previewUrl}`);
    }

    return info;
  } catch (error) {
    console.error("[sendEmail] SMTP send failed", {
      to: options.email,
      subject: options.subject,
      host: activeTransporter.options?.host,
      port: activeTransporter.options?.port,
      secure: activeTransporter.options?.secure,
      authUser: activeTransporter.options?.auth?.user,
      message: error.message,
      code: error.code,
      response: error.response,
      stack: error.stack,
    });

    const wrappedError = new Error(
      `Failed to send email to ${options.email}: ${error.message}`,
    );
    wrappedError.cause = error;
    throw wrappedError;
  }
};

module.exports = sendEmail;
