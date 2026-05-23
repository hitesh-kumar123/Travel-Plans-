# TODO - Fix Google OAuth sign-in flow

- [x] Step 1: Update `server/config/passport.js` to generate Google users with password values that satisfy `User` schema complexity constraints.
- [x] Step 2: Harden `server/routes/auth.js` OAuth callback error handling (JWT_SECRET missing, req.user missing) with explicit failure redirects.
- [x] Step 3: Adjust `server/server.js` session cookie settings for production compatibility (SameSite/secure/trust proxy).
- [x] Step 4: Improve `client/src/pages/Dashboard.js` token persistence path so user loading is triggered reliably after redirect.

- [ ] Step 5: Fix any remaining client build/lint issues caused by the changes, then manual verification matrix for Google sign-in.

