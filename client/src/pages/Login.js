import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/actions/authActions";
import "./Auth.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  return (
    <div className="auth-page">
      {/* Left Visual Side */}
      <div className="auth-visual">
        <img 
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop" 
          alt="Adventure" 
          className="auth-visual-img" 
        />
        <div className="auth-visual-overlay" />
        <div className="auth-logo">PackGo</div>
        
        <div className="auth-visual-content">
          <h2 className="auth-visual-tagline">
            Collect moments,<br />not things.
          </h2>
          <p className="auth-visual-sub">
            Join thousands of travelers who have already discovered their next 
            great adventure with PackGo's curated experiences.
          </p>
        </div>
      </div>

      {/* Right Form Side */}
      <div className="auth-form-side">
        <div className="auth-form-container">
          <div className="auth-header">
            <h1>Welcome Back</h1>
            <p>Enter your details to access your account</p>
          </div>

          {/* Social Auth */}
          <div className="auth-social-row">
            <button className="social-btn">
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width="18" />
              Google
            </button>
            <button className="social-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </button>
          </div>

          <div className="auth-divider">OR CONTINUE WITH EMAIL</div>

          <form onSubmit={handleSubmit}>
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
                style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '1.2rem',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#999',
                  fontSize: '0.8rem',
                  fontWeight: '700'
                }}
              >
                {showPassword ? "HIDE" : "SHOW"}
              </button>
            </div>

            <div className="auth-options">
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" style={{ accentColor: '#ff385c' }} />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" title="Forgot Password" className="forgot-link">Forgot Password?</Link>
            </div>

            <button type="submit" className="auth-submit-btn">
              Sign In
            </button>
          </form>

          <div className="auth-footer">
            Don't have an account? <Link to="/register">Create Account</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
