import api from "../../services/api";
import { toast } from "react-toastify";
import {
  GET_REVIEWS,
  GET_DESTINATION_REVIEWS,
  GET_MY_REVIEWS,
  ADD_REVIEW,
  DELETE_REVIEW,
  VOTE_HELPFUL,
  REVIEW_ERROR,
  REVIEW_SET_LOADING,
  REVIEW_CLEAR_ERROR,
} from "../types/reviewTypes";

// Get all approved reviews (with optional sort / page)
export const getReviews =
  ({ sort = "recent", page = 1, limit = 20 } = {}) =>
  async (dispatch) => {
    dispatch({ type: REVIEW_SET_LOADING });
    try {
      const res = await api.get(
        `/reviews?sort=${sort}&page=${page}&limit=${limit}`,
      );
      dispatch({ type: GET_REVIEWS, payload: res.data });
    } catch (err) {
      dispatch({
        type: REVIEW_ERROR,
        payload: err.response?.data?.msg || "Error fetching reviews",
      });
    }
  };

// Get approved reviews for a destination
export const getDestinationReviews =
  (destination, sort = "recent") =>
  async (dispatch) => {
    dispatch({ type: REVIEW_SET_LOADING });
    try {
      const res = await api.get(
        `/reviews/destination/${encodeURIComponent(destination)}?sort=${sort}`,
      );
      dispatch({ type: GET_DESTINATION_REVIEWS, payload: res.data });
    } catch (err) {
      dispatch({
        type: REVIEW_ERROR,
        payload:
          err.response?.data?.msg || "Error fetching destination reviews",
      });
    }
  };

// Get the current user's reviews
export const getMyReviews = () => async (dispatch) => {
  dispatch({ type: REVIEW_SET_LOADING });
  try {
    const res = await api.get("/reviews/my");
    dispatch({ type: GET_MY_REVIEWS, payload: res.data });
  } catch (err) {
    dispatch({
      type: REVIEW_ERROR,
      payload: err.response?.data?.msg || "Error fetching your reviews",
    });
  }
};

// Submit a new review
export const submitReview = (formData) => async (dispatch) => {
  dispatch({ type: REVIEW_SET_LOADING });
  try {
    const res = await api.post("/reviews", formData);
    dispatch({ type: ADD_REVIEW, payload: res.data });
    toast.success("Review submitted! It will appear after moderation. 🌟");
    return { success: true };
  } catch (err) {
    const errors = err.response?.data?.errors;
    const msg =
      errors?.map((e) => e.msg).join(", ") ||
      err.response?.data?.msg ||
      "Error submitting review";
    dispatch({ type: REVIEW_ERROR, payload: msg });
    toast.error(msg);
    return { success: false, msg };
  }
};

// Delete a review (owner only)
export const deleteReview = (id) => async (dispatch) => {
  try {
    await api.delete(`/reviews/${id}`);
    dispatch({ type: DELETE_REVIEW, payload: id });
    toast.success("Review deleted");
  } catch (err) {
    const msg = err.response?.data?.msg || "Error deleting review";
    dispatch({ type: REVIEW_ERROR, payload: msg });
    toast.error(msg);
  }
};

// Toggle helpful vote
export const voteHelpful = (id) => async (dispatch) => {
  try {
    const res = await api.post(`/reviews/${id}/helpful`);
    dispatch({ type: VOTE_HELPFUL, payload: { id, ...res.data } });
  } catch (err) {
    toast.error(err.response?.data?.msg || "Error voting");
  }
};

// Clear review error
export const clearReviewError = () => ({ type: REVIEW_CLEAR_ERROR });
