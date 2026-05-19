import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { verifyOtp } from "../redux/actions/authActions";
import api from "../services/api";
import {
  Box,
  Button,
  Typography,
  Paper,
  Link,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import { toast } from "react-toastify";

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Retrieve email and block status from navigation state or fallback
  const email = location.state?.email || localStorage.getItem("otpEmail") || "";
  const initialBlocked = location.state?.blocked || false;
  const initialBlockedUntil = location.state?.blockedUntil || null;

  // OTP Input State (6 digits)
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  // States
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoadingOtpStatus, setIsLoadingOtpStatus] = useState(true);

  // Timer State (5 minutes = 300 seconds)
  const [timeLeft, setTimeLeft] = useState(300);
  const [isTimerActive, setIsTimerActive] = useState(true);

  // Resend Cooldown and Blockout State
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isBlocked, setIsBlocked] = useState(initialBlocked);
  const [blockedUntil, setBlockedUntil] = useState(initialBlockedUntil);
  const [hoursLeft, setHoursLeft] = useState(0);

  // Save email to localStorage for refresh and multi-tab persistence
  useEffect(() => {
    if (location.state?.email) {
      localStorage.setItem("otpEmail", location.state.email);
    }
  }, [location.state?.email]);

  // Fetch real OTP status (remaining time, cooldown, lockout details) from DB on mount
  useEffect(() => {
    if (!email) return;

    const fetchOtpStatus = async () => {
      try {
        const res = await api.post("/auth/otp-status", { email });

        // If user is already verified, redirect them directly to dashboard
        if (res.data.isVerified) {
          navigate("/dashboard");
          return;
        }

        const {
          timeLeft: serverTimeLeft,
          resendCooldown: serverCooldown,
          isBlocked: serverBlocked,
          blockedUntil: serverBlockedUntil,
          hoursLeft: serverHours,
        } = res.data;

        // Sync OTP expiration timer
        if (serverTimeLeft > 0) {
          setTimeLeft(serverTimeLeft);
          setIsTimerActive(true);
        } else {
          setTimeLeft(0);
          setIsTimerActive(false);
        }

        // Sync resend cooldown
        if (serverCooldown > 0) {
          setResendCooldown(serverCooldown);
        } else {
          setResendCooldown(0);
        }

        // Sync lockout details
        if (serverBlocked) {
          setIsBlocked(true);
          setBlockedUntil(serverBlockedUntil);
          setHoursLeft(serverHours);
        } else {
          setIsBlocked(false);
          setBlockedUntil(null);
          setHoursLeft(0);
        }
      } catch (err) {
        console.error("Failed to fetch OTP status:", err);
      } finally {
        setIsLoadingOtpStatus(false);
      }
    };

    fetchOtpStatus();
  }, [email, navigate]);

  // Auto-focus first input on load
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Redirect if no email is provided (edge case)
  useEffect(() => {
    if (!email) {
      toast.error("Invalid session. Redirecting to Register.");
      navigate("/register");
    }
  }, [email, navigate]);

  // Countdown timer for OTP expiry
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsTimerActive(false);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  // Lockout / Cooldown check
  useEffect(() => {
    const checkLockout = () => {
      if (blockedUntil) {
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
      }
    };

    checkLockout();
    const interval = setInterval(checkLockout, 10000); // Check every 10s
    return () => clearInterval(interval);
  }, [blockedUntil]);

  // Cooldown countdown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // Format seconds to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Focus navigation handling
  const handleChange = (index, value) => {
    // Only accept digits
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // If entered a digit, move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Backspace handling
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // Input is empty, focus previous
        inputRefs.current[index - 1].focus();
      } else {
        // Clear current input
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  // Paste handling for convenience
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(pastedData)) {
      toast.error("Please paste a 6-digit numeric code");
      return;
    }

    const digits = pastedData.split("");
    setOtp(digits);
    inputRefs.current[5].focus();
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    const otpCode = otp.join("");
    if (otpCode.length < 6) {
      setErrorMsg("Please enter the complete 6-digit code.");
      return;
    }

    if (timeLeft <= 0) {
      setErrorMsg("Verification code has expired. Please request a new one.");
      return;
    }

    setIsVerifying(true);
    try {
      await dispatch(verifyOtp(email, otpCode, navigate));
    } catch (err) {
      const msg = err.response?.data?.msg || "Invalid code. Please try again.";
      setErrorMsg(msg);
    } finally {
      setIsVerifying(false);
    }
  };

  // Resend Handler
  const handleResend = async () => {
    if (isBlocked) {
      toast.error(
        `You are locked out due to too many attempts. Please try again in ${hoursLeft} hours.`,
      );
      return;
    }
    if (resendCooldown > 0) return;

    setErrorMsg(null);
    try {
      const res = await api.post("/auth/resend-otp", { email });
      toast.success(res.data.msg || "Verification code resent successfully!");

      // Start cooldown timer (60 seconds)
      setResendCooldown(60);

      // Reset OTP inputs and expiry timer
      setOtp(["", "", "", "", "", ""]);
      setTimeLeft(300);
      setIsTimerActive(true);
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    } catch (err) {
      const data = err.response?.data;
      const msg = data?.msg || "Failed to resend code";
      setErrorMsg(msg);

      if (data?.blocked) {
        setIsBlocked(true);
        setBlockedUntil(data.blockedUntil);
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        backgroundColor: theme.palette.background.default,
      }}
    >
      {/* Left Column (Desktop City Scenery) */}
      {!isMobile && (
        <Box
          sx={{
            flex: 1,
            backgroundImage:
              "url(https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2070&auto=format&fit=crop)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          {/* Custom Overlay */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              background:
                "linear-gradient(to top, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.2) 100%)",
              backdropFilter: "blur(1px)",
            }}
          />
          {/* Overlay Text Content */}
          <Box
            sx={{
              position: "relative",
              p: 6,
              color: "white",
              zIndex: 2,
            }}
          >
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 1.5 }}>
              Almost there!
            </Typography>
            <Typography
              variant="h6"
              sx={{ fontWeight: 400, mb: 4, opacity: 0.9, maxWidth: "85%" }}
            >
              We've sent a 6-digit code to your email{" "}
              <strong style={{ textDecoration: "underline" }}>{email}</strong>
            </Typography>

            {/* Custom Pagination Indicator Dots */}
            <Box sx={{ display: "flex", gap: 1.5, mb: 2 }}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  bgcolor: "rgba(255, 255, 255, 0.4)",
                  borderRadius: "50%",
                }}
              />
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  bgcolor: "white", // Active dot representing intermediate step
                  borderRadius: "50%",
                  boxShadow: "0 0 8px white",
                }}
              />
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  bgcolor: "rgba(255, 255, 255, 0.4)",
                  borderRadius: "50%",
                }}
              />
            </Box>
          </Box>
        </Box>
      )}

      {/* Right Column (Verification Card Center) */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          p: 3,
        }}
      >
        <Box
          sx={{
            maxWidth: 480,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Verification Card */}
          <Paper
            elevation={4}
            sx={{
              p: { xs: 4, sm: 5 },
              borderRadius: "32px",
              width: "100%",
              textAlign: "center",
              position: "relative",
              border: "1px solid rgba(0, 0, 0, 0.03)",
              boxShadow: "0px 15px 40px rgba(0, 0, 0, 0.04)",
            }}
          >
            {/* Top Envelope Badge */}
            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                bgcolor: "rgba(63, 81, 181, 0.08)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mx: "auto",
                mb: 3,
                position: "relative",
              }}
            >
              <EmailOutlinedIcon
                sx={{ fontSize: 32, color: theme.palette.primary.main }}
              />
              {/* Shield Icon Overlay */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: 12,
                  right: 12,
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  bgcolor: "white",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.15)",
                }}
              >
                <ShieldOutlinedIcon
                  sx={{
                    fontSize: 13,
                    color: theme.palette.primary.main,
                    fontWeight: "bold",
                  }}
                />
              </Box>
            </Box>

            {/* Typography Header */}
            <Typography
              variant="h5"
              sx={{ fontWeight: 800, mb: 1, color: "#1a202c" }}
            >
              Verify Your Email
            </Typography>

            {/* Subtitle */}
            <Typography variant="body2" sx={{ color: "#718096", mb: 4, px: 2 }}>
              Enter the 6-digit code sent to{" "}
              <span
                style={{ color: theme.palette.primary.main, fontWeight: 700 }}
              >
                {email}
              </span>
            </Typography>

            {/* Inline Alert Messages */}
            {errorMsg && (
              <Alert
                severity="error"
                sx={{ mb: 3, borderRadius: 2, textAlign: "left" }}
              >
                {errorMsg}
              </Alert>
            )}

            {/* OTP Form */}
            <form onSubmit={handleSubmit}>
              {/* OTP Squares Input Grid */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 1,
                  mb: 4,
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
                    onChange={(e) => handleChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    onPaste={idx === 0 ? handlePaste : undefined}
                    disabled={isVerifying}
                    sx={{
                      width: "100%",
                      maxWidth: "52px",
                      height: "56px",
                      textAlign: "center",
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      color: "#1a202c",
                      border: "1.5px solid rgba(113, 128, 150, 0.15)",
                      borderRadius: "12px",
                      outline: "none",
                      backgroundColor: "transparent",
                      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&::placeholder": {
                        color: "rgba(113, 128, 150, 0.4)",
                      },
                      "&:focus": {
                        borderColor: theme.palette.primary.main,
                        borderWidth: "2px",
                        boxShadow: `0px 0px 0px 4px rgba(63, 81, 181, 0.15)`,
                      },
                    }}
                  />
                ))}
              </Box>

              {/* Expiry Timer */}
              <Box
                sx={{
                  mb: 3,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "20px",
                }}
              >
                {isLoadingOtpStatus ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CircularProgress
                      size={14}
                      thickness={5}
                      sx={{ color: theme.palette.primary.main }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ color: "#718096", fontSize: "0.85rem" }}
                    >
                      Syncing session...
                    </Typography>
                  </Box>
                ) : isTimerActive ? (
                  <Typography
                    variant="body2"
                    sx={{ color: "#718096", display: "inline-flex", gap: 0.5 }}
                  >
                    Code expires in{" "}
                    <strong style={{ color: theme.palette.primary.main }}>
                      {formatTime(timeLeft)}
                    </strong>
                  </Typography>
                ) : (
                  <Typography
                    variant="body2"
                    sx={{ color: "error.main", fontWeight: 600 }}
                  >
                    Code has expired.
                  </Typography>
                )}
              </Box>

              {/* Resend Link and Warnings */}
              <Box sx={{ mb: 4 }}>
                {isBlocked ? (
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: "error.light",
                      borderRadius: 3,
                      opacity: 0.9,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: "error.dark",
                        fontWeight: 600,
                        display: "block",
                      }}
                    >
                      ⚠️ Too many resend attempts.
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "error.dark", display: "block", mt: 0.5 }}
                    >
                      You are blocked from requesting codes. Please retry in{" "}
                      {hoursLeft} hours.
                    </Typography>
                  </Box>
                ) : (
                  <Typography variant="body2" sx={{ color: "#718096" }}>
                    Didn't receive the code?{" "}
                    {resendCooldown > 0 ? (
                      <span
                        style={{
                          color: theme.palette.primary.main,
                          fontWeight: 600,
                        }}
                      >
                        Resend Code ({resendCooldown}s)
                      </span>
                    ) : (
                      <Link
                        component="button"
                        type="button"
                        onClick={handleResend}
                        variant="body2"
                        underline="hover"
                        sx={{
                          fontWeight: 700,
                          color: theme.palette.primary.main,
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

              {/* Navigation Action Buttons */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {/* Back Button */}
                <Button
                  onClick={() => navigate(-1)}
                  startIcon={<ArrowBackIcon />}
                  sx={{
                    color: "#718096",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    "&:hover": {
                      bgcolor: "rgba(0, 0, 0, 0.02)",
                    },
                  }}
                >
                  Back
                </Button>

                {/* Verify OTP Button */}
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isVerifying || !isTimerActive}
                  endIcon={!isVerifying && <ArrowForwardIcon />}
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    color: "white",
                    fontWeight: 600,
                    borderRadius: "12px",
                    px: 3,
                    py: 1.25,
                    boxShadow: "0px 6px 16px rgba(63, 81, 181, 0.25)",
                    "&:hover": {
                      bgcolor: theme.palette.primary.dark,
                      boxShadow: "0px 8px 20px rgba(63, 81, 181, 0.35)",
                    },
                    textTransform: "none",
                  }}
                >
                  {isVerifying ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    "Verify OTP"
                  )}
                </Button>
              </Box>
            </form>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default VerifyOtp;
