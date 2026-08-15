import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Mail, ArrowRight } from "lucide-react";

export const EmailNoticePage = () => {
  const location = useLocation();
  const email = location.state?.email || "your email";

  return (
    <div className="min-h-screen bg-[#FCF9F8] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-28 selection:bg-[#FFDBC9] selection:text-[#321200]">
      <div className="max-w-md w-full text-center bg-white/70 backdrop-blur-md p-8 sm:p-12 border border-[#DAC2B6]/40 rounded shadow-xs space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#FFDBC9] text-[#6C2F00] flex items-center justify-center mx-auto">
          <Mail className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6C2F00]">
            ACCOUNT CREATED
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1B1B]">
            Check your email
          </h1>
          <p className="text-sm text-[#54433A] leading-relaxed">
            We have dispatched an activation link to <strong>{email}</strong>.
            Please check your inbox and verify your address.
          </p>
        </div>

        <div className="p-4 bg-[#F6F3F2] rounded border border-[#DAC2B6]/30 text-xs text-[#54433A] text-left leading-relaxed">
          <p className="font-semibold text-[#1C1B1B] mb-1">
            Didn't receive the email?
          </p>
          <p>
            Please check your spam or junk folder. The verification token is
            active for 24 hours.
          </p>
        </div>

        <Link
          to="/login"
          className="w-full bg-[#6C2F00] text-white text-xs font-semibold uppercase tracking-widest py-4 px-6 rounded flex items-center justify-center gap-2 hover:bg-[#8B4513] transition-colors duration-300 shadow-sm"
        >
          <span>Proceed to Log In</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default EmailNoticePage;
