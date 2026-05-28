const path = require("path");

// Load repo root .env (server is started from server/ folder)
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const sendEmail = require("./sendEmail");

async function main() {
  const to = process.env.EMAIL_USER;
  if (!to) {
    console.error("EMAIL_USER is not set in .env");
    process.exit(1);
  }

  try {
    console.log("Sending test email to", to);
    const info = await sendEmail({
      email: to,
      subject: "PackGo SMTP test",
      message: "This is a test message from PackGo SMTP tester.",
      html: "<p>This is a test message from <strong>PackGo</strong> SMTP tester.</p>",
    });
    console.log(
      "Email sent successfully:",
      info && info.messageId ? info.messageId : info,
    );
  } catch (err) {
    console.error("Test email failed:", err.message || err);
    if (err.cause) console.error("Cause:", err.cause);
    process.exit(2);
  }
}

main();
