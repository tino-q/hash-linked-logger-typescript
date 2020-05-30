import { Request, Response, NextFunction } from 'express';

import { notFoundError } from '~api/errors';

export function routeNotFound(req: Request, res: Response, next: NextFunction): Response | void {
  return next(notFoundError());
}
