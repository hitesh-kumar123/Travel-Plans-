import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { authApi } from "../../services/api/authApi";
import { useAuth } from "../../context/AuthContext";
import { getErrorMessage } from "../../services/api/client";
import { CheckCircle, AlertCircle, ArrowRight } from "lucide-react";

export const ResetPasswordPage = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { refreshProfile } = useAuth();
  const navigate = useNavigate();

  const validatePassword = (pass) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(pass);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Missing or invalid password reset token.");
      return;
    }

    if (!validatePassword(password)) {
      setError(
        "Password must be at least 8 characters with 1 uppercase, 1 lowercase, 1 number, and 1 special symbol.",
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.resetPassword(token, { password });
      if (res.data?.token) {
        localStorage.setItem("packgo_token", res.data.token);
        if (res.data.user) {
          localStorage.setItem("packgo_user", JSON.stringify(res.data.user));
        }
        await refreshProfile();
      }
      setSuccess(true);
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Failed to reset password. Link may have expired.",
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCF9F8] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-28 selection:bg-[#FFDBC9] selection:text-[#321200]">
      <div className="max-w-md w-full bg-white/70 backdrop-blur-md p-8 sm:p-12 border border-[#DAC2B6]/40 rounded shadow-xs">
        {success ? (
          <div className="text-center py-4 space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#CDEACE] text-[#2E4632] flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="w-8 h-8" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6C2F00] block">
              SECURITY UPDATED
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#1C1B1B]">
              Password updated
            </h2>
            <p className="text-sm text-[#54433A] leading-relaxed max-w-sm mx-auto">
              Your password has been successfully reset. You can now access your
              planned journeys.
            </p>
            <div className="pt-4">
              <button
                type="button"
                onClick={() => navigate("/my-journey")}
                className="w-full bg-[#6C2F00] text-white py-3.5 px-6 rounded text-xs font-semibold uppercase tracking-widest hover:bg-[#8B4513] transition-colors cursor-pointer"
              >
                Go to My Journeys
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6C2F00]">
                NEW CREDENTIALS
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1B1B]">
                Set new password
              </h1>
              <p className="text-sm text-[#54433A]">
                Choose a strong password for your PackGo account.
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
                  htmlFor="new-password"
                >
                  New Password
                </label>
                <input
                  id="new-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent border-0 border-b border-[#DAC2B6] py-3 text-base text-[#1C1B1B] placeholder-[#877369]/50 focus:ring-0 focus:border-[#6C2F00] transition-colors"
                />
                <p className="text-[11px] text-[#877369] mt-1">
                  Min 8 chars with uppercase, lowercase, number & special symbol
                </p>
              </div>

              <div>
                <label
                  className="block text-xs font-semibold uppercase tracking-wider text-[#877369] mb-1"
                  htmlFor="confirm-password"
                >
                  Confirm Password
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent border-0 border-b border-[#DAC2B6] py-3 text-base text-[#1C1B1B] placeholder-[#877369]/50 focus:ring-0 focus:border-[#6C2F00] transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#6C2F00] text-white text-xs font-semibold uppercase tracking-widest py-4 px-8 rounded flex items-center justify-center gap-2 hover:bg-[#8B4513] transition-colors duration-300 shadow-sm disabled:opacity-50 cursor-pointer"
              >
                <span>{loading ? "Updating..." : "Update Password"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
