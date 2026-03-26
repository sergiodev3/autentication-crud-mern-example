import { HTTP_STATUS } from '../utils/httpCodes.js';

const errorHandler = (error, _req, res, _next) => {
  let statusCode = error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let message = error.message || 'Internal server error';

  if (error.name === 'ValidationError') {
    statusCode = HTTP_STATUS.UNPROCESSABLE_ENTITY;
    message = Object.values(error.errors).map((item) => item.message).join(', ');
  }

  if (error.name === 'CastError') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = 'Invalid resource id';
  }

  if (error.code === 11000) {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = 'Resource already exists';
  }

  const response = {
    success: false,
    message
  };

  if (process.env.NODE_ENV !== 'production') {
    response.stack = error.stack;
  }

  return res.status(statusCode).json(response);
};

export default errorHandler;
