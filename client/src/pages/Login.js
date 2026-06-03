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
  Tooltip,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
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
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleGoogleCallback = (response) => {
    console.log("Google callback received", response);
  };

  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: "643113382684-q82ot662op6kq7fnc1brg3ivclq3pmvk.apps.googleusercontent.com",
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
  }, [isMobile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData, navigate));
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", bgcolor: "background.default", p: 2 }}>
      <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: isMobile ? 320 : 400, borderRadius: 3 }}>
        <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: 700 }}>
          Sign In
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField fullWidth margin="normal" label="Email Address" name="email" value={formData.email} onChange={handleChange} />
          <TextField fullWidth margin="normal" label="Password" name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={toggleShowPassword} edge="end">
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, mt: 1 }}>
            <FormControlLabel control={<Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} color="primary" />} label="Remember me" />
            <Link component={RouterLink} to="/forgot-password" variant="body2">Forgot password?</Link>
          </Box>
          <PrimaryButton type="submit" fullWidth size="large" sx={{ py: 1.5, mb: 3, borderRadius: 2, fontWeight: 600 }} endIcon={<LoginIcon />}>
            Sign In
          </PrimaryButton>
          <Divider sx={{ my: 3 }}><Typography variant="body2" color="text.secondary">OR</Typography></Divider>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 3 }}><div id="google-signin-btn" /></Box>
          <Box sx={{ display: "flex", gap: 2, mt: 2, justifyContent: "center" }}>
            <Tooltip title="Facebook login is currently unavailable" arrow>
              <span>
                <IconButton sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, p: 1.5, color: "#4267B2", opacity: 0.5, cursor: "not-allowed", pointerEvents: "auto" }} onClick={(e) => e.preventDefault()}>
                  <FacebookIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Twitter login is currently unavailable" arrow>
              <span>
                <IconButton sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, p: 1.5, color: "#1DA1F2", opacity: 0.5, cursor: "not-allowed", pointerEvents: "auto" }} onClick={(e) => e.preventDefault()}>
                  <TwitterIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;
