import {
  FETCH_FORECAST_REQUEST,
  FETCH_FORECAST_SUCCESS,
  FETCH_FORECAST_FAILURE,
  CLEAR_FORECAST,
} from "../types/budgetForecastTypes";

const init = { loading: false, data: null, error: null };

export default function budgetForecastReducer(state = init, action) {
  switch (action.type) {
    case FETCH_FORECAST_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_FORECAST_SUCCESS:
      return { loading: false, data: action.payload, error: null };
    case FETCH_FORECAST_FAILURE:
      return { loading: false, data: null, error: action.payload };
    case CLEAR_FORECAST:
      return init;
    default:
      return state;
  }
}
