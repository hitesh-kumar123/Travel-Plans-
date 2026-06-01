import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";

// Import components
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SharedTripView from "./pages/dashboard/SharedTripView";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import Contact from "./pages/contact"; // ✅ ADDED
import PrivateRoute from "./components/PrivateRoute";
import { loadUser } from "./redux/actions/authActions";

function App() {
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [showScrollToBottom, setShowScrollToBottom] = useState(true);

  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const viewportBottom = scrollPosition + window.innerHeight;
      const pageBottom = document.documentElement.scrollHeight;
      const isNearBottom = viewportBottom >= pageBottom - 200;

      setShowScrollToTop(scrollPosition > 300);
      setShowScrollToBottom(!isNearBottom);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToFooter = () => {
    const footer = document.querySelector("footer");

    if (footer) {
      footer.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
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
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* ✅ Contact Route Added */}
              <Route path="/contact" element={<Contact />} />

              {/* Other Routes */}
              <Route path="/trip/share/:token" element={<SharedTripView />} />
              <Route path="/shared-trip/:token" element={<SharedTripView />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>

            <div className="scroll-fab-group" aria-label="Page scroll controls">
              <button
                type="button"
                className={`scroll-fab scroll-fab-top ${showScrollToTop ? "scroll-fab-visible" : "scroll-fab-hidden"}`}
                onClick={scrollToTop}
                aria-label="Scroll to top"
                tabIndex={showScrollToTop ? 0 : -1}
              >
                <FaArrowUp />
              </button>

              <button
                type="button"
                className={`scroll-fab scroll-fab-bottom ${showScrollToBottom ? "scroll-fab-visible" : "scroll-fab-hidden"}`}
                onClick={scrollToFooter}
                aria-label="Scroll to footer"
                tabIndex={showScrollToBottom ? 0 : -1}
              >
                <FaArrowDown />
              </button>
            </div>
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
    </Provider>
  );
}

export default App;
