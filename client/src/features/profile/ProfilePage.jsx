import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { authApi } from "../../services/api/authApi";
import { getErrorMessage } from "../../services/api/client";
import Button from "../../components/Button";
import FormField from "../../components/FormField";
import Badge from "../../components/Badge";
import Modal from "../../components/Modal";
import {
  User,
  Mail,
  Lock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  KeyRound,
  Trash2,
} from "lucide-react";

export const ProfilePage = () => {
  const { user, updateUser, refreshProfile } = useAuth();

  // Name form state
  const [name, setName] = useState(user?.name || "");
  const [nameLoading, setNameLoading] = useState(false);
  const [nameSuccess, setNameSuccess] = useState(false);
  const [nameError, setNameError] = useState("");

  // Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passLoading, setPassLoading] = useState(false);
  const [passSuccess, setPassSuccess] = useState(false);
  const [passError, setPassError] = useState("");

  // Email change OTP state
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpStatus, setOtpStatus] = useState(null);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [otpSuccess, setOtpSuccess] = useState("");
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user]);

  // Check pending email status
  const checkEmailStatus = async () => {
    try {
      const res = await authApi.getEmailChangeStatus();
      setOtpStatus(res.data);
      if (res.data?.resendCooldown) {
        setCooldown(res.data.resendCooldown);
      }
    } catch (err) {
      console.warn("Could not check email status:", err);
    }
  };

  useEffect(() => {
    checkEmailStatus();
  }, []);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [cooldown]);

  // Handle Profile Name Update
  const handleUpdateName = async (e) => {
    e.preventDefault();
    setNameError("");
    setNameSuccess(false);

    if (!name.trim() || name.trim().length < 2) {
      setNameError("Name must contain letters and be at least 2 characters.");
      return;
    }

    setNameLoading(true);
    try {
      const res = await authApi.updateProfile({ name: name.trim() });
      updateUser({ name: res.data?.name || name.trim() });
      setNameSuccess(true);
      setTimeout(() => setNameSuccess(false), 3000);
    } catch (err) {
      setNameError(getErrorMessage(err, "Failed to update name."));
    } finally {
      setNameLoading(false);
    }
  };

  // Handle Password Change
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPassError("");
    setPassSuccess(false);

    if (!currentPassword || !newPassword) {
      setPassError("Please provide your current and new password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPassError("New passwords do not match.");
      return;
    }

    const validatePass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!validatePass.test(newPassword)) {
      setPassError(
        "New password must be min 8 characters with 1 uppercase, 1 lowercase, 1 digit, and 1 special symbol.",
      );
      return;
    }

    setPassLoading(true);
    try {
      await authApi.changePassword({ currentPassword, newPassword });
      setPassSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPassSuccess(false), 3500);
    } catch (err) {
      setPassError(
        getErrorMessage(err, "Current password incorrect or update failed."),
      );
    } finally {
      setPassLoading(false);
    }
  };

  // Handle Request Email OTP
  const handleRequestEmailOtp = async (e) => {
    e.preventDefault();
    setOtpError("");
    setOtpSuccess("");

    if (!newEmail || !newEmail.includes("@")) {
      setOtpError("Please provide a valid new email address.");
      return;
    }

    setOtpLoading(true);
    try {
      const res = await authApi.requestEmailChange({ email: newEmail.trim() });
      setOtpSuccess(
        res.data?.msg || "Verification code dispatched to your new email.",
      );
      setCooldown(60);
      await checkEmailStatus();
    } catch (err) {
      setOtpError(getErrorMessage(err, "Failed to request email change code."));
    } finally {
      setOtpLoading(false);
    }
  };

  // Handle Verify Email OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setOtpError("");

    if (!otpCode || otpCode.length < 4) {
      setOtpError("Please enter the 6-digit verification code.");
      return;
    }

    setOtpLoading(true);
    try {
      const res = await authApi.verifyEmailChange({ otpCode: otpCode.trim() });
      if (res.data?.user) {
        updateUser(res.data.user);
      }
      setIsOtpModalOpen(false);
      setOtpCode("");
      setNewEmail("");
      setOtpStatus(null);
      await refreshProfile();
      alert("Email address updated successfully.");
    } catch (err) {
      setOtpError(
        getErrorMessage(err, "Verification code is invalid or expired."),
      );
    } finally {
      setOtpLoading(false);
    }
  };

  // Handle Discard Email Request
  const handleDiscardEmailChange = async () => {
    try {
      await authApi.verifyEmailChange({ discard: true });
      setOtpStatus(null);
      setIsOtpModalOpen(false);
      setOtpCode("");
    } catch (err) {
      console.error("Discard error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCF9F8] pt-28 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Page Header */}
        <div className="border-b border-[#E5E2E1] pb-6">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6C2F00] block mb-1">
            Account Management
          </span>
          <h1 className="font-serif text-4xl font-bold text-[#1C1B1B]">
            Profile & Settings
          </h1>
          <p className="text-xs text-[#54433A] mt-1">
            Update personal identity details and maintain account security.
          </p>
        </div>

        {/* ── 1. PERSONAL INFORMATION CARD ── */}
        <div className="bg-[#FFFFFF] p-8 sm:p-10 border border-[#DAC2B6] rounded-md shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-2xl font-bold text-[#1C1B1B] flex items-center">
              <User className="w-5 h-5 mr-2.5 text-[#6C2F00]" />
              Personal Information
            </h3>
            {user?.isVerified && (
              <Badge variant="forest" size="sm">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                Verified Traveler
              </Badge>
            )}
          </div>

          {nameSuccess && (
            <div className="p-3 bg-[#CDEACE]/50 text-xs text-[#2E4632] rounded flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-2 shrink-0" />
              Name updated successfully in sanctuary records.
            </div>
          )}

          {nameError && (
            <div className="p-3 bg-[#FFDAD6]/50 text-xs text-[#BA1A1A] rounded">
              {nameError}
            </div>
          )}

          <form onSubmit={handleUpdateName} className="space-y-5">
            <FormField
              label="Full Name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Vikramaditya Singh"
              helperText="Letters and spaces only (min. 2 characters)"
              required
            />

            {/* Email with 2FA Update Trigger */}
            <div className="pt-2">
              <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#54433A] mb-1">
                Email Address
              </label>
              <div className="flex items-center justify-between p-3 bg-[#F6F3F2] border border-[#E5E2E1] rounded text-xs">
                <span className="font-medium text-[#1C1B1B]">
                  {user?.email}
                </span>
                <button
                  type="button"
                  onClick={() => setIsOtpModalOpen(true)}
                  className="font-semibold text-[#6C2F00] hover:underline"
                >
                  Change Email (OTP)
                </button>
              </div>
              {otpStatus?.tempEmail && (
                <p className="text-[11px] text-[#6C2F00] mt-1.5 flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1" />
                  Pending verification for:{" "}
                  <strong>{otpStatus.tempEmail}</strong>
                </p>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                loading={nameLoading}
              >
                Save Name
              </Button>
            </div>
          </form>
        </div>

        {/* ── 2. SECURITY & PASSWORD CARD ── */}
        <div className="bg-[#FFFFFF] p-8 sm:p-10 border border-[#DAC2B6] rounded-md shadow-xs space-y-6">
          <h3 className="font-serif text-2xl font-bold text-[#1C1B1B] flex items-center">
            <KeyRound className="w-5 h-5 mr-2.5 text-[#6C2F00]" />
            Security & Password
          </h3>

          {passSuccess && (
            <div className="p-3 bg-[#CDEACE]/50 text-xs text-[#2E4632] rounded flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-2 shrink-0" />
              Password updated successfully.
            </div>
          )}

          {passError && (
            <div className="p-3 bg-[#FFDAD6]/50 text-xs text-[#BA1A1A] rounded">
              {passError}
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-5">
            <FormField
              label="Current Password"
              name="currentPassword"
              type="password"
              icon={Lock}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label="New Password"
                name="newPassword"
                type="password"
                icon={Lock}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                helperText="Min. 8 chars (upper, lower, number, special)"
                required
              />

              <FormField
                label="Confirm New Password"
                name="confirmPassword"
                type="password"
                icon={Lock}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                variant="terracotta"
                size="md"
                loading={passLoading}
              >
                Update Password
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* ── EMAIL CHANGE 2FA OTP MODAL ── */}
      {isOtpModalOpen && (
        <Modal
          isOpen={isOtpModalOpen}
          onClose={() => setIsOtpModalOpen(false)}
          title="Update Registered Email"
          subtitle="A 6-digit numeric OTP will be sent to your new email."
        >
          {otpError && (
            <div className="mb-4 p-3 bg-[#FFDAD6]/50 text-xs text-[#BA1A1A] rounded">
              {otpError}
            </div>
          )}

          {otpSuccess && (
            <div className="mb-4 p-3 bg-[#CDEACE]/50 text-xs text-[#2E4632] rounded">
              {otpSuccess}
            </div>
          )}

          <div className="space-y-6">
            {/* Step 1: Request OTP */}
            <form onSubmit={handleRequestEmailOtp} className="space-y-4">
              <FormField
                label="New Email Address"
                name="newEmail"
                type="email"
                icon={Mail}
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="e.g. newemail@example.com"
                required
              />

              <div className="flex items-center justify-between">
                <Button
                  type="submit"
                  variant="outline"
                  size="sm"
                  loading={otpLoading}
                  disabled={cooldown > 0}
                >
                  {cooldown > 0
                    ? `Resend Code (${cooldown}s)`
                    : "Send 6-Digit Code"}
                </Button>

                {otpStatus?.tempEmail && (
                  <button
                    type="button"
                    onClick={handleDiscardEmailChange}
                    className="text-xs text-[#BA1A1A] hover:underline"
                  >
                    Discard Pending Change
                  </button>
                )}
              </div>
            </form>

            {/* Step 2: Verify Code */}
            <form
              onSubmit={handleVerifyOtp}
              className="pt-4 border-t border-[#E5E2E1] space-y-4"
            >
              <FormField
                label="6-Digit Verification Code"
                name="otpCode"
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="123456"
                helperText="Code is valid for 5 minutes"
                required
              />

              <div className="flex justify-end space-x-3 pt-2">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setIsOtpModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="terracotta"
                  size="md"
                  loading={otpLoading}
                >
                  Verify & Update Email
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ProfilePage;
