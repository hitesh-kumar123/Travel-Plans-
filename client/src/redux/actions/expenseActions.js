import api, { getCurrencyRates } from "../../services/api";
import { toast } from "react-toastify";
import {
  GET_EXPENSES,
  ADD_EXPENSE,
  UPDATE_EXPENSE,
  DELETE_EXPENSE,
  GET_EXPENSE_SUMMARY,
  EXPENSE_ERROR,
  SET_LOADING,
  GET_CURRENCY_RATES,
} from "../types/expenseTypes";

// Get all user expenses (across all trips) — for dashboard analytics
export const getAllUserExpenses = () => async (dispatch) => {
  try {
    const res = await api.get("/expenses");

    dispatch({
      type: "GET_ALL_USER_EXPENSES",
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: EXPENSE_ERROR,
      payload: err.response?.data?.msg || "Error fetching all expenses",
    });
  }
};

// Get expenses for a specific trip
export const getExpenses = (tripId) => async (dispatch) => {
  dispatch({ type: SET_LOADING });
  try {
    const res = await api.get(`/expenses/trip/${tripId}`);

    dispatch({
      type: GET_EXPENSES,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: EXPENSE_ERROR,
      payload: err.response?.data?.msg || "Error fetching expenses",
    });
  }
};

// Add expense
export const addExpense = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/expenses", formData);

    dispatch({
      type: ADD_EXPENSE,
      payload: res.data,
    });
    toast.success("Expense added! 💰");
  } catch (err) {
    const msg = err.response?.data?.msg || "Error adding expense";
    dispatch({
      type: EXPENSE_ERROR,
      payload: msg,
    });
    toast.error(msg);
  }
};

// Delete expense
export const deleteExpense = (id) => async (dispatch) => {
  try {
    await api.delete(`/expenses/${id}`);

    dispatch({
      type: DELETE_EXPENSE,
      payload: id,
    });
    toast.success("Expense deleted 🗑️");
  } catch (err) {
    const msg = err.response?.data?.msg || "Error deleting expense";
    dispatch({
      type: EXPENSE_ERROR,
      payload: msg,
    });
    toast.error(msg);
  }
};

// Get expense summary by category
export const getExpenseSummary = (tripId) => async (dispatch) => {
  try {
    const res = await api.get(`/expenses/summary/${tripId}`);

    dispatch({
      type: GET_EXPENSE_SUMMARY,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: EXPENSE_ERROR,
      payload: err.response?.data?.msg || "Error fetching expense summary",
    });
  }
};

// Update expense
export const updateExpense = (id, formData) => async (dispatch) => {
  try {
    const res = await api.put(`/expenses/${id}`, formData);

    dispatch({
      type: UPDATE_EXPENSE,
      payload: res.data,
    });
    toast.success("Expense updated successfully! 💰");
  } catch (err) {
    const msg = err.response?.data?.msg || "Error updating expense";
    dispatch({
      type: EXPENSE_ERROR,
      payload: msg,
    });
    toast.error(msg);
  }
};

export const fetchCurrencyRates =
  (targetCurrency = "INR") =>
  async (dispatch) => {
    try {
      const res = await getCurrencyRates("INR");
      dispatch({
        type: GET_CURRENCY_RATES,
        payload: { base: targetCurrency, rates: res.data.rates },
      });
    } catch (err) {
      dispatch({
        type: EXPENSE_ERROR,
        payload: err.response?.data?.msg || "Could not fetch exchange rates",
      });
    }
  };
export const setLoading = () => {
  return {
    type: SET_LOADING,
  };
};
