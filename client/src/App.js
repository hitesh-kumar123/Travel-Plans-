import React, { useEffect, useMemo } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import getTheme from "./theme";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeModeProvider, useThemeMode } from "./context/ThemeContext";

// Import components
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyOtp from "./pages/VerifyOtp";
import NotFound from "./pages/NotFound";
import PrivateRoute from "./components/PrivateRoute";
import { loadUser } from "./redux/actions/authActions";

function ThemedApp() {
  const { mode } = useThemeMode();
  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/dashboard/*"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

function App() {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <ThemeModeProvider>
        <ThemedApp />
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
        />
      </ThemeModeProvider>
    </Provider>
  );
}

export default App;
