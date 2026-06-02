import {
  SET_BUDGET_INPUTS,
  RESET_BUDGET,
  SET_BUDGET_RESULT,
  BUDGET_LOADING,
  BUDGET_ERROR,
} from "../types/budgetTypes";
import api from "../../services/api";

// ─── Sync action ─────────────────────────────────────────────────────────────
// Updates form inputs in Redux so state persists across navigation.
export const setBudgetInputs = (inputs) => ({
  type: SET_BUDGET_INPUTS,
  payload: inputs,
});

export const resetBudget = () => ({ type: RESET_BUDGET });

// ─── Async action (v2 – backend route) ───────────────────────────────────────
// Calls GET /api/budget/estimate to get destination-specific base rates.
// In v1 the frontend calculates everything locally; this action is optional.
export const fetchBudgetEstimate = (params) => async (dispatch) => {
  dispatch({ type: BUDGET_LOADING });
  try {
    const { data } = await api.get("/budget/estimate", { params });
    dispatch({ type: SET_BUDGET_RESULT, payload: data });
  } catch (error) {
    dispatch({
      type: BUDGET_ERROR,
      payload: error.response?.data?.message || "Failed to fetch estimate",
    });
  }
};
