import { createTheme } from "@mui/material/styles";

// theme settings for light mode
const lightTheme = createTheme({
  palette: {
    mode: "light",
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
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700, fontSize: "2.5rem" },
    h2: { fontWeight: 600, fontSize: "2rem" },
    h3: { fontWeight: 600, fontSize: "1.75rem" },
    h4: { fontWeight: 600, fontSize: "1.5rem" },
    h5: { fontWeight: 600, fontSize: "1.25rem" },
    h6: { fontWeight: 600, fontSize: "1rem" },
    button: {
      textTransform: "none",
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "10px 24px",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#7986cb",
      light: "#aab6fe",
      dark: "#49599a",
      contrastText: "#000000",
    },
    secondary: {
      main: "#ff8a65",
      light: "#ffbb93",
      dark: "#c75b39",
      contrastText: "#000000",
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
    text: {
      primary: "#e8eaed",
      secondary: "#a0a7b4",
    },
    success: {
      main: "#5fd88a",
    },
    error: {
      main: "#f97575",
    },
    warning: {
      main: "#f6a75a",
    },
    info: {
      main: "#5eb0f0",
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700, fontSize: "2.5rem" },
    h2: { fontWeight: 600, fontSize: "2rem" },
    h3: { fontWeight: 600, fontSize: "1.75rem" },
    h4: { fontWeight: 600, fontSize: "1.5rem" },
    h5: { fontWeight: 600, fontSize: "1.25rem" },
    h6: { fontWeight: 600, fontSize: "1rem" },
    button: {
      textTransform: "none",
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "10px 24px",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

export function getTheme(darkMode) {
  if (darkMode) {
    return darkTheme;
  } else {
    return lightTheme;
  }
}

export default lightTheme;
