const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const crypto = require("crypto");

const User = require("../models/User");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (e) {
    done(e);
  }
});

// Only register the Google strategy if we have the required credentials.
// This prevents the server from crashing during local dev when env vars are missing.
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.warn(
    "[Google OAuth] Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET. Google login will not work until these env vars are set.",
  );
} else {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL:
          process.env.GOOGLE_CALLBACK_URL ||
          "http://localhost:5000/api/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile && profile.emails && profile.emails[0]
            ? profile.emails[0].value
            : null;

          const displayName = profile ? profile.displayName : null;
          const name =
            displayName || (email ? email.split("@")[0] : null) || "Google User";

          if (!email) {
            return done(new Error("Google account did not provide an email."));
          }

          let user = await User.findOne({ email: email.toLowerCase() });

          if (!user) {
            // IMPORTANT: `User.password` schema enforces strong password rules.
            // Random hex may fail validation in some cases, causing OAuth to fail.
            // Generate a password that always satisfies:
            // - min 8 chars
            // - >=1 uppercase, >=1 lowercase, >=1 number, >=1 special char
            const upper = "A";
            const lower = "a";
            const number = "1";
            const special = "!";
            // base64 may include letters/numbers; prefix guarantees complexity.
            const rest = crypto.randomBytes(24).toString("base64");
            const randomPassword = `${upper}${lower}${number}${special}${rest}`;

            user = await User.create({
              name,
              email: email.toLowerCase(),
              password: randomPassword,
              isVerified: true,
            });
          }

          return done(null, user);

        } catch (err) {
          return done(err);
        }
      },
    ),
  );
}


module.exports = passport;

