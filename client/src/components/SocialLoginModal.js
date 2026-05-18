import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Avatar,
  Button,
  TextField,
  IconButton,
  CircularProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// Premium Multi-color Google SVG Logo
const GoogleLogoSvg = (props) => (
  <svg viewBox="0 0 24 24" width="32" height="32" {...props}>
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

// Premium Facebook SVG Logo
const FacebookLogoSvg = (props) => (
  <svg viewBox="0 0 24 24" width="40" height="40" {...props}>
    <path
      fill="#1877F2"
      d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
    />
  </svg>
);

const SocialLoginModal = ({ open, onClose, provider, onSocialSubmit }) => {
  const [loading, setLoading] = useState(false);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customData, setCustomData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [formError, setFormError] = useState("");

  const handleSelectAccount = async (account) => {
    setLoading(true);
    // Simulate real OAuth secure token exchange and network latency
    setTimeout(async () => {
      try {
        await onSocialSubmit({
          name: account.name,
          email: account.email,
          provider: provider,
        });
        setLoading(false);
        onClose();
      } catch (err) {
        setLoading(false);
      }
    }, 1500);
  };

  const handleCustomSubmit = async (e) => {
    e.preventDefault();
    if (
      !customData.email ||
      (provider === "facebook" && !customData.password)
    ) {
      setFormError("Please fill in the required fields.");
      return;
    }

    // Automatically extract mock name from email if not provided
    const name =
      customData.name ||
      customData.email
        .split("@")[0]
        .replace(/[._]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

    setLoading(true);
    setFormError("");

    setTimeout(async () => {
      try {
        await onSocialSubmit({
          name,
          email: customData.email,
          provider: provider,
        });
        setLoading(false);
        onClose();
      } catch (err) {
        setLoading(false);
        setFormError("Authentication failed. Please try again.");
      }
    }, 1500);
  };

  const googleAccounts = [
    {
      name: "Prasanna Karagar",
      email: "prasannakaragar@gmail.com",
      avatar: "P",
    },
    {
      name: "Traveler Explorer",
      email: "traveler.explorer@gmail.com",
      avatar: "T",
    },
  ];

  return (
    <Dialog
      open={open}
      onClose={loading ? null : onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          padding: 2,
          boxShadow: "0 24px 54px rgba(0,0,0,0.15)",
          position: "relative",
          overflow: "hidden",
        },
      }}
    >
      {/* Close Button */}
      {!loading && (
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 16,
            top: 16,
            color: "text.secondary",
          }}
        >
          <CloseIcon />
        </IconButton>
      )}

      <DialogContent sx={{ px: 1, py: 2 }}>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              py: 6,
              gap: 3,
            }}
          >
            <CircularProgress
              size={50}
              color={provider === "google" ? "primary" : "info"}
            />
            <Typography
              variant="body1"
              sx={{
                fontWeight: 600,
                color: "text.secondary",
                textAlign: "center",
              }}
            >
              Connecting with {provider === "google" ? "Google" : "Facebook"}{" "}
              Secure OAuth...
            </Typography>
          </Box>
        ) : provider === "google" ? (
          /* ================= GOOGLE FLOW ================= */
          <Box>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
              <GoogleLogoSvg />
            </Box>

            <Typography
              variant="h5"
              align="center"
              sx={{ fontWeight: 700, mb: 1, fontFamily: "'Inter', sans-serif" }}
            >
              {showCustomForm ? "Sign in with Google" : "Choose an account"}
            </Typography>
            <Typography
              variant="body2"
              align="center"
              color="text.secondary"
              sx={{ mb: 4 }}
            >
              to continue to{" "}
              <span style={{ fontWeight: 600, color: "#1976d2" }}>PackGo</span>
            </Typography>

            {showCustomForm ? (
              <form onSubmit={handleCustomSubmit}>
                {formError && (
                  <Typography
                    variant="caption"
                    color="error"
                    display="block"
                    sx={{ mb: 2, textAlign: "center" }}
                  >
                    {formError}
                  </Typography>
                )}
                <TextField
                  fullWidth
                  label="Name (Optional)"
                  variant="outlined"
                  value={customData.name}
                  onChange={(e) =>
                    setCustomData({ ...customData, name: e.target.value })
                  }
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  required
                  type="email"
                  label="Email or phone"
                  variant="outlined"
                  value={customData.email}
                  onChange={(e) =>
                    setCustomData({ ...customData, email: e.target.value })
                  }
                  sx={{ mb: 3 }}
                />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => {
                      setShowCustomForm(false);
                      setFormError("");
                    }}
                    sx={{ color: "text.secondary" }}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ px: 4, borderRadius: 2 }}
                  >
                    Next
                  </Button>
                </Box>
              </form>
            ) : (
              <Box>
                <List sx={{ pt: 0, mb: 2 }}>
                  {googleAccounts.map((account) => (
                    <ListItem disablePadding key={account.email} sx={{ mb: 1 }}>
                      <ListItemButton
                        onClick={() => handleSelectAccount(account)}
                        sx={{
                          borderRadius: 2,
                          border: "1px solid",
                          borderColor: "divider",
                          "&:hover": {
                            borderColor: "primary.main",
                            backgroundColor: "rgba(25, 118, 210, 0.04)",
                          },
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              bgcolor: "primary.light",
                              color: "white",
                              fontWeight: 600,
                            }}
                          >
                            {account.avatar}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={account.name}
                          secondary={account.email}
                          primaryTypographyProps={{
                            sx: { fontWeight: 600, fontSize: "0.95rem" },
                          }}
                          secondaryTypographyProps={{
                            sx: { fontSize: "0.8rem" },
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}

                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => setShowCustomForm(true)}
                      sx={{
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        py: 1.5,
                        "&:hover": {
                          borderColor: "primary.main",
                          backgroundColor: "rgba(25, 118, 210, 0.04)",
                        },
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          sx={{ bgcolor: "grey.200", color: "text.secondary" }}
                        >
                          +
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary="Use another account"
                        primaryTypographyProps={{
                          sx: {
                            fontWeight: 600,
                            fontSize: "0.95rem",
                            color: "text.primary",
                          },
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                </List>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  sx={{ mt: 3, px: 1, lineHeight: 1.4 }}
                >
                  To continue, Google will share your name, email address,
                  language preference, and profile picture with PackGo. Before
                  using this app, you can review PackGo's{" "}
                  <a
                    href="#privacy"
                    style={{
                      textDecoration: "none",
                      color: "#1976d2",
                      fontWeight: 600,
                    }}
                  >
                    Privacy Policy
                  </a>{" "}
                  and{" "}
                  <a
                    href="#terms"
                    style={{
                      textDecoration: "none",
                      color: "#1976d2",
                      fontWeight: 600,
                    }}
                  >
                    Terms of Service
                  </a>
                  .
                </Typography>
              </Box>
            )}
          </Box>
        ) : (
          /* ================= FACEBOOK FLOW ================= */
          <Box>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
              <FacebookLogoSvg />
            </Box>

            <Typography
              variant="h5"
              align="center"
              sx={{ fontWeight: 700, mb: 1, fontFamily: "'Inter', sans-serif" }}
            >
              Facebook Login
            </Typography>
            <Typography
              variant="body2"
              align="center"
              color="text.secondary"
              sx={{ mb: 4 }}
            >
              Connect your account securely to continue to PackGo
            </Typography>

            {showCustomForm ? (
              <form onSubmit={handleCustomSubmit}>
                {formError && (
                  <Typography
                    variant="caption"
                    color="error"
                    display="block"
                    sx={{ mb: 2, textAlign: "center" }}
                  >
                    {formError}
                  </Typography>
                )}
                <TextField
                  fullWidth
                  required
                  type="text"
                  label="Mobile number or email address"
                  variant="outlined"
                  value={customData.email}
                  onChange={(e) =>
                    setCustomData({ ...customData, email: e.target.value })
                  }
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  required
                  type="password"
                  label="Password"
                  variant="outlined"
                  value={customData.password}
                  onChange={(e) =>
                    setCustomData({ ...customData, password: e.target.value })
                  }
                  sx={{ mb: 3 }}
                />

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    sx={{
                      bgcolor: "#1877F2",
                      "&:hover": { bgcolor: "#166fe5" },
                      py: 1.2,
                      fontWeight: 600,
                      borderRadius: 2,
                    }}
                  >
                    Log In
                  </Button>
                  <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => {
                      setShowCustomForm(false);
                      setFormError("");
                    }}
                    sx={{ color: "text.secondary", alignSelf: "center" }}
                  >
                    Back to Quick Sign-In
                  </Button>
                </Box>
              </form>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Avatar
                  sx={{
                    width: 72,
                    height: 72,
                    bgcolor: "#1877F2",
                    fontSize: "2rem",
                    fontWeight: 700,
                    boxShadow: "0 4px 12px rgba(24,119,242,0.3)",
                  }}
                >
                  P
                </Avatar>

                <Typography variant="h6" sx={{ fontWeight: 600, mt: 1 }}>
                  Prasanna Karagar
                </Typography>

                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={() =>
                    handleSelectAccount({
                      name: "Prasanna Karagar",
                      email: "prasannakaragar@gmail.com",
                    })
                  }
                  sx={{
                    bgcolor: "#1877F2",
                    "&:hover": { bgcolor: "#166fe5" },
                    py: 1.5,
                    fontWeight: 600,
                    borderRadius: 2,
                    textTransform: "none",
                    fontSize: "1rem",
                    mt: 2,
                  }}
                >
                  Continue as Prasanna
                </Button>

                <Button
                  onClick={() => setShowCustomForm(true)}
                  sx={{
                    color: "#1877F2",
                    textTransform: "none",
                    fontWeight: 600,
                    mt: 1,
                  }}
                >
                  Log in to another account
                </Button>
              </Box>
            )}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SocialLoginModal;
