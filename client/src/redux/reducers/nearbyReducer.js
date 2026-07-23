import {
  NEARBY_REQUEST_LOCATION,
  NEARBY_LOCATION_SUCCESS,
  NEARBY_LOCATION_DENIED,
  NEARBY_FETCH_SUCCESS,
  NEARBY_FETCH_ERROR,
  NEARBY_RESET,
} from "../types/nearbyTypes";

const initialState = {
  loading: false,
  userLocation: null,
  destinations: [],
  denied: false,
  error: null,
};

export default function nearbyReducer(state = initialState, action) {
  switch (action.type) {
    case NEARBY_REQUEST_LOCATION:
      return {
        ...state,
        loading: true,
        denied: false,
        error: null,
      };

    case NEARBY_LOCATION_SUCCESS:
      return {
        ...state,
        userLocation: action.payload,
      };

    case NEARBY_LOCATION_DENIED:
      return {
        ...state,
        loading: false,
        denied: true,
        error: action.payload,
      };

    case NEARBY_FETCH_SUCCESS:
      return {
        ...state,
        loading: false,
        destinations: action.payload,
        error: null,
      };

    case NEARBY_FETCH_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case NEARBY_RESET:
      return initialState;

    default:
      return state;
  }
}
