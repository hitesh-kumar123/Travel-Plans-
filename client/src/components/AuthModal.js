import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, register } from "../redux/actions/authActions";
import "../pages/Auth.css";

const AuthModal = ({ isOpen, onClose, initialMode = "login" }) => {
  const [mode, setMode] = useState(initialMode); // 'login', 'register', 'otp', 'forgot'
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [showPassword, setShowPassword] = useState(false);
  const [isResetSent, setIsResetSent] = useState(false);

  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  // Sync mode with initialMode when modal opens
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setOtp(["", "", "", ""]);
      // Optional: Clear form data on close/open if desired
      // setFormData({ firstName: "", lastName: "", email: "", password: "" });
    }
  }, [isOpen, initialMode]);

  useEffect(() => {
    if (isAuthenticated && isOpen) {
      onClose();
    }
  }, [isAuthenticated, isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === "login") {
      dispatch(login({ email: formData.email, password: formData.password }));
    } else if (mode === "register") {
      setMode("otp");
    } else if (mode === "otp") {
      dispatch(
        register({
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          password: formData.password,
          otp: otp.join(""),
        }),
      );
    } else if (mode === "forgot") {
      setIsResetSent(true);
      // Logic for sending reset email would go here
    }
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div
        className="auth-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="auth-modal-close" onClick={onClose}>
          &times;
        </button>

        {/* Left Visual Side (Hidden on Mobile) */}
        <div className="auth-visual">
          <img
            src={
              mode === "login" || mode === "forgot"
                ? "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop"
                : "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop"
            }
            alt="Adventure"
            className="auth-visual-img"
          />
          <div className="auth-visual-overlay" />
          <div className="auth-logo">PackGo</div>

          <div className="auth-visual-content">
            <h2 className="auth-visual-tagline">
              {mode === "login"
                ? "Welcome back!"
                : mode === "register"
                  ? "Join the journey."
                  : mode === "forgot"
                    ? "Don't worry,"
                    : "Verify OTP"}
            </h2>
            <p className="auth-visual-sub">
              {mode === "login"
                ? "Your next great adventure is just one sign-in away."
                : mode === "register"
                  ? "Create an account to start planning your dream trips today."
                  : mode === "forgot"
                    ? "We'll help you get back to your travel plans in no time."
                    : "Create an account to start planning your dream trips today."}
            </p>
          </div>
        </div>

        {/* Right Form Side */}
        <div className="auth-form-side">
          <div className="auth-form-container">
            <div className="auth-header">
              <h1>
                {mode === "login"
                  ? "Sign In"
                  : mode === "register"
                    ? "Create Account"
                    : mode === "forgot"
                      ? "Forgot Password"
                      : "Verify OTP"}
              </h1>
              <p>
                {mode === "login"
                  ? "Enter your details below"
                  : mode === "register"
                    ? "Join our global community"
                    : mode === "forgot"
                      ? isResetSent
                        ? "Check your email for reset instructions"
                        : "Enter your email to recover your account"
                      : `We've sent a code to ${formData.email}`}
              </p>
            </div>

            {mode !== "otp" && mode !== "forgot" && (
              <div className="auth-social-row">
                <button className="social-btn">
                  <img
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                    alt="Google"
                    width="18"
                  />
                  Google
                </button>
                <button className="social-btn">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="#1877F2"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </button>
              </div>
            )}

            {mode !== "otp" && mode !== "forgot" && (
              <div className="auth-divider">OR USE EMAIL</div>
            )}

            {!isResetSent && (
              <form onSubmit={handleSubmit}>
                {mode === "register" && (
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <div className="auth-field" style={{ flex: 1 }}>
                      <input
                        type="text"
                        name="firstName"
                        className="auth-input"
                        placeholder=" "
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                      />
                      <label className="auth-label">First Name</label>
                    </div>
                    <div className="auth-field" style={{ flex: 1 }}>
                      <input
                        type="text"
                        name="lastName"
                        className="auth-input"
                        placeholder=" "
                        required
                        value={formData.lastName}
                        onChange={handleChange}
                      />
                      <label className="auth-label">Last Name</label>
                    </div>
                  </div>
                )}

                {(mode === "login" ||
                  mode === "register" ||
                  mode === "forgot") && (
                  <div className="auth-field">
                    <input
                      type="email"
                      name="email"
                      className="auth-input"
                      placeholder=" "
                      required
                      value={formData.email}
                      onChange={handleChange}
                    />
                    <label className="auth-label">Email Address</label>
                  </div>
                )}

                {(mode === "login" || mode === "register") && (
                  <div className="auth-field">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      className="auth-input"
                      placeholder=" "
                      required
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <label className="auth-label">Password</label>
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "HIDE" : "SHOW"}
                    </button>
                  </div>
                )}

                {mode === "login" && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "-0.5rem",
                      marginBottom: "1.5rem",
                    }}
                  >
                    <span
                      onClick={() => setMode("register")}
                      className="auth-toggle-link"
                      style={{ fontSize: "0.85rem" }}
                    >
                      Create Account
                    </span>
                    <span
                      onClick={() => setMode("forgot")}
                      className="auth-toggle-link"
                      style={{ fontSize: "0.85rem" }}
                    >
                      Forgot Password?
                    </span>
                  </div>
                )}

                {mode === "otp" && (
                  <div className="otp-container">
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`otp-${idx}`}
                        type="text"
                        maxLength="1"
                        className="otp-input"
                        value={digit}
                        onChange={(e) => handleOtpChange(e.target.value, idx)}
                        onKeyDown={(e) => {
                          if (e.key === "Backspace" && !otp[idx] && idx > 0) {
                            document.getElementById(`otp-${idx - 1}`).focus();
                          }
                        }}
                      />
                    ))}
                  </div>
                )}

                <button
                  type="submit"
                  className="auth-submit-btn"
                  disabled={loading}
                >
                  {loading
                    ? "Processing..."
                    : mode === "login"
                      ? "Sign In"
                      : mode === "register"
                        ? "Create Account"
                        : mode === "forgot"
                          ? "Send Reset Link"
                          : "Verify Code"}
                </button>
              </form>
            )}

            {isResetSent && (
              <button
                className="auth-submit-btn"
                onClick={() => {
                  setIsResetSent(false);
                  setMode("login");
                }}
              >
                Back to Login
              </button>
            )}

            <div className="auth-footer">
              {mode === "login" ? null : mode === "register" ? (
                <>
                  Already have an account?{" "}
                  <span
                    onClick={() => setMode("login")}
                    className="auth-toggle-link"
                  >
                    Sign In
                  </span>
                </>
              ) : mode === "forgot" ? (
                <>
                  Remembered your password?{" "}
                  <span
                    onClick={() => setMode("login")}
                    className="auth-toggle-link"
                  >
                    Sign In
                  </span>
                </>
              ) : (
                <>
                  Didn't receive a code?{" "}
                  <span className="auth-toggle-link">Resend Code</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
