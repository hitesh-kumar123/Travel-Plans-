import {
  PACKING_FETCH_REQUEST,
  PACKING_FETCH_SUCCESS,
  PACKING_FETCH_FAIL,
  PACKING_UPDATE_SUCCESS,
  PACKING_UPDATE_FAIL,
} from "../types/packingTypes";

const initialState = {
  loading: false,
  list: null, // { _id, trip, user, items: [...] }
  error: null,
};

const packingReducer = (state = initialState, action) => {
  switch (action.type) {
    case PACKING_FETCH_REQUEST:
      return { ...state, loading: true, error: null };

    case PACKING_FETCH_SUCCESS:
    case PACKING_UPDATE_SUCCESS:
      return { ...state, loading: false, list: action.payload, error: null };

    case PACKING_FETCH_FAIL:
    case PACKING_UPDATE_FAIL:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default packingReducer;
