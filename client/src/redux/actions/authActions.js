import api from "../../services/api";
import { toast } from "react-toastify";
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
    await api.post("/auth/register", userData);

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

// Logout User
export const logout = () => (dispatch) => {
  localStorage.removeItem("token");
  dispatch({ type: LOGOUT });
  toast.info("Logged out successfully");
};
