import React from 'react';
import { 
  IconButton, 
  Tooltip, 
  Box
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';

const Login = () => {
  return (
    <form>
      <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4, p: 2 }}>
        <div id="google-signin-btn" />
        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          
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
      </Box>
    </form>
  );
};

export default Login;