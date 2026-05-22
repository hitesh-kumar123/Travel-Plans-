import api from "../../services/api";
import {
  PACKING_FETCH_REQUEST,
  PACKING_FETCH_SUCCESS,
  PACKING_FETCH_FAIL,
  PACKING_UPDATE_SUCCESS,
  PACKING_UPDATE_FAIL,
} from "../types/packingTypes";

// Fetch (or auto-create) the packing list for a trip
export const fetchPackingList = (tripId) => async (dispatch) => {
  dispatch({ type: PACKING_FETCH_REQUEST });
  try {
    const { data } = await api.get(`/packing/${tripId}`);
    dispatch({ type: PACKING_FETCH_SUCCESS, payload: data });
  } catch (err) {
    dispatch({
      type: PACKING_FETCH_FAIL,
      payload: err.response?.data?.message || err.message,
    });
  }
};

// Add a new item
export const addPackingItem = (tripId, name, category) => async (dispatch) => {
  try {
    const { data } = await api.post(`/packing/${tripId}/items`, {
      name,
      category,
    });
    dispatch({ type: PACKING_UPDATE_SUCCESS, payload: data });
  } catch (err) {
    dispatch({
      type: PACKING_UPDATE_FAIL,
      payload: err.response?.data?.message || err.message,
    });
  }
};

// Toggle packed status
export const togglePackingItem = (tripId, itemId) => async (dispatch) => {
  try {
    const { data } = await api.patch(`/packing/${tripId}/items/${itemId}`);
    dispatch({ type: PACKING_UPDATE_SUCCESS, payload: data });
  } catch (err) {
    dispatch({
      type: PACKING_UPDATE_FAIL,
      payload: err.response?.data?.message || err.message,
    });
  }
};

// Delete an item
export const deletePackingItem = (tripId, itemId) => async (dispatch) => {
  try {
    const { data } = await api.delete(`/packing/${tripId}/items/${itemId}`);
    dispatch({ type: PACKING_UPDATE_SUCCESS, payload: data });
  } catch (err) {
    dispatch({
      type: PACKING_UPDATE_FAIL,
      payload: err.response?.data?.message || err.message,
    });
  }
};

// Apply a preset template ("beach" | "business" | "camping")
export const applyTemplate = (tripId, template) => async (dispatch) => {
  try {
    const { data } = await api.post(`/packing/${tripId}/template`, {
      template,
    });
    dispatch({ type: PACKING_UPDATE_SUCCESS, payload: data });
  } catch (err) {
    dispatch({
      type: PACKING_UPDATE_FAIL,
      payload: err.response?.data?.message || err.message,
    });
  }
};

// Clear all items
export const clearPackingList = (tripId) => async (dispatch) => {
  try {
    const { data } = await api.delete(`/packing/${tripId}/items`);
    dispatch({ type: PACKING_UPDATE_SUCCESS, payload: data });
  } catch (err) {
    dispatch({
      type: PACKING_UPDATE_FAIL,
      payload: err.response?.data?.message || err.message,
    });
  }
};
