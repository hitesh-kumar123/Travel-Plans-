import api from "../../services/api";
import { toast } from "react-toastify";
import {
  TRANSLATE_TEXT,
  GET_LANGUAGES,
  TRANSLATOR_ERROR,
  SET_LOADING,
} from "../types/translatorTypes";

export const translateText = (formData) => async (dispatch) => {
  dispatch({ type: SET_LOADING });
  try {
    const res = await api.post("/translator/translate", formData);

    dispatch({
      type: TRANSLATE_TEXT,
      payload: res.data,
    });
  } catch (err) {
    const msg = err.response?.data?.msg || "Translation failed";
    dispatch({
      type: TRANSLATOR_ERROR,
      payload: msg,
    });
    toast.error(msg);
  }
};

export const getLanguages = () => async (dispatch) => {
  try {
    const res = await api.get("/translator/languages");

    dispatch({
      type: GET_LANGUAGES,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: TRANSLATOR_ERROR,
      payload: err.response?.data?.msg || "Error fetching languages",
    });
  }
};

export const setLoading = () => {
  return {
    type: SET_LOADING,
  };
};
