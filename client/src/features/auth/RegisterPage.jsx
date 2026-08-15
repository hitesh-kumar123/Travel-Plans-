import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../context/AuthContext";
import { getErrorMessage } from "../../services/api/client";
import { ArrowRight, AlertCircle, MapPin } from "lucide-react";

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { register, googleLogin } = useAuth();
  const navigate = useNavigate();

  const validatePassword = (pass) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(pass);
  };

  const validateName = (name) => {
    return /^[A-Za-z\s]+$/.test(name) && name.trim().length >= 2;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!validateName(name)) {
      setError("Name must contain only letters and be at least 2 characters.");
      return;
    }

    if (!validatePassword(password)) {
      setError(
        "Password must be at least 8 characters with 1 uppercase, 1 lowercase, 1 number, and 1 special character.",
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await register(name.trim(), email.trim(), password);
      navigate("/my-journey", { replace: true });
    } catch (err) {
      setError(
        getErrorMessage(err, "Failed to create account. Please try again."),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    if (!credentialResponse?.credential) {
      setError("Google authentication was unsuccessful.");
      return;
    }

    setLoading(true);
    try {
      await googleLogin(credentialResponse.credential);
      navigate("/my-journey", { replace: true });
    } catch (err) {
      setError(
        getErrorMessage(err, "Google sign in failed. Please try again."),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Google sign in was aborted or failed.");
  };

  return (
    <div className="bg-[#FCF9F8] text-[#1C1B1B] min-h-screen flex flex-col md:flex-row antialiased selection:bg-[#FFDBC9] selection:text-[#321200] pt-16 md:pt-0">
      {/* ── Left Split: Cinematic Amber Fort Golden Hour (Desktop Only) ── */}
      <div className="hidden md:flex w-1/2 relative bg-[#E5E2E1] overflow-hidden group min-h-screen">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBnfFcrlQFDU57fX6MVvRgStusuqLQvJhMBSzCxEaelSizZ0zKkIYUVT-mZ3ZRbzpxbvRFCILB3qz9Q7LH3l5V2C3IYZpj0pymHR-wH9cgmUn-PpjARnG8IZBGxX1NoKs0mZGF7kyC4wckOYxNzuS3gPhyx6jSLb1bwrC0Wdnquf4MjmH2eW6m3POuKEJanXCeCc5QGFT2Oudu3Sr8wlWLUhIEY8dE3wR10WwqkqJn_-fYiCOo0w3ybFA')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
        <div className="absolute bottom-16 left-16 text-white flex flex-col gap-2 z-10 max-w-md">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FFB68C]">
            Featured Destination
          </p>
          <h2 className="font-serif text-4xl lg:text-5xl font-bold">
            Jaipur, Rajasthan
          </h2>
          <div className="flex items-center gap-2 mt-2 opacity-90 text-sm">
            <MapPin className="w-4 h-4 text-[#FFB68C]" />
            <span>India</span>
          </div>
        </div>
      </div>

      {/* ── Right Split: Sign Up Form ── */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-16 md:py-24 relative bg-[#FCF9F8]">
        <div className="max-w-md mx-auto w-full flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6C2F00]">
              JOIN PACKGO
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1B1B]">
              Start your journey
            </h1>
            <p className="text-sm sm:text-base text-[#54433A]">
              Create your PackGo account and start planning intentional travels.
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
                htmlFor="name"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g. Vikramaditya Singh"
                className="w-full bg-transparent border-0 border-b border-[#DAC2B6] py-3 text-base text-[#1C1B1B] placeholder-[#877369]/50 focus:ring-0 focus:border-[#6C2F00] transition-colors"
              />
            </div>

            <div>
              <label
                className="block text-xs font-semibold uppercase tracking-wider text-[#877369] mb-1"
                htmlFor="email"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="e.g. vikram@example.com"
                className="w-full bg-transparent border-0 border-b border-[#DAC2B6] py-3 text-base text-[#1C1B1B] placeholder-[#877369]/50 focus:ring-0 focus:border-[#6C2F00] transition-colors"
              />
            </div>

            <div>
              <label
                className="block text-xs font-semibold uppercase tracking-wider text-[#877369] mb-1"
                htmlFor="password"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="••••••••"
                className="w-full bg-transparent border-0 border-b border-[#DAC2B6] py-3 text-base text-[#1C1B1B] placeholder-[#877369]/50 focus:ring-0 focus:border-[#6C2F00] transition-colors"
              />
              <p className="text-[11px] text-[#877369] mt-1">
                Min 8 chars, 1 uppercase, 1 lowercase, 1 number & 1 special
              </p>
            </div>

            <div>
              <label
                className="block text-xs font-semibold uppercase tracking-wider text-[#877369] mb-1"
                htmlFor="confirmPassword"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                placeholder="••••••••"
                className="w-full bg-transparent border-0 border-b border-[#DAC2B6] py-3 text-base text-[#1C1B1B] placeholder-[#877369]/50 focus:ring-0 focus:border-[#6C2F00] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#6C2F00] text-white text-xs font-semibold uppercase tracking-widest py-4 px-8 rounded flex items-center justify-center gap-2 hover:bg-[#8B4513] transition-colors duration-300 shadow-sm disabled:opacity-50 mt-2 cursor-pointer"
            >
              <span>{loading ? "Creating Account..." : "Create Account"}</span>
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
              text="signup_with"
              width="350"
            />
          </div>

          {/* Footer Link */}
          <div className="pt-2 text-center text-xs text-[#54433A]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-[#6C2F00] hover:underline ml-1"
            >
              Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
