const nodemailer = require("nodemailer");

let cachedTransporter = null;

const sendEmail = async (options) => {
  let transporter;

  // In production, the admin will set these environment variables (e.g., SendGrid, Mailgun)
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    if (!cachedTransporter) {
      console.log("Creating Ethereal test account...");
      const start = Date.now();
      // Generate test SMTP service account from ethereal.email for local testing
      let testAccount = await nodemailer.createTestAccount();
      cachedTransporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.log(
        `🚀 Ethereal test SMTP account generated successfully in ${Date.now() - start}ms!`,
      );
      console.log(`User: ${testAccount.user}`);
    }
    transporter = cachedTransporter;
  }

  const message = {
    from: `${process.env.FROM_NAME || "PackGo"} <${process.env.FROM_EMAIL || "noreply@packgo.com"}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  const info = await transporter.sendMail(message);

  if (!process.env.SMTP_HOST) {
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  }
};

module.exports = sendEmail;
