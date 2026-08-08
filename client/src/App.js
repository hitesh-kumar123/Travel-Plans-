// src/App.js
import React, { useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./redux/store";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoute from "./components/PrivateRoute";
import ScrollButtons from "./components/ScrollButtons";
import ScrollToTop from "./components/ScrollToTop";
import { loadUser } from "./redux/actions/authActions";
import { flushOfflineQueue } from "./redux/actions/offlineQueueActions";

// ── Code-split all pages with React.lazy ───────────────────────
// Each page loads its own JS chunk only when the route is visited.
// This dramatically reduces the initial bundle size and improves TTI/LCP.
const Home = lazy(() => import("./pages/Home"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const SharedTripView = lazy(() => import("./pages/dashboard/SharedTripView"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Contact = lazy(() => import("./pages/contact"));
const TermsConditions = lazy(() => import("./pages/TermsConditions"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const HelpCenter = lazy(() => import("./pages/HelpCenter"));
const About = lazy(() => import("./pages/About"));
const TravelChecklist = lazy(() => import("./components/TravelChecklist"));
const EmailVerification = lazy(() => import("./pages/EmailVerification"));

// Minimal full-page loading fallback – no layout shift, no jank
const PageLoader = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      background: "#fdfaf5",
    }}
  >
    <div
      style={{
        width: 40,
        height: 40,
        border: "3px solid #e8735a",
        borderTop: "3px solid transparent",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }}
    />
    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
  </div>
);

if (process.env.NODE_ENV === "development") {
  window.store = store;
}

function App() {
  useEffect(() => {
    store.dispatch(loadUser());

    // Flush any items queued from a previous session if we're already online.
    if (navigator.onLine) {
      store.dispatch(flushOfflineQueue());
    }

    // Background re-sync: once connectivity returns, flush queued
    // offline mutations back to the backend in order.
    const handleOnline = () => {
      store.dispatch(flushOfflineQueue());
    };
    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <ScrollToTop />
            <div className="App">
              <Suspense fallback={<PageLoader />}>
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
                  <Route
                    path="/travel-checklist"
                    element={<TravelChecklist />}
                  />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  {/* ✅ Contact Route Added */}
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/terms" element={<TermsConditions />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/help" element={<HelpCenter />} />
                  <Route path="/verify-email" element={<EmailVerification />} />
                  {/* Other Routes */}
                  <Route
                    path="/trip/share/:token"
                    element={<SharedTripView />}
                  />
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
              </Suspense>
              <ScrollButtons />
            </div>
          </Router>
        </ThemeProvider>
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
export default App;
