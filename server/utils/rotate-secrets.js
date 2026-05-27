#!/usr/bin/env node
// rotate-secrets.js
// Safely rotate local secrets that can be regenerated (e.g. JWT_SECRET).
// This script will:
//  - create a timestamped backup of your existing .env as .env.bak.TIMESTAMP
//  - replace `JWT_SECRET` with a new securely-random value
//  - print manual steps you must perform for provider-side rotations

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

function genSecret(len = 64) {
  return crypto
    .randomBytes(len)
    .toString("base64")
    .replace(/[^A-Za-z0-9]/g, "")
    .slice(0, len);
}

const repoRoot = path.resolve(__dirname, "..", "..");
const envPath = path.join(repoRoot, ".env");

if (!fs.existsSync(envPath)) {
  console.error("No .env file found at", envPath);
  process.exit(1);
}

const backupPath = envPath + ".bak." + Date.now();
fs.copyFileSync(envPath, backupPath);

const content = fs.readFileSync(envPath, "utf8");
const lines = content.split(/\r?\n/);
const newJwt = genSecret(64);

let replaced = false;
const newLines = lines.map((l) => {
  if (l.startsWith("JWT_SECRET=")) {
    replaced = true;
    return `JWT_SECRET=${newJwt}`;
  }
  return l;
});

if (!replaced) newLines.push(`JWT_SECRET=${newJwt}`);

fs.writeFileSync(envPath, newLines.join("\n"));

console.log("Backed up current .env to:", backupPath);
console.log("Replaced/added `JWT_SECRET` in .env");
console.log("New JWT_SECRET (stored only in .env):", "(hidden for safety)");

console.log("\nManual provider rotation steps you must perform:");
console.log(
  "- MongoDB: update the database user password in your provider (Atlas), then update `MONGO_URI` in .env with the new password.",
);
console.log(
  "- Gmail: generate a new App Password at https://myaccount.google.com/apppasswords and set `EMAIL_PASS` in .env.",
);
console.log(
  "- Resend/other SMTP: rotate API keys in provider console and update `EMAIL_PASS` accordingly.",
);
console.log(
  "- After rotating provider credentials, restart the server and run the SMTP test:",
);
console.log("\n  node server/utils/test-smtp.js\n");

console.log(
  "If you want, commit the backup to a secure location or move it to an off-repo safe store.",
);
console.log("Done.");
