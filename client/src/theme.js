import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1a4a6b",
      light: "#3a7a9b",
      dark: "#0f2d40",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#e8735a",
      light: "#f0a090",
      dark: "#c55238",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f5f7fa",
      paper: "#ffffff",
    },
    text: {
      primary: "#0f2d40",
      secondary: "#718096",
    },
    success: {
      main: "#48bb78",
    },
    error: {
      main: "#f56565",
    },
    warning: {
      main: "#ed8936",
    },
    info: {
      main: "#4299e1",
    },
  },
  typography: {
    fontFamily: '"DM Sans", "Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 700,
      fontSize: "2.5rem",
      lineHeight: 1.1,
    },
    h2: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 700,
      fontSize: "2rem",
      lineHeight: 1.2,
    },
    h3: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 700,
      fontSize: "1.75rem",
      lineHeight: 1.25,
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.5rem",
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.25rem",
    },
    h6: {
      fontWeight: 600,
      fontSize: "1rem",
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    "none",
    "0px 2px 4px rgba(15, 45, 64, 0.04)",
    "0px 4px 6px rgba(15, 45, 64, 0.04)",
    "0px 6px 8px rgba(15, 45, 64, 0.04)",
    "0px 8px 12px rgba(15, 45, 64, 0.05)",
    "0px 10px 14px rgba(15, 45, 64, 0.05)",
    "0px 12px 16px rgba(15, 45, 64, 0.05)",
    "0px 14px 18px rgba(15, 45, 64, 0.06)",
    "0px 16px 20px rgba(15, 45, 64, 0.06)",
    "0px 18px 22px rgba(15, 45, 64, 0.06)",
    "0px 20px 24px rgba(15, 45, 64, 0.07)",
    "0px 22px 26px rgba(15, 45, 64, 0.07)",
    "0px 24px 28px rgba(15, 45, 64, 0.07)",
    "0px 26px 30px rgba(15, 45, 64, 0.08)",
    "0px 28px 32px rgba(15, 45, 64, 0.08)",
    "0px 30px 34px rgba(15, 45, 64, 0.08)",
    "0px 32px 36px rgba(15, 45, 64, 0.09)",
    "0px 34px 38px rgba(15, 45, 64, 0.09)",
    "0px 36px 40px rgba(15, 45, 64, 0.09)",
    "0px 38px 42px rgba(15, 45, 64, 0.10)",
    "0px 40px 44px rgba(15, 45, 64, 0.10)",
    "0px 42px 46px rgba(15, 45, 64, 0.10)",
    "0px 44px 48px rgba(15, 45, 64, 0.11)",
    "0px 46px 50px rgba(15, 45, 64, 0.11)",
    "0px 48px 52px rgba(15, 45, 64, 0.11)",
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 100,
          padding: "10px 24px",
          fontWeight: 500,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        },
        contained: {
          boxShadow: "0px 4px 6px rgba(15, 45, 64, 0.1)",
          "&:hover": {
            boxShadow: "0px 6px 12px rgba(15, 45, 64, 0.15)",
            transform: "translateY(-1px)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0px 8px 12px rgba(15, 45, 64, 0.05)",
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0px 12px 24px rgba(15, 45, 64, 0.1)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 16,
        },
        elevation1: {
          boxShadow: "0px 4px 8px rgba(15, 45, 64, 0.05)",
        },
        elevation2: {
          boxShadow: "0px 6px 10px rgba(15, 45, 64, 0.05)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 12,
            transition: "box-shadow 0.2s ease, border-color 0.2s ease",
            "&:hover": {
              boxShadow: "0px 2px 8px rgba(15, 45, 64, 0.06)",
            },
            "&.Mui-focused": {
              boxShadow: "0px 0 0 3px rgba(26, 74, 107, 0.12)",
            },
          },
        },
      },
    },
  },
});

export default theme;
