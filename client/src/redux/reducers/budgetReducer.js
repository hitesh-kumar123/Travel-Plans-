import {
  SET_BUDGET_INPUTS,
  RESET_BUDGET,
  SET_BUDGET_RESULT,
  BUDGET_LOADING,
  BUDGET_ERROR,
} from "../types/budgetTypes";
import {
  DAYS_RANGE,
  PAX_RANGE,
  FOOD_RANGE,
  DESTINATION_BASE_RATES,
} from "../../constants/budgetConstants";

const initialState = {
  // Form inputs – persisted across navigation
  inputs: {
    destination: "",
    destinationTier: "standard", // 'budget' | 'standard' | 'premium'
    days: DAYS_RANGE.default,
    travelers: PAX_RANGE.default,
    accommodationType: "standard", // key from ACCOMMODATION_MULTIPLIERS
    transportType: "bus", // key from TRANSPORT_OPTIONS
    foodPerPersonPerDay: FOOD_RANGE.default,
    activityType: "sightseeing", // key from ACTIVITY_OPTIONS
    // Derived from destinationTier – overrideable by backend in v2
    baseAccomRate: DESTINATION_BASE_RATES.standard.accommodation,
  },
  // v2: result from backend endpoint
  serverResult: null,
  loading: false,
  error: null,
};

const budgetReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_BUDGET_INPUTS:
      return {
        ...state,
        inputs: {
          ...state.inputs,
          ...action.payload,
          // When destinationTier changes, update baseAccomRate automatically
          ...(action.payload.destinationTier && {
            baseAccomRate:
              DESTINATION_BASE_RATES[action.payload.destinationTier]
                ?.accommodation ?? state.inputs.baseAccomRate,
          }),
        },
      };

    case BUDGET_LOADING:
      return { ...state, loading: true, error: null };

    case SET_BUDGET_RESULT:
      return { ...state, loading: false, serverResult: action.payload };

    case BUDGET_ERROR:
      return { ...state, loading: false, error: action.payload };

    case RESET_BUDGET:
      return initialState;

    default:
      return state;
  }
};

export default budgetReducer;
