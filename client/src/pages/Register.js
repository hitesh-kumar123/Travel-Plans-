import React, { useState, useEffect } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../redux/actions/authActions";
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
import PrimaryButton from "../components/PrimaryButton";

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
  const [fieldErrors, setFieldErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

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

  const handleGoogleCallback = (response) => {
    // Google Sign-In disabled in this commit since googleLogin action
    // is not present in authActions.js in the current repo.
    // Keep this handler to avoid runtime errors.
    console.log("Google callback received", response);
  };

  useEffect(() => {
    // Only initialize Google Sign-In if activeStep is 0 (Personal Information / first step)
    if (activeStep !== 0) return;

    const initializeGoogleSignIn = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id:
            process.env.REACT_APP_GOOGLE_CLIENT_ID ||
            "643113382684-q82ot662op6kq7fnc1brg3ivclq3pmvk.apps.googleusercontent.com",
          callback: handleGoogleCallback,
        });

        const googleBtn = document.getElementById("google-signin-btn");
        if (googleBtn) {
          window.google.accounts.id.renderButton(googleBtn, {
            theme: "outline",
            size: "large",
            text: "signup_with",
            width: isMobile ? 280 : 360,
          });
        }
      }
    };

    initializeGoogleSignIn();

    const script = document.querySelector(
      'script[src="https://accounts.google.com/gsi/client"]',
    );
    if (script) {
      script.addEventListener("load", initializeGoogleSignIn);
    }

    return () => {
      if (script) {
        script.removeEventListener("load", initializeGoogleSignIn);
      }
    };
  }, [activeStep, isMobile, dispatch]);

  const steps = ["Personal Information", "Account Setup", "Confirmation"];

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    const newValue = name === "agreeTerms" ? checked : value;

    setFormData({
      ...formData,
      [name]: newValue,
    });

    const newErrors = { ...fieldErrors };
    if (name === "firstName" || name === "lastName") {
      if (value && (!/^[A-Za-z\s]+$/.test(value) || value.trim().length < 1)) {
        newErrors[name] = "Name can only contain letters and spaces";
      } else {
        newErrors[name] = "";
      }
    } else if (name === "email") {
      if (
        value &&
        !/^[a-zA-Z0-9][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
          value,
        )
      ) {
        newErrors.email = "Please enter a valid email address";
      } else {
        newErrors.email = "";
      }
    } else if (name === "password") {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
      if (value && !passwordRegex.test(value)) {
        newErrors.password =
          "Password must be at least 8 chars with atleast 1 uppercase, 1 lowercase, 1 number, and 1 special char";
      } else {
        newErrors.password = "";
      }
    }
    setFieldErrors(newErrors);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeStep === steps.length - 1) {
      const payload = {
        name: `${formData.firstName.trim()} ${formData.lastName.trim()}`.replace(
          /\s+/g,
          " ",
        ),
        email: formData.email,
        password: formData.password,
      };
      dispatch(register(payload, navigate));
    } else {
      handleNext();
    }
  };

  const isNextDisabled = () => {
    if (activeStep === 0) {
      return (
        !formData.firstName ||
        formData.firstName.trim() === "" ||
        !!fieldErrors.firstName ||
        !formData.lastName ||
        formData.lastName.trim() === "" ||
        !!fieldErrors.lastName
      );
    } else if (activeStep === 1) {
      return (
        !formData.email ||
        !!fieldErrors.email ||
        !formData.password ||
        !!fieldErrors.password ||
        !formData.confirmPassword ||
        !!passwordError ||
        !formData.agreeTerms
      );
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
            <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
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
                error={!!fieldErrors.firstName}
                helperText={fieldErrors.firstName}
              />
              <TextField
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
                value={formData.lastName}
                onChange={handleChange}
                error={!!fieldErrors.lastName}
                helperText={fieldErrors.lastName}
              />
            </Box>
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
              error={!!fieldErrors.email}
              helperText={fieldErrors.email}
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
              error={!!fieldErrors.password}
              helperText={fieldErrors.password}
              slotProps={{
                input: {
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
                },
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
              sx={{
                alignItems: "flex-start", // Shifts the alignment anchor to the top line
                mt: 1.5,
              }}
              control={
                <Checkbox
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  name="agreeTerms"
                  color="primary"
                  sx={{
                    paddingTop: 0,
                    marginTop: "-2px",
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
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
                  </Link>{" "}
                  *
                </Typography>
              }
            />
          </>
        );
      case 2:
        return (
          <Box sx={{ textAlign: "center", py: 2 }}>
            <CheckCircleOutlineIcon
              color="success"
              sx={{ fontSize: 64, mb: 2 }}
            />
            <Typography variant="h6" gutterBottom>
              Almost there!
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Please review your information:
            </Typography>
            <Box sx={{ textAlign: "left", mb: 3 }}>
              <Typography variant="body2" gutterBottom>
                <strong>Name:</strong> {formData.firstName} {formData.lastName}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Email:</strong> {formData.email}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              By clicking "Create Account", you agree to our terms and privacy
              policy, and confirm that all information provided is accurate.
            </Typography>
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
            position: "sticky",
            top: 0,
            height: "100vh",
            alignSelf: "flex-start",
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
          <Box sx={{ position: "relative", p: 6, color: "white" }}>
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
                  bgcolor:
                    activeStep === 0 ? "white" : "rgba(255, 255, 255, 0.5)",
                  borderRadius: "50%",
                }}
              />
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  bgcolor:
                    activeStep === 1 ? "white" : "rgba(255, 255, 255, 0.5)",
                  borderRadius: "50%",
                }}
              />
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  bgcolor:
                    activeStep === 2 ? "white" : "rgba(255, 255, 255, 0.5)",
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
          height: "100vh",
          overflow: "auto",
        }}
      >
        <Box sx={{ maxWidth: 480, width: "100%" }}>
          <Box sx={{ position: "relative", textAlign: "center", mb: 4 }}>
            {/* Back to Home */}
            <Box
              sx={{
                position: "absolute",
                left: { xs: 0, sm: -20, md: -50, lg: -80 },
                top: 0,
              }}
            >
              <Link
                component={RouterLink}
                to="/"
                variant="body2"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  border: "1px solid",
                  borderColor: "divider",
                  backgroundColor: "background.paper",
                  textDecoration: "none",
                  transition: "0.2s ease",
                  "&:hover": { backgroundColor: "action.hover" },
                }}
              >
                <ArrowBackIcon sx={{ mr: 0.5, fontSize: 18 }} />
              </Link>
            </Box>

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

              <Box sx={{ display: "flex", gap: 2 }}>
                {activeStep > 0 && (
                  <Button
                    onClick={handleBack}
                    startIcon={<ArrowBackIcon />}
                    variant="outlined"
                    sx={{ flex: 1, py: 1.5, borderRadius: 2, fontWeight: 600 }}
                  >
                    Back
                  </Button>
                )}
                <PrimaryButton
                  type="submit"
                  disabled={isNextDisabled()}
                  sx={{ flex: 1, py: 1.5, borderRadius: 2, fontWeight: 600 }}
                  endIcon={
                    activeStep === steps.length - 1 ? (
                      <HowToRegIcon />
                    ) : (
                      <ArrowForwardIcon />
                    )
                  }
                >
                  {activeStep === steps.length - 1 ? "Create Account" : "Next"}
                </PrimaryButton>
              </Box>

              {activeStep === 0 && (
                <>
                  <Divider sx={{ my: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      OR
                    </Typography>
                  </Divider>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <div id="google-signin-btn" />
                    <Button
                      variant="outlined"
                      startIcon={<FacebookIcon />}
                      disabled
                      sx={{
                        borderRadius: 2,
                        py: 1,
                        width: isMobile ? 280 : 360,
                        color: "#4267B2",
                        borderColor: "#4267B2",
                        opacity: 0.5,
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
