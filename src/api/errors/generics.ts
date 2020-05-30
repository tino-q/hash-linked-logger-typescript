import { createError } from '~api/middlewares/error_handler';
import { STATUS_CODES } from '~config/constants';

export const NOT_FOUND = 'not_found';
export const notFoundError = createError(NOT_FOUND, STATUS_CODES.NOT_FOUND);

export const INVALID_SCHEMA = 'invalid_schema';
export const schemaError = createError(INVALID_SCHEMA, STATUS_CODES.UNPROCESSABLE_ENTITY);

export const BAD_REQUEST_ERROR = 'bad_request_error';
export const badRequestError = createError(BAD_REQUEST_ERROR, STATUS_CODES.BAD_REQUEST);
