const httpStatus = require('http-status');
const ApiError = require('../utils/api-error');

const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;
  if (!err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  }

  res.locals.errorMessage = err.message;

  const response = {
    error: statusCode,
    message,
  };

  res.status(statusCode).send(response);
};

module.exports = {
  errorHandler,
};
