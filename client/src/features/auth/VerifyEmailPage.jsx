import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { authApi } from "../../services/api/authApi";
import { getErrorMessage } from "../../services/api/client";
import { CheckCircle, AlertCircle, Loader2, ArrowRight } from "lucide-react";

export const VerifyEmailPage = () => {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setLoading(false);
        setSuccess(false);
        setMessage("Invalid or missing verification token.");
        return;
      }

      try {
        const res = await authApi.verifyEmail(token);
        setSuccess(true);
        setMessage(
          res.data?.msg || "Your email address has been verified successfully.",
        );
      } catch (err) {
        setSuccess(false);
        setMessage(
          getErrorMessage(err, "Verification link is invalid or expired."),
        );
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-screen bg-[#FCF9F8] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-28 selection:bg-[#FFDBC9] selection:text-[#321200]">
      <div className="max-w-md w-full text-center bg-white/70 backdrop-blur-md p-8 sm:p-12 border border-[#DAC2B6]/40 rounded shadow-xs">
        {loading ? (
          <div className="py-12 space-y-4">
            <Loader2 className="w-10 h-10 text-[#6C2F00] animate-spin mx-auto" />
            <h2 className="font-serif text-2xl font-bold text-[#1C1B1B]">
              Verifying your email...
            </h2>
            <p className="text-xs text-[#54433A]">
              Validating your security token with the sanctuary.
            </p>
          </div>
        ) : success ? (
          <div className="space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#CDEACE] text-[#2E4632] flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2E4632] block">
                VERIFICATION COMPLETE
              </span>
              <h1 className="font-serif text-3xl font-bold text-[#1C1B1B]">
                Email verified
              </h1>
              <p className="text-sm text-[#54433A] leading-relaxed">
                {message} You may now sign in and start planning your journeys.
              </p>
            </div>

            <div className="pt-2">
              <Link
                to="/login"
                className="w-full bg-[#6C2F00] text-white text-xs font-semibold uppercase tracking-widest py-4 px-6 rounded flex items-center justify-center gap-2 hover:bg-[#8B4513] transition-colors duration-300 shadow-sm"
              >
                <span>Sign In Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#FFDAD6] text-[#BA1A1A] flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#BA1A1A] block">
                VERIFICATION ISSUE
              </span>
              <h1 className="font-serif text-3xl font-bold text-[#1C1B1B]">
                Unable to verify
              </h1>
              <p className="text-sm text-[#BA1A1A] leading-relaxed">
                {message}
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <Link
                to="/register"
                className="w-full bg-[#6C2F00] text-white text-xs font-semibold uppercase tracking-widest py-3.5 px-6 rounded block text-center hover:bg-[#8B4513] transition-colors"
              >
                Create New Account
              </Link>
              <Link
                to="/login"
                className="w-full border border-[#DAC2B6] text-[#1C1B1B] text-xs font-semibold uppercase tracking-widest py-3.5 px-6 rounded block text-center hover:bg-[#F6F3F2] transition-colors"
              >
                Return to Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
