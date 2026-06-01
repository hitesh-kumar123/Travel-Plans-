import React, { useState } from "react";
import { IconButton, Tooltip, Box, TextField, Typography, Paper, InputAdornment } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", p: 4 }}>
      <Paper elevation={1} sx={{ p: 4, borderRadius: 4, width: "100%", maxWidth: 480 }}>
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>Welcome Back</Typography>
        </Box>
        <form onSubmit={handleSubmit}>
          <TextField
            margin="normal" fullWidth label="Email Address" name="email"
            value={formData.email} onChange={handleChange}
          />
          <TextField
            margin="normal" fullWidth label="Password" name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password} onChange={handleChange}
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

          <Box sx={{ display: "flex", gap: 2, mt: 3, justifyContent: "center" }}>
            <Tooltip title="Facebook login is currently unavailable" arrow>
              <span>
                <IconButton sx={{ border: "1px solid", borderRadius: 2, p: 1.5, color: "#4267B2", opacity: 0.5, pointerEvents: "auto" }}>
                  <FacebookIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Twitter login is currently unavailable" arrow>
              <span>
                <IconButton sx={{ border: "1px solid", borderRadius: 2, p: 1.5, color: "#1DA1F2", opacity: 0.5, pointerEvents: "auto" }}>
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