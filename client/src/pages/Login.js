import React, { useState, useEffect } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/actions/authActions";
import {
  Box,
  TextField,
  Typography,
  Paper,
  Link,
  InputAdornment,
  IconButton,
  useTheme,
  useMediaQuery,
  Divider,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LoginIcon from "@mui/icons-material/Login";
import PrimaryButton from "../components/PrimaryButton";

// GSSOC FIX: Array of Carousel Images & Content
const CAROUSEL_SLIDES = [
  {
    image:
      "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?q=80&w=1887&auto=format&fit=crop",
    title: "PackGo",
    description:
      "Your ultimate companion for discovering and planning your dream adventures",
  },
  {
    image:
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1887&auto=format&fit=crop",
    title: "Explore the World",
    description:
      "Track your budgets, check real-time weather details, and map out routes seamlessly",
  },
  {
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1887&auto=format&fit=crop",
    title: "Share Memories",
    description:
      "Organize bookings and create curated trip itineraries in one single intuitive dashboard",
  },
];

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // GSSOC FIX: State to manage the active slide index
  const [activeSlide, setActiveSlide] = useState(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  // GSSOC FIX: Set up automatic slide rotation (Interval clears on unmount to avoid memory leaks)
  useEffect(() => {
    if (isMobile) return; // Don't run intervals if banner hidden on mobile

    const interval = setInterval(() => {
      setActiveSlide((prevIndex) => (prevIndex + 1) % CAROUSEL_SLIDES.length);
    }, 5000); // Rotates every 5 seconds

    return () => clearInterval(interval);
  }, [isMobile]);

  const handleGoogleCallback = (response) => {
    console.log("Google callback received", response);
  };

  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id:
            "643113382684-q82ot662op6kq7fnc1brg3ivclq3pmvk.apps.googleusercontent.com",
          callback: handleGoogleCallback,
        });

        const googleBtn = document.getElementById("google-signin-btn");
        if (googleBtn) {
          window.google.accounts.id.renderButton(googleBtn, {
            theme: "outline",
            size: "large",
            text: "signin_with",
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
  }, [isMobile, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "email") {
      if (
        value &&
        !/^[a-zA-Z0-9][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
          value,
        )
      ) {
        setErrors((prev) => ({ ...prev, email: "Please enter a valid email" }));
      } else {
        setErrors((prev) => ({ ...prev, email: "" }));
      }
    } else if (name === "password") {
      if (!value || value.trim() === "") {
        setErrors((prev) => ({ ...prev, password: "Password is required" }));
      } else {
        setErrors((prev) => ({ ...prev, password: "" }));
      }
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    let isValid = true;
    let tempErrors = { email: "", password: "" };

    if (
      !formData.email ||
      !/^[a-zA-Z0-9][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
        formData.email,
      )
    ) {
      tempErrors.email = "Please enter a valid email";
      isValid = false;
    }
    if (!formData.password || formData.password.trim() === "") {
      tempErrors.password = "Password is required";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const isSignInDisabled = () => {
    return (
      !formData.email ||
      formData.email.trim() === "" ||
      !!errors.email ||
      !formData.password ||
      formData.password.trim() === "" ||
      !!errors.password
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      dispatch(login(formData, navigate));
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
      {/* GSSOC FIX: Animated Carousel Container Section */}
      {!isMobile && (
        <Box
          sx={{
            flex: 1,
            backgroundImage: `url(${CAROUSEL_SLIDES[activeSlide].image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "sticky",
            top: 0,
            height: "100vh",
            alignSelf: "flex-start",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            transition: "background-image 0.6s ease-in-out", // Smooth transition effect
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

          {/* Main Typography content synced with Active State */}
          <Box sx={{ position: "relative", p: 6, color: "white" }}>
            <Typography
              variant="h3"
              component="h1"
              sx={{ fontWeight: 700, mb: 2 }}
            >
              {CAROUSEL_SLIDES[activeSlide].title}
            </Typography>
            <Typography variant="h5" sx={{ mb: 4, maxWidth: "80%" }}>
              {CAROUSEL_SLIDES[activeSlide].description}
            </Typography>

            {/* GSSOC FIX: Clickable Navigation Carousel Dots */}
            <Box sx={{ display: "flex", gap: 1.5, mt: 2 }}>
              {CAROUSEL_SLIDES.map((_, index) => (
                <Box
                  key={index}
                  onClick={() => setActiveSlide(index)}
                  sx={{
                    width: index === activeSlide ? 24 : 10, // Active dot stretches wide
                    height: 10,
                    borderRadius: "5px",
                    backgroundColor:
                      index === activeSlide
                        ? "primary.main"
                        : "rgba(255, 255, 255, 0.5)",
                    cursor: "pointer",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      backgroundColor:
                        index === activeSlide ? "primary.main" : "white",
                    },
                  }}
                />
              ))}
            </Box>
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
          <Box sx={{ textAlign: "center", mb: 5 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
              Welcome Back
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Sign in to continue to PackGo
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
            <form onSubmit={handleSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                sx={{ mb: 3 }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
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
                sx={{ mb: 1 }}
              />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Remember me"
                />
                <Link
                  component={RouterLink}
                  to="/forgot-password"
                  variant="body2"
                >
                  Forgot password?
                </Link>
              </Box>

              <PrimaryButton
                type="submit"
                fullWidth
                size="large"
                disabled={isSignInDisabled()}
                sx={{ py: 1.5, mb: 3, borderRadius: 2, fontWeight: 600 }}
                endIcon={<LoginIcon />}
              >
                Sign In
              </PrimaryButton>

              <Divider sx={{ my: 3 }}>
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
                  mb: 3,
                }}
              >
                <div id="google-signin-btn" />
                <Box sx={{ display: "flex", gap: 2 }}>
                  <IconButton
                    disabled
                    sx={{
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 2,
                      p: 1.5,
                      color: "#4267B2",
                      opacity: 0.5,
                    }}
                  >
                    <FacebookIcon />
                  </IconButton>
                  <IconButton
                    disabled
                    sx={{
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 2,
                      p: 1.5,
                      color: "#1DA1F2",
                      opacity: 0.5,
                    }}
                  >
                    <TwitterIcon />
                  </IconButton>
                </Box>
              </Box>
            </form>
          </Paper>

          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Typography variant="body2">
              Don't have an account?{" "}
              <Link
                component={RouterLink}
                to="/register"
                variant="subtitle2"
                sx={{ fontWeight: 600 }}
              >
                Get started
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

export default Login;
