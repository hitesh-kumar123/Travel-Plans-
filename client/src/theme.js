import { createTheme } from "@mui/material/styles";

const getTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      ...(mode === "light"
        ? {
            primary: {
              main: "#3f51b5",
              light: "#757de8",
              dark: "#002984",
              contrastText: "#ffffff",
            },
            secondary: {
              main: "#ff6e40",
              light: "#ffa06d",
              dark: "#c53d13",
              contrastText: "#ffffff",
            },
            background: {
              default: "#f5f7fa",
              paper: "#ffffff",
            },
            text: {
              primary: "#2d3748",
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
          }
        : {
            primary: {
              main: "#7986cb",
              light: "#aab6fb",
              dark: "#49599a",
              contrastText: "#ffffff",
            },
            secondary: {
              main: "#ff8a65",
              light: "#ffbb93",
              dark: "#c75b39",
              contrastText: "#ffffff",
            },
            background: {
              default: "#0f1923",
              paper: "#1a2535",
            },
            text: {
              primary: "#e8eaf0",
              secondary: "#9eafc2",
            },
            divider: "rgba(255,255,255,0.08)",
            success: {
              main: "#68d391",
            },
            error: {
              main: "#fc8181",
            },
            warning: {
              main: "#f6ad55",
            },
            info: {
              main: "#63b3ed",
            },
          }),
    },
    typography: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 700,
        fontSize: "2.5rem",
      },
      h2: {
        fontWeight: 600,
        fontSize: "2rem",
      },
      h3: {
        fontWeight: 600,
        fontSize: "1.75rem",
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
      borderRadius: 8,
    },
    shadows:
      mode === "light"
        ? [
            "none",
            "0px 2px 4px rgba(0, 0, 0, 0.05)",
            "0px 4px 6px rgba(0, 0, 0, 0.05)",
            "0px 6px 8px rgba(0, 0, 0, 0.05)",
            "0px 8px 12px rgba(0, 0, 0, 0.05)",
            "0px 10px 14px rgba(0, 0, 0, 0.05)",
            "0px 12px 16px rgba(0, 0, 0, 0.05)",
            "0px 14px 18px rgba(0, 0, 0, 0.05)",
            "0px 16px 20px rgba(0, 0, 0, 0.05)",
            "0px 18px 22px rgba(0, 0, 0, 0.05)",
            "0px 20px 24px rgba(0, 0, 0, 0.05)",
            "0px 22px 26px rgba(0, 0, 0, 0.05)",
            "0px 24px 28px rgba(0, 0, 0, 0.05)",
            "0px 26px 30px rgba(0, 0, 0, 0.05)",
            "0px 28px 32px rgba(0, 0, 0, 0.05)",
            "0px 30px 34px rgba(0, 0, 0, 0.05)",
            "0px 32px 36px rgba(0, 0, 0, 0.05)",
            "0px 34px 38px rgba(0, 0, 0, 0.05)",
            "0px 36px 40px rgba(0, 0, 0, 0.05)",
            "0px 38px 42px rgba(0, 0, 0, 0.05)",
            "0px 40px 44px rgba(0, 0, 0, 0.05)",
            "0px 42px 46px rgba(0, 0, 0, 0.05)",
            "0px 44px 48px rgba(0, 0, 0, 0.05)",
            "0px 46px 50px rgba(0, 0, 0, 0.05)",
            "0px 48px 52px rgba(0, 0, 0, 0.05)",
          ]
        : [
            "none",
            "0px 2px 4px rgba(0, 0, 0, 0.4)",
            "0px 4px 6px rgba(0, 0, 0, 0.4)",
            "0px 6px 8px rgba(0, 0, 0, 0.4)",
            "0px 8px 12px rgba(0, 0, 0, 0.4)",
            "0px 10px 14px rgba(0, 0, 0, 0.4)",
            "0px 12px 16px rgba(0, 0, 0, 0.4)",
            "0px 14px 18px rgba(0, 0, 0, 0.4)",
            "0px 16px 20px rgba(0, 0, 0, 0.4)",
            "0px 18px 22px rgba(0, 0, 0, 0.4)",
            "0px 20px 24px rgba(0, 0, 0, 0.4)",
            "0px 22px 26px rgba(0, 0, 0, 0.4)",
            "0px 24px 28px rgba(0, 0, 0, 0.4)",
            "0px 26px 30px rgba(0, 0, 0, 0.4)",
            "0px 28px 32px rgba(0, 0, 0, 0.4)",
            "0px 30px 34px rgba(0, 0, 0, 0.4)",
            "0px 32px 36px rgba(0, 0, 0, 0.4)",
            "0px 34px 38px rgba(0, 0, 0, 0.4)",
            "0px 36px 40px rgba(0, 0, 0, 0.4)",
            "0px 38px 42px rgba(0, 0, 0, 0.4)",
            "0px 40px 44px rgba(0, 0, 0, 0.4)",
            "0px 42px 46px rgba(0, 0, 0, 0.4)",
            "0px 44px 48px rgba(0, 0, 0, 0.4)",
            "0px 46px 50px rgba(0, 0, 0, 0.4)",
            "0px 48px 52px rgba(0, 0, 0, 0.4)",
          ],
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: "10px 24px",
          },
          contained: {
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            "&:hover": {
              boxShadow: "0px 6px 8px rgba(0, 0, 0, 0.15)",
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow:
              mode === "light"
                ? "0px 8px 12px rgba(0, 0, 0, 0.05)"
                : "0px 8px 12px rgba(0, 0, 0, 0.4)",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          rounded: {
            borderRadius: 12,
          },
          elevation1: {
            boxShadow:
              mode === "light"
                ? "0px 4px 8px rgba(0, 0, 0, 0.05)"
                : "0px 4px 8px rgba(0, 0, 0, 0.4)",
          },
          elevation2: {
            boxShadow:
              mode === "light"
                ? "0px 6px 10px rgba(0, 0, 0, 0.05)"
                : "0px 6px 10px rgba(0, 0, 0, 0.4)",
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: 8,
            },
          },
        },
      },
    },
  });

export default getTheme;
