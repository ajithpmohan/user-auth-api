import { StatusCodes } from 'http-status-codes';

// eslint-disable-next-line
const errorHandlerMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  res.status(statusCode).json({ msg: err.message });
};

export default errorHandlerMiddleware;
