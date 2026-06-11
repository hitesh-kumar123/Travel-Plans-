import React, { useState, useEffect } from "react";
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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LoginIcon from "@mui/icons-material/Login";
import PrimaryButton from "../components/PrimaryButton";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "email") {
      setErrors((prev) => ({
        ...prev,
        email:
          value &&
          !/^[a-zA-Z0-9][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
            value,
          )
            ? "Please enter a valid email"
            : "",
      }));
    } else if (name === "password") {
      setErrors((prev) => ({
        ...prev,
        password: !value || value.trim() === "" ? "Password is required" : "",
      }));
    }
  };

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const validateForm = () => {
    const tempErrors = { email: "", password: "" };
    let isValid = true;

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

  const isSignInDisabled = () =>
    !formData.email ||
    formData.email.trim() === "" ||
    !!errors.email ||
    !formData.password ||
    formData.password.trim() === "" ||
    !!errors.password;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) dispatch(login(formData, navigate));
  };

  const handleGoogleSuccess = (credentialResponse) => {
    dispatch(googleLogin(credentialResponse, navigate));
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: { md: 4, lg: 5 },
        px: { xs: 2, sm: 3, md: 4 },
        py: 3,
        bgcolor: "background.default",
      }}
    >
      {/* ── Left: Hero image panel ── */}
      {!isMobile && (
        <Box
          sx={{
            flex: "0 0 55%",
            maxWidth: "55%",
            height: "84vh",
            maxHeight: 860,
            borderRadius: 5,
            overflow: "hidden",
            position: "relative",
            backgroundImage:
              "url(https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            boxShadow: "0 18px 48px rgba(15, 23, 42, 0.20)",
          }}
        >
          {/* Overlay */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(155deg, rgba(10,18,35,0.68) 0%, rgba(20,30,55,0.58) 50%, rgba(10,18,35,0.86) 100%)",
            }}
          />

          {/* Text content */}
          <Box
            sx={{
              position: "relative",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              p: { md: 4, lg: 5 },
              color: "white",
            }}
          >
            <Box>
              <Typography
                variant="overline"
                sx={{
                  letterSpacing: 2.8,
                  opacity: 0.82,
                  display: "block",
                  mb: 1.5,
                }}
              >
                Travel planning made simple
              </Typography>
              <Typography
                variant="h3"
                component="h1"
                sx={{ fontWeight: 800, lineHeight: 1.18, mb: 1.5 }}
              >
                Plan your next trip with PackGo.
              </Typography>
              <Typography
                variant="body1"
                sx={{ maxWidth: 400, lineHeight: 1.65, opacity: 0.9 }}
              >
                Track budgets, organize packing lists, and turn ideas into a
                ready-to-follow itinerary — all in one place.
              </Typography>
            </Box>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.2 }}>
              {["Budget planner", "Packing checklist", "Trip reminders"].map(
                (item) => (
                  <Box
                    key={item}
                    sx={{
                      px: 1.8,
                      py: 0.9,
                      borderRadius: 999,
                      border: "1px solid rgba(255,255,255,0.22)",
                      bgcolor: "rgba(255,255,255,0.1)",
                      backdropFilter: "blur(8px)",
                      fontSize: "0.875rem",
                      color: "white",
                    }}
                  >
                    {item}
                  </Box>
                ),
              )}
            </Box>
          </Box>
        </Box>
      )}

      {/* ── Right: Form panel ── */}
      <Box
        sx={{
          flex: isMobile ? "1 1 auto" : "0 0 45%",
          maxWidth: isMobile ? "100%" : "45%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: { xs: "100vh", md: "84vh" },
          maxHeight: { md: 860 },
          py: { xs: 4, md: 0 },
          px: { xs: 0, sm: 2 },
        }}
      >
        {/* Inner content — constrained width */}
        <Box
          sx={{
            width: "100%",
            maxWidth: 440,
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: "center",
          }}
        >
          {/* Top bar: back button + brand */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              mb: { xs: 3, sm: 4 },
            }}
          >
            <IconButton
              onClick={() => navigate(-1)}
              aria-label="Go back"
              size="small"
              sx={{
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
                boxShadow: 1,
                "&:hover": { bgcolor: "action.hover" },
              }}
            >
              <ArrowBackIcon fontSize="small" />
            </IconButton>

            <Link
              component={RouterLink}
              to="/"
              underline="none"
              sx={{
                fontWeight: 800,
                color: "text.primary",
                fontSize: "1.02rem",
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              PackGo
            </Link>
          </Box>

          {/* Heading */}
          <Box sx={{ mb: 3.5 }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{ fontWeight: 800, lineHeight: 1.2, mb: 0.75 }}
            >
              Welcome back
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ lineHeight: 1.5 }}
            >
              Sign in to continue planning your next adventure.
            </Typography>
          </Box>

          {/* Card */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 3.5 },
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
              boxShadow: "0 8px 32px rgba(0,0,0,0.07)",
            }}
          >
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                margin="none"
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
                sx={{ mb: 2.5 }}
              />

              <TextField
                margin="none"
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
                          aria-label="Toggle password visibility"
                          onClick={toggleShowPassword}
                          edge="end"
                          size="small"
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
                sx={{ mb: 1.5 }}
              />

              {/* Remember me + Forgot password */}
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
                      size="small"
                    />
                  }
                  label={
                    <Typography variant="body2" color="text.secondary">
                      Remember me
                    </Typography>
                  }
                />
                <Link
                  component={RouterLink}
                  to="/forgot-password"
                  variant="body2"
                  sx={{ fontWeight: 500 }}
                >
                  Forgot password?
                </Link>
              </Box>

              {/* Submit */}
              <PrimaryButton
                type="submit"
                fullWidth
                size="large"
                disabled={isSignInDisabled()}
                endIcon={<LoginIcon />}
                sx={{
                  py: 1.5,
                  mb: 2.5,
                  borderRadius: 2,
                  fontWeight: 700,
                  fontSize: "0.95rem",
                }}
              >
                Sign In
              </PrimaryButton>

              {/* Divider */}
              <Divider sx={{ mb: 2.5 }}>
                <Typography variant="caption" color="text.secondary">
                  or continue with
                </Typography>
              </Divider>

              {/* Google login */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <GoogleLogin
                  theme="outlined"
                  width="100%"
                  shape="pill"
                  text="continue_with"
                  size="large"
                  onSuccess={handleGoogleSuccess}
                  onError={() => console.log("Google Login failed")}
                  useOneTap
                />
              </Box>
            </Box>
          </Paper>

          {/* Sign up link */}
          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{" "}
              <Link
                component={RouterLink}
                to="/register"
                variant="body2"
                sx={{ fontWeight: 700, color: "primary.main" }}
              >
                Get started
              </Link>
            </Typography>
          </Box>

          {/* Footer */}
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Typography variant="caption" color="text.disabled">
              © {new Date().getFullYear()} PackGo. All rights reserved.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
