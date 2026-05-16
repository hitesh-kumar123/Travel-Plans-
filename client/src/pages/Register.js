import React, { useState, useEffect } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  requestRegisterOtp,
  verifyRegisterOtp,
  googleLogin,
} from "../redux/actions/authActions";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
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
  Stepper,
  Step,
  StepLabel,
  Grid,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CheckCircleOutlineIcon from "@mui/icons-material/TaskAlt";
import ArrowForwardIcon from "@mui/icons-material/East";
import ArrowBackIcon from "@mui/icons-material/West";
import FacebookIcon from "@mui/icons-material/Facebook";
import HowToRegIcon from "@mui/icons-material/HowToReg";

const Register = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [otp, setOtp] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const steps = [
    "Personal Information",
    "Account Setup",
    "Email Verification",
  ];

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    const newValue = name === "agreeTerms" ? checked : value;

    setFormData({
      ...formData,
      [name]: newValue,
    });

    // Password match validation
    if (
      name === "confirmPassword" ||
      (name === "password" && formData.confirmPassword)
    ) {
      if (name === "password" && value !== formData.confirmPassword) {
        setPasswordError("Passwords do not match");
      } else if (name === "confirmPassword" && value !== formData.password) {
        setPasswordError("Passwords do not match");
      } else {
        setPasswordError("");
      }
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (activeStep === 1) {
      setSendingOtp(true);
      try {
        const payload = {
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          password: formData.password,
        };
        await dispatch(requestRegisterOtp(payload));
        toast.success("OTP sent to your email");
        handleNext();
      } catch (error) {
        const msg =
          error.response?.data?.msg || "Failed to send registration OTP";
        toast.error(msg);
      } finally {
        setSendingOtp(false);
      }
      return;
    }

    if (activeStep === steps.length - 1) {
      setVerifyingOtp(true);
      try {
        await dispatch(
          verifyRegisterOtp({ email: formData.email, otp: otp.trim() }),
        );
      } finally {
        setVerifyingOtp(false);
      }
      return;
    }

    handleNext();
  };

  const isNextDisabled = () => {
    if (activeStep === 0) {
      return !formData.firstName || !formData.lastName;
    } else if (activeStep === 1) {
      return (
        !formData.email ||
        !formData.password ||
        !formData.confirmPassword ||
        passwordError ||
        !formData.agreeTerms
      );
    } else if (activeStep === 2) {
      return otp.trim().length < 6;
    }
    return false;
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Let's get to know you
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </>
        );
      case 1:
        return (
          <>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Create your account
            </Typography>
            <TextField
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={toggleShowPassword}
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
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type={showPassword ? "text" : "password"}
              id="confirmPassword"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!passwordError}
              helperText={passwordError}
              sx={{ mb: 2 }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  name="agreeTerms"
                  color="primary"
                  required
                />
              }
              label={
                <Typography variant="body2">
                  I agree to the{" "}
                  <Link
                    component={RouterLink}
                    to="/terms"
                    variant="body2"
                    sx={{ fontWeight: 600 }}
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    component={RouterLink}
                    to="/privacy"
                    variant="body2"
                    sx={{ fontWeight: 600 }}
                  >
                    Privacy Policy
                  </Link>
                </Typography>
              }
            />
          </>
        );
      case 2:
        return (
          <Box sx={{ py: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <CheckCircleOutlineIcon color="success" />
              <Typography variant="h6">Verify your email</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Enter the 6-digit OTP sent to {formData.email} to activate your
              account.
            </Typography>
            <TextField
              fullWidth
              label="OTP Code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              inputProps={{ maxLength: 6 }}
              sx={{ mb: 2 }}
            />
            <Button
              variant="text"
              onClick={async () => {
                setSendingOtp(true);
                try {
                  const payload = {
                    name: `${formData.firstName} ${formData.lastName}`.trim(),
                    email: formData.email,
                    password: formData.password,
                  };
                  await dispatch(requestRegisterOtp(payload));
                  toast.success("OTP resent");
                } catch (error) {
                  const msg =
                    error.response?.data?.msg || "Failed to resend OTP";
                  toast.error(msg);
                } finally {
                  setSendingOtp(false);
                }
              }}
              disabled={sendingOtp}
            >
              Resend OTP
            </Button>
          </Box>
        );
      default:
        return "Unknown step";
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
      {/* Left side with image - shown only on desktop */}
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
          <Box
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              backdropFilter: "blur(2px)",
            }}
          />
          <Box
            sx={{
              position: "relative",
              p: 6,
              color: "white",
            }}
          >
            <Typography
              variant="h3"
              component="h1"
              sx={{ fontWeight: 700, mb: 2 }}
            >
              Join PackGo
            </Typography>
            <Typography variant="h5" sx={{ mb: 4, maxWidth: "80%" }}>
              Create an account to start planning your next adventure
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mb: 4 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  bgcolor: "white",
                  borderRadius: "50%",
                }}
              />
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  bgcolor: "rgba(255, 255, 255, 0.5)",
                  borderRadius: "50%",
                }}
              />
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  bgcolor: "rgba(255, 255, 255, 0.5)",
                  borderRadius: "50%",
                }}
              />
            </Box>
          </Box>
        </Box>
      )}

      {/* Right side with register form */}
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
        <Box
          sx={{
            maxWidth: 480,
            width: "100%",
          }}
        >
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
              Create Account
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Get started with your free account
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
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <form onSubmit={handleSubmit}>
              <Box sx={{ mb: 4 }}>{getStepContent(activeStep)}</Box>

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  startIcon={<ArrowBackIcon />}
                  sx={{ visibility: activeStep === 0 ? "hidden" : "visible" }}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isNextDisabled() || sendingOtp || verifyingOtp}
                  endIcon={
                    activeStep === steps.length - 1 ? (
                      <HowToRegIcon />
                    ) : (
                      <ArrowForwardIcon />
                    )
                  }
                >
                  {activeStep === steps.length - 1
                    ? verifyingOtp
                      ? "Verifying..."
                      : "Verify & Create"
                    : sendingOtp
                      ? "Sending..."
                      : "Next"}
                </Button>
              </Box>

              {activeStep === 0 && (
                <>
                  <Divider sx={{ my: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      OR
                    </Typography>
                  </Divider>

                  <Box
                    sx={{ display: "flex", justifyContent: "center", gap: 2 }}
                  >
                    <Box sx={{ flexGrow: 1 }}>
                      <GoogleLogin
                        onSuccess={(credentialResponse) => {
                          if (credentialResponse?.credential) {
                            dispatch(
                              googleLogin(credentialResponse.credential),
                            );
                          }
                        }}
                        onError={() => {
                          toast.error("Google sign-in failed");
                        }}
                        useOneTap={false}
                      />
                    </Box>
                    <Button
                      variant="outlined"
                      startIcon={<FacebookIcon />}
                      sx={{
                        borderRadius: 2,
                        py: 1,
                        flexGrow: 1,
                        color: "#4267B2",
                        borderColor: "#4267B2",
                        "&:hover": {
                          borderColor: "#4267B2",
                          backgroundColor: "rgba(66, 103, 178, 0.1)",
                        },
                      }}
                    >
                      Facebook
                    </Button>
                  </Box>
                </>
              )}
            </form>
          </Paper>

          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Typography variant="body2">
              Already have an account?{" "}
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

export default Register;
