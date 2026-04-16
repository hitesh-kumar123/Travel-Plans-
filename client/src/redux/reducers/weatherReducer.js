import {
  GET_CURRENT_WEATHER,
  GET_FORECAST,
  WEATHER_ERROR,
  CLEAR_WEATHER,
  SET_LOADING,
} from "../types/weatherTypes";

const initialState = {
  currentWeather: null,
  forecast: null,
  loading: false,
  error: null,
};

export default function weatherReducer(state = initialState, action) {
  switch (action.type) {
    case SET_LOADING:
      return {
        ...state,
        loading: true,
      };
    case GET_CURRENT_WEATHER:
      return {
        ...state,
        currentWeather: action.payload,
        loading: false,
      };
    case GET_FORECAST:
      return {
        ...state,
        forecast: action.payload,
        loading: false,
      };
    case WEATHER_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case CLEAR_WEATHER:
      return {
        ...state,
        currentWeather: null,
        forecast: null,
        loading: false,
      };
    default:
      return state;
  }
}
