import api, { formatApiError } from "../../services/api";
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

const reportTripError = (operation, err, fallbackMessage) => {
  const apiError = formatApiError(err, fallbackMessage);
  console.error(`[trip:${operation}]`, {
    operation,
    message: apiError.message,
    requestId: apiError.requestId,
    status: apiError.status,
    method: apiError.method,
    url: apiError.url,
  });
  return apiError.message;
};

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
    const msg = reportTripError("getTrips", err, "Error fetching trips");
    dispatch({
      type: TRIP_ERROR,
      payload: msg,
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
    const msg = reportTripError("getTrip", err, "Error fetching trip");
    dispatch({
      type: TRIP_ERROR,
      payload: msg,
    });
    toast.error(msg);
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
    return res.data;
  } catch (err) {
    const msg = reportTripError("addTrip", err, "Error adding trip");
    dispatch({
      type: TRIP_ERROR,
      payload: msg,
    });
    toast.error(msg);
    return null;
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
    const msg = reportTripError("updateTrip", err, "Error updating trip");
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
    const msg = reportTripError("deleteTrip", err, "Error deleting trip");
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

// Generate shareable link
export const shareTrip = (id) => async () => {
  try {
    const res = await api.post(`/trips/${id}/share`);
    toast.success("Shareable link generated! 🔗");
    return res.data.shareToken;
  } catch (err) {
    const msg = reportTripError("shareTrip", err, "Failed to generate share link");
    toast.error(msg);
    return null;
  }
};
