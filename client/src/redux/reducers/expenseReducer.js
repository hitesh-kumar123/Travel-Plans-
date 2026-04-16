import {
  GET_EXPENSES,
  GET_EXPENSE,
  ADD_EXPENSE,
  UPDATE_EXPENSE,
  DELETE_EXPENSE,
  GET_EXPENSE_SUMMARY,
  EXPENSE_ERROR,
  CLEAR_EXPENSES,
  SET_LOADING,
} from "../types/expenseTypes";

const initialState = {
  expenses: [],
  allExpenses: [],
  currentExpense: null,
  expenseSummary: null,
  loading: false,
  error: null,
};

export default function expenseReducer(state = initialState, action) {
  switch (action.type) {
    case SET_LOADING:
      return {
        ...state,
        loading: true,
      };
    case GET_EXPENSES:
      return {
        ...state,
        expenses: action.payload,
        loading: false,
      };
    case "GET_ALL_USER_EXPENSES":
      return {
        ...state,
        allExpenses: action.payload,
        loading: false,
      };
    case GET_EXPENSE:
      return {
        ...state,
        currentExpense: action.payload,
        loading: false,
      };
    case ADD_EXPENSE:
      return {
        ...state,
        expenses: [action.payload, ...state.expenses],
        loading: false,
      };
    case UPDATE_EXPENSE:
      return {
        ...state,
        expenses: state.expenses.map((expense) =>
          expense._id === action.payload._id ? action.payload : expense
        ),
        loading: false,
      };
    case DELETE_EXPENSE:
      return {
        ...state,
        expenses: state.expenses.filter(
          (expense) => expense._id !== action.payload
        ),
        loading: false,
      };
    case GET_EXPENSE_SUMMARY:
      return {
        ...state,
        expenseSummary: action.payload,
        loading: false,
      };
    case EXPENSE_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case CLEAR_EXPENSES:
      return {
        ...state,
        expenses: [],
        allExpenses: [],
        currentExpense: null,
        expenseSummary: null,
        loading: false,
      };
    default:
      return state;
  }
}
