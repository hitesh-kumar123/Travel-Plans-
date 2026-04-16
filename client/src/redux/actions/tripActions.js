import api from "../../services/api";
import { toast } from "react-toastify";
import {
  GET_TRIPS,
  GET_TRIP,
  ADD_TRIP,
  UPDATE_TRIP,
  DELETE_TRIP,
  TRIP_ERROR,
  SET_LOADING,
} from "../types/tripTypes";

// Get all user trips
export const getTrips = () => async (dispatch) => {
  dispatch({ type: SET_LOADING });
  try {
    const res = await api.get("/trips");

    dispatch({
      type: GET_TRIPS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: TRIP_ERROR,
      payload: err.response?.data?.msg || "Error fetching trips",
    });
  }
};

// Get single trip
export const getTrip = (id) => async (dispatch) => {
  dispatch({ type: SET_LOADING });
  try {
    const res = await api.get(`/trips/${id}`);

    dispatch({
      type: GET_TRIP,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: TRIP_ERROR,
      payload: err.response?.data?.msg || "Error fetching trip",
    });
    toast.error("Failed to load trip details");
  }
};

// Add trip
export const addTrip = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/trips", formData);

    dispatch({
      type: ADD_TRIP,
      payload: res.data,
    });
    toast.success(`Trip to ${formData.destination} created! ✈️`);
  } catch (err) {
    const msg = err.response?.data?.msg || "Error adding trip";
    dispatch({
      type: TRIP_ERROR,
      payload: msg,
    });
    toast.error(msg);
  }
};

// Update trip
export const updateTrip = (id, formData) => async (dispatch) => {
  try {
    const res = await api.put(`/trips/${id}`, formData);

    dispatch({
      type: UPDATE_TRIP,
      payload: res.data,
    });
    toast.success("Trip updated successfully! ✏️");
  } catch (err) {
    const msg = err.response?.data?.msg || "Error updating trip";
    dispatch({
      type: TRIP_ERROR,
      payload: msg,
    });
    toast.error(msg);
  }
};

// Delete trip
export const deleteTrip = (id) => async (dispatch) => {
  try {
    await api.delete(`/trips/${id}`);

    dispatch({
      type: DELETE_TRIP,
      payload: id,
    });
    toast.success("Trip deleted 🗑️");
  } catch (err) {
    const msg = err.response?.data?.msg || "Error deleting trip";
    dispatch({
      type: TRIP_ERROR,
      payload: msg,
    });
    toast.error(msg);
  }
};

// Set loading
export const setLoading = () => {
  return {
    type: SET_LOADING,
  };
};
