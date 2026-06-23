import { createStore, applyMiddleware, combineReducers } from "redux";
import { thunk } from "redux-thunk";
import authReducer from "./reducers/authReducer";
import tripReducer from "./reducers/tripReducer";
import weatherReducer from "./reducers/weatherReducer";
import expenseReducer from "./reducers/expenseReducer";
import translatorReducer from "./reducers/translatorReducer";
import bookingReducer from "./reducers/bookingReducer";
import packingReducer from "./reducers/packingReducer";
import budgetReducer from "./reducers/budgetReducer";
import budgetForecastReducer from "./reducers/budgetForecastReducer";
const rootReducer = combineReducers({
  auth: authReducer,
  trips: tripReducer,
  weather: weatherReducer,
  expenses: expenseReducer,
  translator: translatorReducer,
  booking: bookingReducer,
  packing: packingReducer,
  budget: budgetReducer,
  budgetForecast: budgetForecastReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

const rootReducer = combineReducers({
  auth: authReducer,
  trips: tripsReducer,
  expenses: expensesReducer,
  // ... other existing reducers ...
  budgetForecast: budgetForecastReducer, // ← ADD
});

export default store;
