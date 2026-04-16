import {
  TRANSLATE_TEXT,
  GET_LANGUAGES,
  TRANSLATOR_ERROR,
  CLEAR_TRANSLATION,
  SET_LOADING,
} from "../types/translatorTypes";

const initialState = {
  translation: null,
  supportedLanguages: [],
  loading: false,
  error: null,
};

export default function translatorReducer(state = initialState, action) {
  switch (action.type) {
    case SET_LOADING:
      return {
        ...state,
        loading: true,
      };
    case TRANSLATE_TEXT:
      return {
        ...state,
        translation: action.payload,
        loading: false,
      };
    case GET_LANGUAGES:
      return {
        ...state,
        supportedLanguages: action.payload,
        loading: false,
      };
    case TRANSLATOR_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case CLEAR_TRANSLATION:
      return {
        ...state,
        translation: null,
        loading: false,
      };
    default:
      return state;
  }
}
