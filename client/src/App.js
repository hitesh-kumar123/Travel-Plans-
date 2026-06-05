// src/App.js
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";
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
import Contact from "./pages/contact"; // ✅ ADDED
import PrivateRoute from "./components/PrivateRoute";
import ScrollButtons from "./components/ScrollButtons";
import { loadUser } from "./redux/actions/authActions";
import About from "./pages/About"; // <-- ADD THIS IMPORT

function App() {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

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
              <Route path="/about" element={<About />} />{" "}
              {/* <-- ADD THIS ROUTE */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              {/* ✅ Contact Route Added */}
              <Route path="/contact" element={<Contact />} />
              {/* Other Routes */}
              <Route path="/trip/share/:token" element={<SharedTripView />} />
              <Route path="/shared-trip/:token" element={<SharedTripView />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              {/* Fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
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
    </Provider>
  );
}

export default App;
