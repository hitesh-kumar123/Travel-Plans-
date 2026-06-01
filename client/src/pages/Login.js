import React from "react";
import {
  IconButton,
  Tooltip,
  Box,
  TextField,
  Typography,
  Paper,
  InputAdornment,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const Login = () => {
  // ... (Ensure your state/handlers like formData, handleChange, etc. are defined here)

  return (
    <Box sx={{ minHeight: "100vh", display: "flex" }}>
      {/* ... (Keep your side image Box code here) ... */}

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
        <Paper
          elevation={1}
          sx={{ p: 4, borderRadius: 4, width: "100%", maxWidth: 480 }}
        >
          <form onSubmit={handleSubmit}>
            {/* ... (Keep your Email and Password fields here) ... */}

            {/* HERE IS WHERE YOUR TOOLTIPS GO */}
            <Box
              sx={{ display: "flex", gap: 2, mt: 2, justifyContent: "center" }}
            >
              <Tooltip title="Facebook login is currently unavailable" arrow>
                <span>
                  <IconButton
                    sx={{
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 2,
                      p: 1.5,
                      color: "#4267B2",
                      opacity: 0.5,
                      cursor: "not-allowed",
                      pointerEvents: "auto",
                    }}
                    onClick={(e) => e.preventDefault()}
                  >
                    <FacebookIcon />
                  </IconButton>
                </span>
              </Tooltip>

              <Tooltip title="Twitter login is currently unavailable" arrow>
                <span>
                  <IconButton
                    sx={{
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 2,
                      p: 1.5,
                      color: "#1DA1F2",
                      opacity: 0.5,
                      cursor: "not-allowed",
                      pointerEvents: "auto",
                    }}
                    onClick={(e) => e.preventDefault()}
                  >
                    <TwitterIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
          </form>
        </Paper>
      </Box>
    </Box>
  );
};
export default Login;
