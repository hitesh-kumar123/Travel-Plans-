import api from "../../services/api";
import { toast } from "react-toastify";
import { trackEvent } from "../../services/analytics";
import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGOUT,
} from "../types/authTypes";

function getAuthErrorMessage(error, fallback) {
  if (error.response?.data?.msg) {
    return error.response.data.msg;
  }

  if (!error.response) {
    return "Cannot reach the server. Start the backend with: cd server && npm run dev";
  }

  return fallback;
}

// Load User
export const loadUser = () => async (dispatch) => {
  const token = localStorage.getItem("token");
  if (!token) {
    dispatch({ type: AUTH_ERROR });
    return;
  }

  try {
    const res = await api.get("/auth/profile");

    console.log("loadUser response:", res);
    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

// Login User
export const login = (userData, navigate) => async (dispatch) => {
  try {
    const res = await api.post("/auth/login", userData);

    localStorage.setItem("token", res.data.token);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });

    dispatch({
      type: USER_LOADED,
      payload: res.data.user,
    });

    trackEvent("user_login", res.data.user?._id || res.data.user?.email, {
      method: "email",
    });

    toast.success("Welcome back! 🎉");
    if (navigate) {
      navigate("/dashboard");
    }
  } catch (error) {
    const msg = getAuthErrorMessage(error, "Login failed");
    dispatch({
      type: LOGIN_FAIL,
      payload: msg,
    });
    toast.error(msg);
  }
};

// Register User
export const register = (userData, navigate) => async (dispatch) => {
  try {
    const res = await api.post("/auth/register", userData);

    trackEvent("user_register", res.data?.user?._id || null, {
      email: userData.email,
    });

    toast.success("Account created successfully! Please log in.");
    navigate("/login");
  } catch (error) {
    const msg = getAuthErrorMessage(error, "Registration failed");
    dispatch({
      type: REGISTER_FAIL,
      payload: msg,
    });
    toast.error(msg);
  }
};

//  for google login
export const googleLogin =
  (CredentialResponse, navigate) => async (dispatch) => {
    try {
      dispatch({ type: "AUTH_START" });
      const res = await api.post("/auth/google", {
        credential: CredentialResponse.credential,
      });

      dispatch({
        type: "AUTH_SUCESS",
        payload: res.data,
      });

      // Set token to local storage
      localStorage.setItem("token", res.data.token);

      dispatch(loadUser());

      trackEvent("user_login", res.data?.user?._id || null, {
        method: "google",
      });

      toast.success("Welcome back! 🎉");

      navigate("/dashboard");
    } catch (e) {
      dispatch({
        type: "AUTH_FAIL",
        payload: e.response?.data?.message || e.message,
      });
    }
  };

// Logout User
export const logout = () => (dispatch) => {
  trackEvent("user_logout");
  localStorage.removeItem("token");
  dispatch({ type: LOGOUT });
  toast.info("Logged out successfully");
};
