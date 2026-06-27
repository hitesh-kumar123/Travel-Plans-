import api from "../../services/api";
import {
  FETCH_FORECAST_REQUEST,
  FETCH_FORECAST_SUCCESS,
  FETCH_FORECAST_FAILURE,
  CLEAR_FORECAST,
} from "../types/budgetForecastTypes";

export const fetchBudgetForecast = (tripId) => async (dispatch) => {
  dispatch({ type: FETCH_FORECAST_REQUEST });
  try {
    const { data } = await api.get(`/budget-forecast/${tripId}`);
    dispatch({ type: FETCH_FORECAST_SUCCESS, payload: data });
  } catch (err) {
    dispatch({
      type: FETCH_FORECAST_FAILURE,
      payload: err.response?.data?.message || "Failed to load forecast",
    });
  }
};

export const clearBudgetForecast = () => ({ type: CLEAR_FORECAST });
