import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Link,
  InputAdornment,
  IconButton,
  useTheme,
  useMediaQuery,
  Divider,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockResetIcon from "@mui/icons-material/LockReset";
import api from "../services/api";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [step, setStep] = useState("request");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/forgot-password/request-otp", { email });
      toast.success("OTP sent to your email");
      setStep("verify");
    } catch (error) {
      const msg =
        error.response?.data?.msg || "Failed to send password reset OTP";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/forgot-password/verify-otp", {
        email,
        otp,
        newPassword,
      });
      toast.success("Password reset successfully");
      setStep("done");
    } catch (error) {
      const msg =
        error.response?.data?.msg || "Failed to reset password with OTP";
      toast.error(msg);
    } finally {
      setLoading(false);
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
      {!isMobile && (
        <Box
          sx={{
            flex: 1,
            backgroundImage:
              "url(https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1887&auto=format&fit=crop)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(0, 0, 0, 0.45)",
              backdropFilter: "blur(2px)",
            }}
          />
          <Box sx={{ position: "relative", p: 6, color: "white" }}>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
              Reset your password
            </Typography>
            <Typography variant="h5" sx={{ maxWidth: "80%" }}>
              Secure access with OTP verification
            </Typography>
          </Box>
        </Box>
      )}

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          p: 4,
        }}
      >
        <Box sx={{ maxWidth: 480, width: "100%" }}>
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
              Forgot Password
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {step === "request"
                ? "We will email you a one-time code"
                : step === "verify"
                  ? "Enter the OTP and your new password"
                  : "You can now sign in with your new password"}
            </Typography>
          </Box>

          <Paper
            elevation={isMobile ? 1 : 0}
            sx={{
              p: 4,
              borderRadius: 4,
              border: !isMobile ? "1px solid" : "none",
              borderColor: "divider",
            }}
          >
            {step === "request" && (
              <form onSubmit={handleRequestOtp}>
                <TextField
                  fullWidth
                  required
                  type="email"
                  label="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlinedIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 3 }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={!email || loading}
                  startIcon={<LockResetIcon />}
                >
                  {loading ? "Sending OTP..." : "Send OTP"}
                </Button>
              </form>
            )}

            {step === "verify" && (
              <form onSubmit={handleResetPassword}>
                <TextField
                  fullWidth
                  required
                  label="OTP Code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  inputProps={{ maxLength: 6 }}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  required
                  label="New Password"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword((prev) => !prev)}
                          edge="end"
                        >
                          {showPassword ? (
                            <VisibilityOffIcon />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  required
                  label="Confirm Password"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  sx={{ mb: 3 }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={!otp || !newPassword || !confirmPassword || loading}
                  startIcon={<LockResetIcon />}
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </Button>

                <Divider sx={{ my: 3 }} />

                <Button
                  variant="text"
                  fullWidth
                  onClick={async () => {
                    setLoading(true);
                    try {
                      await api.post("/auth/forgot-password/request-otp", {
                        email,
                      });
                      toast.success("OTP resent");
                    } catch (error) {
                      const msg =
                        error.response?.data?.msg || "Failed to resend OTP";
                      toast.error(msg);
                    } finally {
                      setLoading(false);
                    }
                  }}
                >
                  Resend OTP
                </Button>
              </form>
            )}

            {step === "done" && (
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Password updated
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  You can sign in with your new password now.
                </Typography>
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="contained"
                  fullWidth
                >
                  Back to Sign In
                </Button>
              </Box>
            )}
          </Paper>

          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Typography variant="body2">
              Remember your password?{" "}
              <Link
                component={RouterLink}
                to="/login"
                variant="subtitle2"
                sx={{ fontWeight: 600 }}
              >
                Sign in
              </Link>
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mt: "auto", textAlign: "center", pt: 4 }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} PackGo. All rights reserved.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ForgotPassword;
