import api from "../../services/api";
import { toast } from "react-toastify";
import {
  SEARCH_FLIGHTS,
  SEARCH_HOTELS,
  BOOK_FLIGHT,
  BOOK_HOTEL,
  BOOKING_ERROR,
  SET_LOADING,
} from "../types/bookingTypes";

export const searchFlights = (formData) => async (dispatch) => {
  dispatch({ type: SET_LOADING });
  try {
    const res = await api.post("/booking/flights/search", formData);

    dispatch({
      type: SEARCH_FLIGHTS,
      payload: res.data.flights,
    });
    toast.success(`Found ${res.data.flights?.length || 0} flights! ✈️`);
  } catch (err) {
    const msg = err.response?.data?.msg || "Error searching flights";
    dispatch({
      type: BOOKING_ERROR,
      payload: msg,
    });
    toast.error(msg);
  }
};

export const searchHotels = (formData) => async (dispatch) => {
  dispatch({ type: SET_LOADING });
  try {
    const res = await api.post("/booking/hotels/search", formData);

    dispatch({
      type: SEARCH_HOTELS,
      payload: res.data.hotels,
    });
    toast.success(`Found ${res.data.hotels?.length || 0} hotels! 🏨`);
  } catch (err) {
    const msg = err.response?.data?.msg || "Error searching hotels";
    dispatch({
      type: BOOKING_ERROR,
      payload: msg,
    });
    toast.error(msg);
  }
};

export const bookFlight = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/booking/flights/book", formData);

    dispatch({
      type: BOOK_FLIGHT,
      payload: res.data,
    });
    toast.success("Flight booked successfully! 🎉");
  } catch (err) {
    const msg = err.response?.data?.msg || "Error booking flight";
    dispatch({
      type: BOOKING_ERROR,
      payload: msg,
    });
    toast.error(msg);
  }
};

export const bookHotel = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/booking/hotels/book", formData);

    dispatch({
      type: BOOK_HOTEL,
      payload: res.data,
    });
    toast.success("Hotel booked successfully! 🎉");
  } catch (err) {
    const msg = err.response?.data?.msg || "Error booking hotel";
    dispatch({
      type: BOOKING_ERROR,
      payload: msg,
    });
    toast.error(msg);
  }
};

export const setLoading = () => {
  return {
    type: SET_LOADING,
  };
};
