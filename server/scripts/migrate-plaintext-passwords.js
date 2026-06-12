const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const User = require("../models/User");

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const BCRYPT_PREFIX = /^\$2[aby]\$/;
const dryRun = !process.argv.includes("--save");

async function migratePlaintextPasswords() {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is not set. Aborting.");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");
  console.log(
    dryRun
      ? "DRY RUN — no changes will be saved (pass --save to apply)"
      : "LIVE RUN — plaintext passwords will be rehashed",
  );

  const users = await User.find().select("+password email");
  let skipped = 0;
  let migrated = 0;
  let failed = 0;

  for (const user of users) {
    if (User.isBcryptHash(user.password)) {
      skipped += 1;
      continue;
    }

    if (dryRun) {
      console.log(`[dry-run] Would migrate: ${user.email}`);
      migrated += 1;
      continue;
    }

    try {
      user.markModified("password");
      await user.save();
      console.log(`Migrated: ${user.email}`);
      migrated += 1;
    } catch (err) {
      console.error(`Failed to migrate ${user.email}:`, err.message);
      failed += 1;
    }
  }

  console.log("\nSummary:");
  console.log(`  Total scanned: ${users.length}`);
  console.log(`  Already bcrypt: ${skipped}`);
  console.log(`  ${dryRun ? "Would migrate" : "Migrated"}: ${migrated}`);
  if (!dryRun) {
    console.log(`  Failed: ${failed}`);
  }

  await mongoose.disconnect();
}

migratePlaintextPasswords().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
