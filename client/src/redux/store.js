import { createStore, applyMiddleware, combineReducers } from "redux";
import { thunk } from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./reducers/authReducer";
import tripReducer from "./reducers/tripReducer";
import weatherReducer from "./reducers/weatherReducer";
import expenseReducer from "./reducers/expenseReducer";
import translatorReducer from "./reducers/translatorReducer";
import bookingReducer from "./reducers/bookingReducer";
import packingReducer from "./reducers/packingReducer";
import budgetReducer from "./reducers/budgetReducer";
import offlineQueueReducer from "./reducers/offlineQueueReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  trips: tripReducer,
  weather: weatherReducer,
  expenses: expenseReducer,
  translator: translatorReducer,
  booking: bookingReducer,
  packing: packingReducer,
  budget: budgetReducer,
  offlineQueue: offlineQueueReducer,
});

// Only persist the slices needed for offline review + sync.
// Auth/weather/translator are excluded to avoid stale/sensitive cached data.
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["trips", "expenses", "booking", "packing", "budget", "offlineQueue"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(persistedReducer, applyMiddleware(thunk));
export const persistor = persistStore(store);

export default store;
