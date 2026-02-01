import ApiError from '../../utils/error.utils';
import { NextFunction, Request, Response } from 'express';

const errorMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof ApiError) {
    console.log(err);
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      cause: err.errorSource,
    });
  } else {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

export default errorMiddleware;
