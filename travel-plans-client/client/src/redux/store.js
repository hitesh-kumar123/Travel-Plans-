import { createStore, applyMiddleware, combineReducers } from "redux";
import { thunk } from "redux-thunk";
import authReducer from "./reducers/authReducer";
import tripReducer from "./reducers/tripReducer";
import weatherReducer from "./reducers/weatherReducer";
import expenseReducer from "./reducers/expenseReducer";
import translatorReducer from "./reducers/translatorReducer";
import bookingReducer from "./reducers/bookingReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  trips: tripReducer,
  weather: weatherReducer,
  expenses: expenseReducer,
  translator: translatorReducer,
  booking: bookingReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
