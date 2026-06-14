import {
  SEARCH_FLIGHTS,
  SEARCH_HOTELS,
  BOOK_FLIGHT,
  BOOK_HOTEL,
  BOOKING_ERROR,
  CLEAR_FLIGHT_RESULTS,
  CLEAR_HOTEL_RESULTS,
  SET_LOADING,
} from "../types/bookingTypes";

const initialState = {
  flights: [],
  hotels: [],
  flightBooking: null,
  hotelBooking: null,
  loading: false,
  error: null,
};

export default function bookingReducer(state = initialState, action) {
  switch (action.type) {
    case SET_LOADING:
      return {
        ...state,
        loading: true,
      };
    case SEARCH_FLIGHTS:
      return {
        ...state,
        flights: action.payload,
        loading: false,
      };
    case SEARCH_HOTELS:
      return {
        ...state,
        hotels: action.payload,
        loading: false,
      };
    case BOOK_FLIGHT:
      return {
        ...state,
        flightBooking: action.payload,
        loading: false,
      };
    case BOOK_HOTEL:
      return {
        ...state,
        hotelBooking: action.payload,
        loading: false,
      };
    case BOOKING_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case CLEAR_FLIGHT_RESULTS:
      return {
        ...state,
        flights: [],
        flightBooking: null,
        loading: false,
      };
    case CLEAR_HOTEL_RESULTS:
      return {
        ...state,
        hotels: [],
        hotelBooking: null,
        loading: false,
      };
    default:
      return state;
  }
}
