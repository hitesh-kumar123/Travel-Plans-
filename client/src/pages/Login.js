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

import PrimaryButton from "../components/PrimaryButton";
import { FaSpinner } from "react-icons/fa";

/**
 * Renders the Google Sign-In button and surrounding OR divider.
 * Uses a ResizeObserver to measure available container width so that
 * the GoogleLogin iframe never overflows its parent on any viewport.
 */
const GoogleAuthSection = ({ onSuccess }) => {
  const containerRef = useRef(null);
  const [buttonWidth, setButtonWidth] = useState(null);

  const updateWidth = useCallback(() => {
    if (containerRef.current) {
      setButtonWidth(Math.floor(containerRef.current.clientWidth));
    }
  }, []);

  useEffect(() => {
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [updateWidth]);

  return (
    <>
      <Divider sx={{ my: 3 }}>
        <Typography variant="body2" color="text.secondary">
          OR
        </Typography>
      </Divider>

      {/* Container measured so we can feed exact px width to GoogleLogin */}
      <Box ref={containerRef} sx={{ width: "100%", overflow: "hidden", mb: 3 }}>
        {buttonWidth !== null && (
          <GoogleLogin
            theme="outlined"
            width={buttonWidth}
            shape="pill"
            text="continue_with"
            size="large"
            onSuccess={onSuccess}
            onError={() => console.log("Google Login failed")}
          />
        )}
      </Box>
    </>
  );
};

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
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      try {
        await dispatch(login(formData, navigate));
      } catch (err) {
        console.error("Login Failed: ", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleGoogleSuccess = async (CredentialResponse) => {
    setLoading(true);
    try {
      await dispatch(googleLogin(CredentialResponse, navigate));
    } catch (err) {
      console.error("Google login failed", err);
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
              "url(https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?q=80&w=1887&auto=format&fit=crop)",
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
              PackGo
            </Typography>
            <Typography variant="h5" sx={{ mb: 4, maxWidth: "80%" }}>
              Your ultimate companion for discovering and planning your dream
              adventures
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
                disabled={isSignInDisabled() || loading}
              >
                {loading ? <FaSpinner className="spin" /> : "Sign In"}
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
