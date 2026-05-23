const sendError = (res, statusCode, message, extra = {}) => {
  return res.status(statusCode).json({
    success: false,
    message,
    msg: message,
    ...extra,
  });
};

const sendServerError = (res, error, fallbackMessage = "Internal Server Error") => {
  console.error(error);
  return sendError(res, 500, fallbackMessage);
};

module.exports = {
  sendError,
  sendServerError,
};
