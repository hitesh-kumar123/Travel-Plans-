import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Avatar,
  Divider,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Link,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import SaveIcon from "@mui/icons-material/Save";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import EmailIcon from "@mui/icons-material/Email";
import api from "../../services/api";
import { loadUser } from "../../redux/actions/authActions";
import { toast } from "react-toastify";

const ProfileView = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { trips } = useSelector((state) => state.trips);

  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [pwForm, setPwForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [profileMsg, setProfileMsg] = useState(null);
  const [pwMsg, setPwMsg] = useState(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPw, setSavingPw] = useState(false);

  // Email change dialog and OTP timer states
  const [isOtpDialogOpen, setIsOtpDialogOpen] = useState(false);
  const [newEmailPending, setNewEmailPending] = useState(null);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpErrorMsg, setOtpErrorMsg] = useState(null);
  const [timeLeft, setTimeLeft] = useState(300);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockedUntil, setBlockedUntil] = useState(null);
  const [hoursLeft, setHoursLeft] = useState(0);
  const inputRefs = useRef([]);

  const totalTrips = trips?.length || 0;
  const completedTrips =
    trips?.filter((t) => t.status === "completed")?.length || 0;
  const plannedTrips =
    trips?.filter((t) => t.status === "planned")?.length || 0;

  // Sync profile fields on user state load or change
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  // Check active pending email changes from database on mount
  useEffect(() => {
    const checkPendingEmailChange = async () => {
      try {
        const res = await api.get("/auth/email-change-status");
        if (res.data.tempEmail) {
          setNewEmailPending(res.data.tempEmail);
          setTimeLeft(res.data.timeLeft);
          setIsTimerActive(res.data.timeLeft > 0);
          setResendCooldown(res.data.resendCooldown);
          if (res.data.isBlocked) {
            setIsBlocked(true);
            setBlockedUntil(res.data.blockedUntil);
            setHoursLeft(res.data.hoursLeft);
          }
        }
      } catch (err) {
        console.error("Failed to check active email change:", err);
      }
    };
    checkPendingEmailChange();
  }, []);

  // Sync timers from database
  const syncEmailChangeTimers = async () => {
    try {
      const res = await api.get("/auth/email-change-status");
      if (res.data.tempEmail) {
        setTimeLeft(res.data.timeLeft);
        setIsTimerActive(res.data.timeLeft > 0);
        setResendCooldown(res.data.resendCooldown);
        if (res.data.isBlocked) {
          setIsBlocked(true);
          setBlockedUntil(res.data.blockedUntil);
          setHoursLeft(res.data.hoursLeft);
        } else {
          setIsBlocked(false);
          setBlockedUntil(null);
        }
      }
    } catch (err) {
      console.error("Failed to sync email change timers:", err);
    }
  };

  // Expiration countdown
  useEffect(() => {
    if (!newEmailPending) return;
    if (timeLeft <= 0) {
      setIsTimerActive(false);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, newEmailPending]);

  // Cooldown countdown
  useEffect(() => {
    if (!newEmailPending || resendCooldown <= 0) return;
    const timer = setTimeout(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown, newEmailPending]);

  // Lockout countdown checker
  useEffect(() => {
    if (!newEmailPending || !blockedUntil) return;
    const checkLockout = () => {
      const now = Date.now();
      const blockEnd = new Date(blockedUntil).getTime();
      if (blockEnd > now) {
        setIsBlocked(true);
        const remainingTime = blockEnd - now;
        const remainingHours = Math.ceil(remainingTime / (1000 * 60 * 60));
        setHoursLeft(remainingHours);
      } else {
        setIsBlocked(false);
        setBlockedUntil(null);
      }
    };

    checkLockout();
    const interval = setInterval(checkLockout, 10000);
    return () => clearInterval(interval);
  }, [blockedUntil, newEmailPending]);

  // Shifting focus grid handlers
  const handleOtpChange = (index, value) => {
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(pastedData)) {
      toast.error("Please paste a 6-digit numeric code");
      return;
    }

    const digits = pastedData.split("");
    setOtp(digits);
    inputRefs.current[5]?.focus();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Submit Handler for Email Save / Change request
  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg(null);

    const isEmailChanged =
      profileForm.email.toLowerCase() !== user.email.toLowerCase();

    try {
      if (isEmailChanged) {
        // Request secure verification
        const res = await api.post("/auth/request-email-change", {
          email: profileForm.email,
        });

        setNewEmailPending(profileForm.email);
        setOtp(["", "", "", "", "", ""]);
        setOtpErrorMsg(null);
        setIsOtpDialogOpen(true);

        await syncEmailChangeTimers();

        toast.success(
          res.data.msg || "Verification code sent to your new email.",
        );
      } else {
        // Simple name change update
        await api.put("/auth/profile", { name: profileForm.name });
        dispatch(loadUser());
        setProfileMsg({
          type: "success",
          text: "Profile updated successfully!",
        });
      }
    } catch (err) {
      const msg = err.response?.data?.msg || "Failed to update profile";
      setProfileMsg({
        type: "error",
        text: msg,
      });

      const data = err.response?.data;
      if (data?.blocked) {
        setIsBlocked(true);
        setBlockedUntil(data.blockedUntil);
      }
    } finally {
      setSavingProfile(false);
      if (!isEmailChanged) {
        setTimeout(() => setProfileMsg(null), 3000);
      }
    }
  };

  // Submit Dialog OTP verification
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setOtpErrorMsg(null);

    const otpCode = otp.join("");
    if (otpCode.length < 6) {
      setOtpErrorMsg("Please enter the complete 6-digit code.");
      return;
    }

    if (timeLeft <= 0) {
      setOtpErrorMsg(
        "Verification code has expired. Please request a new one.",
      );
      return;
    }

    setIsVerifyingOtp(true);
    try {
      await api.post("/auth/verify-email-change", { otpCode });

      // Save name as well if changed
      if (profileForm.name !== user.name) {
        await api.put("/auth/profile", { name: profileForm.name });
      }

      dispatch(loadUser());
      toast.success("Profile and email updated successfully!");
      setNewEmailPending(null);
      setIsOtpDialogOpen(false);
    } catch (err) {
      setOtpErrorMsg(
        err.response?.data?.msg || "Invalid code. Please try again.",
      );
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Resend OTP inside Dialog
  const handleResendOtp = async () => {
    if (isBlocked) {
      toast.error(
        `You are locked out due to too many attempts. Please try again in ${hoursLeft} hours.`,
      );
      return;
    }
    if (resendCooldown > 0) return;

    setOtpErrorMsg(null);
    try {
      const res = await api.post("/auth/request-email-change", {
        email: newEmailPending,
      });
      toast.success(res.data.msg || "Verification code resent successfully!");

      setResendCooldown(60);
      setOtp(["", "", "", "", "", ""]);
      setTimeLeft(300);
      setIsTimerActive(true);
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    } catch (err) {
      const data = err.response?.data;
      setOtpErrorMsg(data?.msg || "Failed to resend code");

      if (data?.blocked) {
        setIsBlocked(true);
        setBlockedUntil(data.blockedUntil);
      }
    }
  };

  // Discard email change request
  const handleDiscardEmailChange = async () => {
    try {
      await api.post("/auth/verify-email-change", { discard: true });
      toast.info("Email change request discarded.");
      setNewEmailPending(null);
      setProfileForm({ ...profileForm, email: user?.email || "" });
      setIsOtpDialogOpen(false);
    } catch (err) {
      toast.error("Failed to discard email change request.");
    }
  };

  const handleCloseDialog = () => {
    setIsOtpDialogOpen(false);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwMsg({ type: "error", text: "New passwords don't match!" });
      return;
    }
    if (pwForm.newPassword.length < 6) {
      setPwMsg({
        type: "error",
        text: "Password must be at least 6 characters",
      });
      return;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(pwForm.newPassword)) {
      setPwMsg({
        type: "error",
        text: "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
      });
      return;
    }
    setSavingPw(true);
    try {
      await api.put("/auth/change-password", {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setPwMsg({ type: "success", text: "Password changed successfully!" });
    } catch (err) {
      setPwMsg({
        type: "error",
        text: err.response?.data?.msg || "Failed to change password",
      });
    } finally {
      setSavingPw(false);
      setTimeout(() => setPwMsg(null), 3000);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={700} mb={0.5}>
        My Profile
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Manage your account settings
      </Typography>

      <Grid container spacing={3}>
        {/* Left: Avatar + Stats */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              textAlign: "center",
            }}
          >
            <Avatar
              sx={{
                width: 100,
                height: 100,
                mx: "auto",
                mb: 2,
                background: "linear-gradient(135deg, #1976D2 0%, #00BCD4 100%)",
                fontSize: 36,
                fontWeight: 700,
              }}
            >
              {user?.name?.[0]?.toUpperCase() || "U"}
            </Avatar>
            <Typography variant="h6" fontWeight={700}>
              {user?.name || "Traveler"}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              mb={user?.isVerified ? 1 : 2}
            >
              {user?.email}
            </Typography>

            {user?.isVerified ? (
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.5,
                  bgcolor: "rgba(72, 187, 120, 0.1)",
                  color: "#2f855a",
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 2,
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  mb: 3,
                }}
              >
                <CheckCircleIcon sx={{ fontSize: 14 }} />
                Email Verified
              </Box>
            ) : (
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.5,
                  bgcolor: "rgba(237, 137, 54, 0.1)",
                  color: "#c05621",
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 2,
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  mb: 3,
                }}
              >
                <WarningIcon sx={{ fontSize: 14 }} />
                Unverified Account
              </Box>
            )}

            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2} textAlign="center">
              <Grid item xs={4}>
                <Typography variant="h5" fontWeight={800} color="primary.main">
                  {totalTrips}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Total Trips
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="h5" fontWeight={800} color="success.main">
                  {completedTrips}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Completed
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="h5" fontWeight={800} color="info.main">
                  {plannedTrips}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Planned
                </Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />
            <Box sx={{ p: 2, bgcolor: "primary.light", borderRadius: 2 }}>
              <Typography variant="body2" color="primary.dark" fontWeight={600}>
                🌍 Keep exploring! Your next adventure awaits.
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Right: Edit Forms */}
        <Grid item xs={12} md={8}>
          {/* Profile Info */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              mb: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
              <PersonIcon color="primary" />
              <Typography variant="h6" fontWeight={700}>
                Personal Information
              </Typography>
            </Box>

            {newEmailPending && (
              <Alert
                severity="info"
                sx={{ mb: 3, borderRadius: 2 }}
                action={
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      color="primary"
                      size="small"
                      variant="contained"
                      onClick={() => {
                        setOtp(["", "", "", "", "", ""]);
                        setOtpErrorMsg(null);
                        setIsOtpDialogOpen(true);
                        syncEmailChangeTimers();
                      }}
                      sx={{ textTransform: "none", borderRadius: 2 }}
                    >
                      Enter Code
                    </Button>
                    <Button
                      color="inherit"
                      size="small"
                      onClick={handleDiscardEmailChange}
                      sx={{ textTransform: "none" }}
                    >
                      Discard
                    </Button>
                  </Box>
                }
              >
                You have a pending email change to{" "}
                <strong>{newEmailPending}</strong>.
              </Alert>
            )}

            {profileMsg && (
              <Alert
                severity={profileMsg.type}
                sx={{ mb: 2 }}
                onClose={() => setProfileMsg(null)}
              >
                {profileMsg.text}
              </Alert>
            )}

            <Box component="form" onSubmit={handleProfileSave}>
              <Grid container spacing={2.5}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={profileForm.name}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, name: e.target.value })
                    }
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    disabled={true}
                    value={profileForm.email}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, email: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={
                      savingProfile ? (
                        <CircularProgress size={16} color="inherit" />
                      ) : (
                        <SaveIcon />
                      )
                    }
                    disabled={savingProfile}
                    sx={{ px: 4, borderRadius: 3 }}
                  >
                    {savingProfile ? "Saving..." : "Save Changes"}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>

          {/* Change Password */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
              <LockIcon color="warning" />
              <Typography variant="h6" fontWeight={700}>
                Change Password
              </Typography>
            </Box>

            {pwMsg && (
              <Alert
                severity={pwMsg.type}
                sx={{ mb: 2 }}
                onClose={() => setPwMsg(null)}
              >
                {pwMsg.text}
              </Alert>
            )}

            <Box component="form" onSubmit={handlePasswordChange}>
              <Grid container spacing={2.5}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Current Password"
                    type="password"
                    value={pwForm.currentPassword}
                    onChange={(e) =>
                      setPwForm({ ...pwForm, currentPassword: e.target.value })
                    }
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="New Password"
                    type="password"
                    value={pwForm.newPassword}
                    onChange={(e) =>
                      setPwForm({ ...pwForm, newPassword: e.target.value })
                    }
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Confirm New Password"
                    type="password"
                    value={pwForm.confirmPassword}
                    onChange={(e) =>
                      setPwForm({ ...pwForm, confirmPassword: e.target.value })
                    }
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="outlined"
                    color="warning"
                    startIcon={
                      savingPw ? (
                        <CircularProgress size={16} color="inherit" />
                      ) : (
                        <LockIcon />
                      )
                    }
                    disabled={savingPw}
                    sx={{ px: 4, borderRadius: 3 }}
                  >
                    {savingPw ? "Changing..." : "Change Password"}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Email Change Verification Dialog */}
      <Dialog
        open={isOtpDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "24px",
            p: 3,
            boxShadow: "0px 10px 30px rgba(0,0,0,0.1)",
          },
        }}
      >
        <DialogTitle sx={{ textAlign: "center", pb: 1 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              bgcolor: "rgba(25, 118, 210, 0.08)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mx: "auto",
              mb: 2,
            }}
          >
            <EmailIcon color="primary" sx={{ fontSize: 28 }} />
          </Box>
          <Typography variant="h5" fontWeight={800} color="#1a202c">
            Verify Email Change
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center", pb: 2 }}>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Enter the 6-digit verification code sent to{" "}
            <strong style={{ color: "#1976D2" }}>{newEmailPending}</strong>
          </Typography>

          {otpErrorMsg && (
            <Alert
              severity="error"
              sx={{ mb: 3, borderRadius: 2, textAlign: "left" }}
            >
              {otpErrorMsg}
            </Alert>
          )}

          {/* OTP Input Grid */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: 1,
              mb: 3,
            }}
          >
            {otp.map((digit, idx) => (
              <Box
                key={idx}
                component="input"
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                placeholder="-"
                ref={(el) => (inputRefs.current[idx] = el)}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                onPaste={idx === 0 ? handleOtpPaste : undefined}
                disabled={isVerifyingOtp}
                sx={{
                  width: "100%",
                  maxWidth: "42px",
                  height: "48px",
                  textAlign: "center",
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: "#1a202c",
                  border: "1.5px solid rgba(113, 128, 150, 0.15)",
                  borderRadius: "10px",
                  outline: "none",
                  backgroundColor: "transparent",
                  transition: "all 0.2s",
                  "&::placeholder": {
                    color: "rgba(113, 128, 150, 0.4)",
                  },
                  "&:focus": {
                    borderColor: "#1976D2",
                    borderWidth: "2px",
                    boxShadow: "0px 0px 0px 3px rgba(25, 118, 210, 0.12)",
                  },
                }}
              />
            ))}
          </Box>

          {/* Expiration Timer */}
          <Box sx={{ mb: 2 }}>
            {isTimerActive ? (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ display: "inline-flex", gap: 0.5 }}
              >
                Code expires in{" "}
                <strong style={{ color: "#1976D2" }}>
                  {formatTime(timeLeft)}
                </strong>
              </Typography>
            ) : (
              <Typography variant="body2" color="error" fontWeight={600}>
                Code has expired.
              </Typography>
            )}
          </Box>

          {/* Cooldown/Lockout Block */}
          <Box>
            {isBlocked ? (
              <Box
                sx={{
                  p: 1.5,
                  bgcolor: "rgba(211, 47, 47, 0.05)",
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="caption"
                  color="error"
                  fontWeight={600}
                  display="block"
                >
                  ⚠️ Locked out due to too many attempts.
                </Typography>
                <Typography variant="caption" color="error" display="block">
                  Retry in {hoursLeft} hours.
                </Typography>
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Didn't receive the code?{" "}
                {resendCooldown > 0 ? (
                  <span style={{ color: "#1976D2", fontWeight: 600 }}>
                    Resend Code ({resendCooldown}s)
                  </span>
                ) : (
                  <Link
                    component="button"
                    type="button"
                    onClick={handleResendOtp}
                    variant="body2"
                    underline="hover"
                    sx={{
                      fontWeight: 700,
                      color: "#1976D2",
                      cursor: "pointer",
                      border: "none",
                      background: "none",
                      p: 0,
                    }}
                  >
                    Resend Code
                  </Link>
                )}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
          <Button
            onClick={handleDiscardEmailChange}
            color="error"
            size="small"
            sx={{ fontWeight: 600, textTransform: "none" }}
          >
            Discard Request
          </Button>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              onClick={handleCloseDialog}
              variant="outlined"
              color="inherit"
              size="small"
              sx={{
                borderRadius: "8px",
                fontWeight: 600,
                textTransform: "none",
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleOtpSubmit}
              variant="contained"
              color="primary"
              size="small"
              disabled={isVerifyingOtp || !isTimerActive}
              sx={{
                borderRadius: "8px",
                fontWeight: 600,
                textTransform: "none",
              }}
            >
              {isVerifyingOtp ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                "Verify & Save"
              )}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfileView;
