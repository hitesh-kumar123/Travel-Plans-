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
  // eslint-disable-next-line no-console
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
            const randomPassword = crypto.randomBytes(32).toString("hex");
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

