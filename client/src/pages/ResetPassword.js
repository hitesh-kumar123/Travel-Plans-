import React, { useState } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Link,
  useTheme,
  useMediaQuery,
  Alert,
} from "@mui/material";
import LockResetIcon from "@mui/icons-material/LockReset";
import api from "../services/api";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const { token } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await api.put(`/auth/reset-password/${token}`, {
        password,
      });

      setMessage(response.data.msg);
      setError(null);
      setTimeout(() => navigate("/login"), 3000); // Redirect to login after 3s
    } catch (err) {
      setError(err.response?.data?.msg || "Server error");
      setMessage(null);
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
          <Box sx={{ textAlign: "center", mb: 5 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
              Reset Password
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Enter your new password below.
            </Typography>
          </Box>

          {message && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {message} Redirecting...
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

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
                id="password"
                label="New Password"
                name="password"
                type="password"
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ mb: 2 }}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                id="confirmPassword"
                label="Confirm New Password"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                sx={{ mb: 3 }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  py: 1.5,
                  mb: 3,
                  borderRadius: 2,
                  fontWeight: 600,
                }}
                endIcon={<LockResetIcon />}
              >
                Reset Password
              </Button>
            </form>
          </Paper>

          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Typography variant="body2">
              <Link
                component={RouterLink}
                to="/login"
                variant="subtitle2"
                sx={{ fontWeight: 600 }}
              >
                Back to Login
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ResetPassword;
