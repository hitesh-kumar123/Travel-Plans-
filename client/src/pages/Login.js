import React from "react";
import { IconButton, Tooltip, Box } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";

const Login = () => {
  return (
    <Box sx={{ display: "flex", gap: 2, mt: 2, justifyContent: "center" }}>
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
  );
};

export default Login;