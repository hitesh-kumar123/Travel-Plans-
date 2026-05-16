# Authentication Setup Guide

This document describes the authentication features that were added and how to configure them for local or production use.

## What Changed
- Registration now uses email OTP verification.
- Login supports Google sign-in.
- Forgot password uses email OTP verification.
- Change password uses email OTP verification from the profile page.
- Email service uses SMTP (Gmail example provided).

## Server Environment Variables (server/.env)
Set these in server/.env (do not commit secrets):

- PORT=5000
- MONGO_URI=your_mongodb_connection_string
- JWT_SECRET=your_strong_jwt_secret
- WEATHER_API_KEY=your_openweathermap_key
- FRONTEND_URL=http://localhost:3000
- OTP_SECRET=your_random_otp_hash_secret
- OTP_TTL_MINUTES=10
- SMTP_HOST=smtp.gmail.com
- SMTP_PORT=587
- SMTP_USER=your_gmail_address@gmail.com
- SMTP_PASS=your_gmail_app_password
- SMTP_FROM=PackGo <your_gmail_address@gmail.com>
- GOOGLE_CLIENT_ID=your_google_client_id

## Client Environment Variables (client/.env)
Set these in client/.env:

- REACT_APP_API_URL=http://localhost:5000/api
- REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id

## Google OAuth Setup
1. Go to Google Cloud Console.
2. Create or select a project.
3. Enable the OAuth consent screen (External is ok for local dev).
4. Create OAuth 2.0 Client ID (Web application).
5. Add Authorized JavaScript origins:
   - http://localhost:3000
6. Copy the client ID into:
   - server/.env as GOOGLE_CLIENT_ID
   - client/.env as REACT_APP_GOOGLE_CLIENT_ID

## Gmail SMTP Setup
1. Enable 2-Step Verification on the Gmail account.
2. Create an App Password for Mail.
3. Use the app password as SMTP_PASS.

## Endpoints Added
- POST /api/auth/register/request-otp
- POST /api/auth/register/verify-otp
- POST /api/auth/google
- POST /api/auth/forgot-password/request-otp
- POST /api/auth/forgot-password/verify-otp
- POST /api/auth/change-password/request-otp (auth required)
- PUT  /api/auth/change-password/verify-otp (auth required)

## How It Works
- Registration:
  1) Client calls request-otp with name, email, password.
  2) Server sends OTP to email.
  3) Client verifies OTP to complete registration and receive JWT.

- Google login:
  1) Client gets Google ID token from the widget.
  2) Server verifies token and issues JWT.

- Forgot password:
  1) Client requests OTP by email.
  2) Client submits OTP + new password.

- Change password (profile):
  1) Client requests OTP (auth required).
  2) Client submits OTP + new password.

## Run Locally
1. Server:
   - cd server
   - npm install
   - npm run dev

2. Client:
   - cd client
   - npm install
   - npm start

## Notes for Repo Owner
- Never commit real secrets to Git.
- Use .env.example as the template for required values.
- If you deploy, set env vars in the hosting provider and update FRONTEND_URL.
