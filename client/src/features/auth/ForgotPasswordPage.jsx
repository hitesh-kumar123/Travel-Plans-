import React, { useState } from "react";
import { Link } from "react-router-dom";
import { authApi } from "../../services/api/authApi";
import { getErrorMessage } from "../../services/api/client";
import { ArrowRight, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your registered email address.");
      return;
    }

    setLoading(true);
    try {
      await authApi.forgotPassword({ email: email.trim() });
      setSubmitted(true);
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Failed to send reset link. Please check your email.",
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCF9F8] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-28 selection:bg-[#FFDBC9] selection:text-[#321200]">
      <div className="max-w-md w-full bg-white/70 backdrop-blur-md p-8 sm:p-12 border border-[#DAC2B6]/40 rounded shadow-xs">
        {submitted ? (
          <div className="text-center py-4 space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#CDEACE] text-[#2E4632] flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="w-8 h-8" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6C2F00] block">
              DISPATCHED
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#1C1B1B]">
              Recovery link sent
            </h2>
            <p className="text-sm text-[#54433A] leading-relaxed max-w-sm mx-auto">
              If an account exists for <strong>{email}</strong>, you will
              receive a password reset link shortly (valid for 10 minutes).
            </p>
            <div className="pt-4">
              <Link
                to="/login"
                className="w-full inline-block bg-[#6C2F00] text-white py-3.5 px-6 rounded text-xs font-semibold uppercase tracking-widest hover:bg-[#8B4513] transition-colors"
              >
                Return to Login
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6C2F00]">
                ACCOUNT RECOVERY
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1B1B]">
                Forgot password?
              </h1>
              <p className="text-sm text-[#54433A]">
                Enter your registered email address to receive password recovery
                instructions.
              </p>
            </div>

            {error && (
              <div className="p-4 rounded bg-[#FFDAD6]/60 border border-[#BA1A1A]/30 flex items-start gap-3 text-xs text-[#BA1A1A]">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 pt-2">
              <div>
                <label
                  className="block text-xs font-semibold uppercase tracking-wider text-[#877369] mb-1"
                  htmlFor="recovery-email"
                >
                  Email Address
                </label>
                <input
                  id="recovery-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. ananya@example.com"
                  className="w-full bg-transparent border-0 border-b border-[#DAC2B6] py-3 text-base text-[#1C1B1B] placeholder-[#877369]/50 focus:ring-0 focus:border-[#6C2F00] transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#6C2F00] text-white text-xs font-semibold uppercase tracking-widest py-4 px-8 rounded flex items-center justify-center gap-2 hover:bg-[#8B4513] transition-colors duration-300 shadow-sm disabled:opacity-50 cursor-pointer"
              >
                <span>{loading ? "Sending..." : "Send Recovery Link"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-2 text-center">
              <Link
                to="/login"
                className="inline-flex items-center text-xs font-semibold text-[#54433A] hover:text-[#6C2F00] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                Back to Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
