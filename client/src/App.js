// src/App.js
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./redux/store";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { getTheme } from "./theme";
import ThemeProvider, { useTheme } from "./contexts/ThemeModeContext";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Import components
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SharedTripView from "./pages/dashboard/SharedTripView";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import Contact from "./pages/contact"; //
import TermsConditions from "./pages/TermsConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import HelpCenter from "./pages/HelpCenter";
import PrivateRoute from "./components/PrivateRoute";
import ScrollButtons from "./components/ScrollButtons";
import ScrollToTop from "./components/ScrollToTop";
import { loadUser } from "./redux/actions/authActions";
import { flushOfflineQueue } from "./redux/actions/offlineQueueActions";
import About from "./pages/About";
import TravelChecklist from "./components/TravelChecklist";
import EmailVerification from "./pages/EmailVerification";

if (process.env.NODE_ENV === "development") {
  window.store = store;
}

function AppContent() {
  const { darkMode } = useTheme();
  const theme = getTheme(darkMode);

  useEffect(() => {
    store.dispatch(loadUser());

    if (navigator.onLine) {
      store.dispatch(flushOfflineQueue());
    }

    const handleOnline = () => {
      store.dispatch(flushOfflineQueue());
    };
    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <MuiThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <ScrollToTop />
            <div className="App">
              <Routes>
                {/* Protected Dashboard */}
                <Route
                  path="/dashboard/*"
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  }
                />
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/travel-checklist" element={<TravelChecklist />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                {/* Contact Route Added */}
                <Route path="/contact" element={<Contact />} />
                <Route path="/terms" element={<TermsConditions />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/help" element={<HelpCenter />} />
                <Route path="/verify-email" element={<EmailVerification />} />
                {/* Other Routes */}
                <Route path="/trip/share/:token" element={<SharedTripView />} />
                <Route
                  path="/shared-trip/:token"
                  element={<SharedTripView />}
                />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route
                  path="/reset-password/:token"
                  element={<ResetPassword />}
                />
                {/* Fallback */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <ScrollButtons />
            </div>
          </Router>
        </MuiThemeProvider>
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
        />
      </PersistGate>
    </Provider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
