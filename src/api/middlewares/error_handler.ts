import { inspect } from 'util';

import { Request, Response, NextFunction } from 'express';

import { STATUS_CODES } from '~config/constants';
import logger from '~libs/logger';

const DEFAULT_STATUS_CODE = STATUS_CODES.INTERNAL_SERVER_ERROR;
const DEFAULT_INTERNAL_CODE = 'unexpected_server_error';

export interface InternalMessage {
  message: string;
  code?: number;
}

export interface InternalError {
  internalCode: string;
  errors: InternalMessage[];
  statusCode: number;
}

export interface InternalErrorPayload {
  error?: Error;
  messages?: InternalMessage[];
}

export type InternalErrorGenerator = (errorPayload?: InternalErrorPayload) => InternalError;

export const createError = (internalCode: string, statusCode: number): InternalErrorGenerator => (
  errorPayload?: InternalErrorPayload
): InternalError => {
  errorPayload?.error && logger.error(inspect(errorPayload.error));
  return ({ errors: errorPayload?.messages || [], internalCode, statusCode });
};
  

export function errorHandlerMiddleware(
  error: InternalError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): Response | void {
  logger.error(inspect(error));
  return error.internalCode ? 
    res.status(error.statusCode || DEFAULT_STATUS_CODE)
      .send({ errors: error.errors, internal_code: error.internalCode }) :
    res.status(DEFAULT_STATUS_CODE).send({ internal_code: DEFAULT_INTERNAL_CODE });
}
