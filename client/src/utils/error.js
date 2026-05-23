export const getErrorMessage = (error, fallback = "Something went wrong") => {
  if (!error) {
    return fallback;
  }

  if (typeof error === "string") {
    return error;
  }

  const responseData = error.response?.data;
  const validationErrors = responseData?.errors;

  if (Array.isArray(validationErrors) && validationErrors.length > 0) {
    return validationErrors
      .map((item) => item?.message || item?.msg || item)
      .filter(Boolean)
      .join(", ");
  }

  if (responseData?.message) {
    return responseData.message;
  }

  if (responseData?.msg) {
    return responseData.msg;
  }

  if (!error.response && error.request) {
    return "Network error. Please check your connection and try again.";
  }

  return error.message || fallback;
};
