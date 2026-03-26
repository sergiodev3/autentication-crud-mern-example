import { HTTP_STATUS } from '../utils/httpCodes.js';

const notFoundHandler = (req, res) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`
  });
};

export default notFoundHandler;
