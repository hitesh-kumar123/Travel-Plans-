import api from "../../services/api";
import { toast } from "react-toastify";
import {
  GET_CURRENT_WEATHER,
  GET_FORECAST,
  WEATHER_ERROR,
  SET_LOADING,
} from "../types/weatherTypes";

export const getCurrentWeather = (location) => async (dispatch) => {
  dispatch({ type: SET_LOADING });
  try {
    const res = await api.get(`/weather/current/${location}`);

    dispatch({
      type: GET_CURRENT_WEATHER,
      payload: res.data,
    });
  } catch (err) {
    const msg = err.response?.data?.msg || "Error fetching current weather";
    dispatch({
      type: WEATHER_ERROR,
      payload: msg,
    });
    toast.error(msg);
  }
};

export const getForecast = (location) => async (dispatch) => {
  dispatch({ type: SET_LOADING });
  try {
    const res = await api.get(`/weather/forecast/${location}`);

    dispatch({
      type: GET_FORECAST,
      payload: res.data,
    });
  } catch (err) {
    const msg = err.response?.data?.msg || "Error fetching forecast";
    dispatch({
      type: WEATHER_ERROR,
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
