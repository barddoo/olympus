import { Request, Response, NextFunction } from 'express';
import { APIError } from '../../interface/exceptions/Error';

// Error handler to display the error as HTML
// eslint-disable-next-line no-unused-vars, no-shadow
export default function errorHandler(
  err: APIError,
  _: Request,
  res: Response,
  next: NextFunction
): void {
  res.status(err.status || 500);
  res.send(`<h1>${err.status || 500} Error</h1>` + `<pre>${err.message}</pre>`);
  next();
}
