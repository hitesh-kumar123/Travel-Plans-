import {
  GET_TRIPS,
  GET_TRIP,
  ADD_TRIP,
  UPDATE_TRIP,
  DELETE_TRIP,
  TRIP_ERROR,
  CLEAR_TRIPS,
  SET_LOADING,
} from "../types/tripTypes";

const initialState = {
  trips: [],
  currentTrip: null,
  loading: false,
  error: null,
};

export default function tripReducer(state = initialState, action) {
  switch (action.type) {
    case SET_LOADING:
      return {
        ...state,
        loading: true,
      };
    case GET_TRIPS:
      return {
        ...state,
        trips: action.payload,
        loading: false,
      };
    case GET_TRIP:
      return {
        ...state,
        currentTrip: action.payload,
        loading: false,
      };
    case ADD_TRIP:
      return {
        ...state,
        trips: [action.payload, ...state.trips],
        loading: false,
      };
    case UPDATE_TRIP:
      return {
        ...state,
        trips: state.trips.map((trip) =>
          trip._id === action.payload._id ? action.payload : trip
        ),
        currentTrip: action.payload,
        loading: false,
      };
    case DELETE_TRIP:
      return {
        ...state,
        trips: state.trips.filter((trip) => trip._id !== action.payload),
        loading: false,
      };
    case TRIP_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case CLEAR_TRIPS:
      return {
        ...state,
        trips: [],
        currentTrip: null,
        loading: false,
      };
    default:
      return state;
  }
}
