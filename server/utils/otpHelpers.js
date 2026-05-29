const buildEmailFailureMessage = (action) =>
  `We could not send the verification email for ${action}. Please try again in a moment.`;

const logEmailFailure = (action, emailErr, source = "authController") => {
  console.error(`[${source}] ${action} email send failed`, {
    message: emailErr.message,
    code: emailErr.code || emailErr.cause?.code,
    response: emailErr.response || emailErr.cause?.response,
    cause: emailErr.cause?.message,
    stack: emailErr.stack,
  });

  if (emailErr.cause) {
    console.error(`[${source}] ${action} email failure cause details`, {
      causeName: emailErr.cause.name,
      causeMessage: emailErr.cause.message,
      causeCode: emailErr.cause.code,
      causeResponse: emailErr.cause.response,
      causeStack: emailErr.cause.stack,
    });
  }
};

module.exports = {
  buildEmailFailureMessage,
  logEmailFailure,
};
