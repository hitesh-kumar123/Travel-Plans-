import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { googleLogin, login } from "../redux/actions/authActions";
import { GoogleLogin } from "@react-oauth/google";
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

import LoginIcon from "@mui/icons-material/Login";
import PrimaryButton from "../components/PrimaryButton";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const sliderImages = [
  "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?q=80&w=1887&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?fm=jpg&q=60&w=3000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1530841377377-3ff06c0ca713?fm=jpg&q=60&w=3000&auto=format&fit=crop",
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

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [currentSlide]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + sliderImages.length) % sliderImages.length,
    );
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

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

  const handleGoogleSuccess = (CredentialResponse) => {
    dispatch(googleLogin(CredentialResponse, navigate));
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        backgroundColor: theme.palette.background.default,
      }}
    >
      {/* slider */}
      {!isMobile && (
        <Box
          sx={{
            flex: 1,
            position: "relative",
            height: "100vh",
            overflow: "hidden",
            display: "flex",
            alignItems: "flex-end",
          }}
        >
          <IconButton
            onClick={prevSlide}
            sx={{
              position: "absolute",
              left: 20,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 10,
              bgcolor: "rgba(255,255,255,.15)",
              backdropFilter: "blur(10px)",
              color: "white",
              width: 52,
              height: 52,
              transition: ".3s",
              "&:hover": {
                bgcolor: "rgba(255,255,255,.3)",
                transform: "translateY(-50%) scale(1.08)",
              },
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
          {sliderImages.map((img, index) => (
            <Box
              key={index}
              sx={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url(${img})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: currentSlide === index ? 1 : 0,
                transition: "opacity 1s ease-in-out",
              }}
            />
          ))}

          <IconButton
            onClick={nextSlide}
            sx={{
              position: "absolute",
              right: 20,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 10,
              bgcolor: "rgba(255,255,255,.15)",
              backdropFilter: "blur(10px)",
              color: "white",
              width: 52,
              height: 52,
              transition: ".3s",
              "&:hover": {
                bgcolor: "rgba(255,255,255,.3)",
                transform: "translateY(-50%) scale(1.08)",
              },
            }}
          >
            <ChevronRightIcon />
          </IconButton>

          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(rgba(0,0,0,0.25), rgba(0,0,0,0.55))",
            }}
          />

          <Box
            sx={{
              position: "relative",
              p: 6,
              color: "#fff",
              zIndex: 2,
            }}
          >
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
              PackGo
            </Typography>

            <Typography variant="h5" sx={{ maxWidth: "80%", mb: 3 }}>
              Your ultimate companion for discovering and planning your dream
              adventures
            </Typography>

            <Box sx={{ display: "flex", gap: 1 }}>
              {sliderImages.map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    width: currentSlide === index ? 24 : 8,
                    height: 8,
                    borderRadius: 10,
                    bgcolor:
                      currentSlide === index ? "#fff" : "rgba(255,255,255,0.5)",
                    transition: "0.4s",
                  }}
                />
              ))}
            </Box>
          </Box>
        </Box>
      )}
      {/* sign in form */}
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
              p: 5,
              borderRadius: 5,
              backdropFilter: "blur(20px)",
              background: "rgba(255,255,255,0.8)",
              border: "1px solid rgba(255,255,255,0.4)",
              boxShadow: "0 20px 60px rgba(15,23,42,0.12)",
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
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 700,
                  fontSize: "1rem",
                  boxShadow: "0 10px 30px rgba(59,130,246,.3)",
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-2px)",
                  },
                }}
                endIcon={<LoginIcon />}
              >
                Sign In
              </PrimaryButton>

              <GoogleAuthSection onSuccess={handleGoogleSuccess} />
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
