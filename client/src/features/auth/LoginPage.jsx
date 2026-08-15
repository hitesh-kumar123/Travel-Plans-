import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../context/AuthContext";
import { getErrorMessage } from "../../services/api/client";
import { ArrowRight, AlertCircle, MapPin } from "lucide-react";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/my-journey";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Invalid credentials. Please check and try again.",
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    if (!credentialResponse?.credential) {
      setError("Google sign in was unsuccessful.");
      return;
    }

    setLoading(true);
    try {
      await googleLogin(credentialResponse.credential);
      navigate(from, { replace: true });
    } catch (err) {
      setError(
        getErrorMessage(err, "Google sign in failed. Please try again."),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Google authentication was aborted or failed.");
  };

  return (
    <div className="bg-[#FCF9F8] text-[#1C1B1B] min-h-screen flex flex-col md:flex-row antialiased selection:bg-[#FFDBC9] selection:text-[#321200] pt-16 md:pt-0">
      {/* ── Left Split: Cinematic Lake Palace Dawn (Desktop Only) ── */}
      <div className="hidden md:flex w-1/2 relative bg-[#E5E2E1] overflow-hidden group min-h-screen">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDgwce2EUUrGN4J1eQVpwtmDJ0AbgjAmdc3SL-5lxE3i9ttAkJxwwuFnU7dUk7mt6VwFa9q1bavGFVCVJLH0SkM19Bin41i0TYJOjHwTmtoBqE7HL0YUJ_aznT5miKJms1W_eJ2OBde46FmuRADF13jTx0XoqTVrUNU2uCoF4ApAJkor-cJ5ESAIUNeGWodrK6J52sBW2-fd2SZ5lawwyMWx3XDMnrJ19s9MxPLoX8HYvIiS1F5uSRqQQ')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
        <div className="absolute bottom-16 left-16 text-white flex flex-col gap-2 z-10 max-w-md">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FFB68C]">
            Featured Sanctuary
          </p>
          <h2 className="font-serif text-4xl lg:text-5xl font-bold">
            Lake Pichola, Udaipur
          </h2>
          <div className="flex items-center gap-2 mt-2 opacity-90 text-sm">
            <MapPin className="w-4 h-4 text-[#FFB68C]" />
            <span>Rajasthan, India</span>
          </div>
        </div>
      </div>

      {/* ── Right Split: Log In Form ── */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-16 md:py-24 relative bg-[#FCF9F8]">
        <div className="max-w-md mx-auto w-full flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6C2F00]">
              WELCOME BACK
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1B1B]">
              Return to your journey
            </h1>
            <p className="text-sm sm:text-base text-[#54433A]">
              Log in to your PackGo account to access your saved itineraries and
              tools.
            </p>
          </div>

          {error && (
            <div className="p-4 rounded bg-[#FFDAD6]/60 border border-[#BA1A1A]/30 flex items-start gap-3 text-xs text-[#BA1A1A]">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <label
                className="block text-xs font-semibold uppercase tracking-wider text-[#877369] mb-1"
                htmlFor="login-email"
              >
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. ananya@example.com"
                className="w-full bg-transparent border-0 border-b border-[#DAC2B6] py-3 text-base text-[#1C1B1B] placeholder-[#877369]/50 focus:ring-0 focus:border-[#6C2F00] transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label
                  className="block text-xs font-semibold uppercase tracking-wider text-[#877369]"
                  htmlFor="login-password"
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-[#6C2F00] hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                id="login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent border-0 border-b border-[#DAC2B6] py-3 text-base text-[#1C1B1B] placeholder-[#877369]/50 focus:ring-0 focus:border-[#6C2F00] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#6C2F00] text-white text-xs font-semibold uppercase tracking-widest py-4 px-8 rounded flex items-center justify-center gap-2 hover:bg-[#8B4513] transition-colors duration-300 shadow-sm disabled:opacity-50 mt-2 cursor-pointer"
            >
              <span>{loading ? "Signing In..." : "Log In"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Social Divider */}
          <div className="relative flex items-center py-1">
            <div className="flex-grow border-t border-[#DAC2B6]/40" />
            <span className="flex-shrink-0 mx-4 text-xs font-semibold text-[#877369] uppercase tracking-wider">
              or
            </span>
            <div className="flex-grow border-t border-[#DAC2B6]/40" />
          </div>

          {/* Google Sign In */}
          <div className="flex justify-center w-full">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="outline"
              size="large"
              shape="rectangular"
              text="signin_with"
              width="350"
            />
          </div>

          {/* Footer Link */}
          <div className="pt-2 text-center text-xs text-[#54433A]">
            Don't have an account yet?{" "}
            <Link
              to="/register"
              className="font-semibold text-[#6C2F00] hover:underline ml-1"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
