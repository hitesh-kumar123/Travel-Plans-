import api from "../../services/api";
import { toast } from "react-toastify";

// Action Types
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAIL = "LOGIN_FAIL";
export const REGISTER_SUCCESS = "REGISTER_SUCCESS";
export const REGISTER_FAIL = "REGISTER_FAIL";
export const USER_LOADED = "USER_LOADED";
export const AUTH_ERROR = "AUTH_ERROR";
export const LOGOUT = "LOGOUT";

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
export const login = (userData) => async (dispatch) => {
  try {
    const res = await api.post("/auth/login", userData);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data, // res.data will contain the token
    });
    
    // Set token to local storage
    localStorage.setItem("token", res.data.token);

    dispatch(loadUser());
    toast.success("Welcome back! 🎉");
  } catch (error) {
    const msg = error.response?.data?.msg || "Login failed";
    dispatch({
      type: LOGIN_FAIL,
      payload: msg,
    });
    toast.error(msg);
  }
};

// Register User
export const register = (userData) => async (dispatch) => {
  try {
    const res = await api.post("/auth/register", userData);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    });
    
    // Set token to local storage
    localStorage.setItem("token", res.data.token);

    dispatch(loadUser());
    toast.success("Account created successfully! 🚀");
  } catch (error) {
    const msg = error.response?.data?.msg || "Registration failed";
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
