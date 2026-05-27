import api, { formatApiError } from "../../services/api";
import { toast } from "react-toastify";
import {
  GET_EXPENSES,
  ADD_EXPENSE,
  DELETE_EXPENSE,
  GET_EXPENSE_SUMMARY,
  EXPENSE_ERROR,
  SET_LOADING,
} from "../types/expenseTypes";

const reportExpenseError = (operation, err, fallbackMessage) => {
  const apiError = formatApiError(err, fallbackMessage);
  console.error(`[expense:${operation}]`, {
    operation,
    message: apiError.message,
    requestId: apiError.requestId,
    status: apiError.status,
    method: apiError.method,
    url: apiError.url,
  });
  return apiError.message;
};

// Get all user expenses (across all trips) — for dashboard analytics
export const getAllUserExpenses = () => async (dispatch) => {
  try {
    const res = await api.get("/expenses");

    dispatch({
      type: "GET_ALL_USER_EXPENSES",
      payload: res.data,
    });
  } catch (err) {
    const msg = reportExpenseError("getAllUserExpenses", err, "Error fetching all expenses");
    dispatch({
      type: EXPENSE_ERROR,
      payload: msg,
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
    const msg = reportExpenseError("getExpenses", err, "Error fetching expenses");
    dispatch({
      type: EXPENSE_ERROR,
      payload: msg,
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
    const msg = reportExpenseError("addExpense", err, "Error adding expense");
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
    const msg = reportExpenseError("deleteExpense", err, "Error deleting expense");
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
    const msg = reportExpenseError("getExpenseSummary", err, "Error fetching expense summary");
    dispatch({
      type: EXPENSE_ERROR,
      payload: msg,
    });
  }
};

export const setLoading = () => {
  return {
    type: SET_LOADING,
  };
};
