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

const initialState = {
  reviews: [],
  destinationReviews: [],
  myReviews: [],
  total: 0,
  pages: 1,
  page: 1,
  averageRating: 0,
  ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  destinationAverage: 0,
  destinationTotal: 0,
  loading: false,
  error: null,
};

export default function reviewReducer(state = initialState, action) {
  switch (action.type) {
    case REVIEW_SET_LOADING:
      return { ...state, loading: true, error: null };

    case GET_REVIEWS:
      return {
        ...state,
        reviews: action.payload.reviews,
        total: action.payload.total,
        pages: action.payload.pages,
        page: action.payload.page,
        averageRating: action.payload.averageRating,
        ratingDistribution: action.payload.ratingDistribution,
        loading: false,
        error: null,
      };

    case GET_DESTINATION_REVIEWS:
      return {
        ...state,
        destinationReviews: action.payload.reviews,
        destinationAverage: action.payload.averageRating,
        destinationTotal: action.payload.totalCount,
        loading: false,
        error: null,
      };

    case GET_MY_REVIEWS:
      return {
        ...state,
        myReviews: action.payload,
        loading: false,
        error: null,
      };

    case ADD_REVIEW:
      return {
        ...state,
        myReviews: [action.payload, ...state.myReviews],
        loading: false,
        error: null,
      };

    case DELETE_REVIEW:
      return {
        ...state,
        myReviews: state.myReviews.filter((r) => r._id !== action.payload),
        reviews: state.reviews.filter((r) => r._id !== action.payload),
        loading: false,
      };

    case VOTE_HELPFUL:
      return {
        ...state,
        reviews: state.reviews.map((r) =>
          r._id === action.payload.id
            ? { ...r, helpfulVotes: action.payload.helpfulVotes }
            : r,
        ),
        destinationReviews: state.destinationReviews.map((r) =>
          r._id === action.payload.id
            ? { ...r, helpfulVotes: action.payload.helpfulVotes }
            : r,
        ),
      };

    case REVIEW_ERROR:
      return { ...state, loading: false, error: action.payload };

    case REVIEW_CLEAR_ERROR:
      return { ...state, error: null };

    default:
      return state;
  }
}
