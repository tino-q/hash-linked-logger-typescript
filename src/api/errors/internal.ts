import { createError } from '~api/middlewares/error_handler';
import { STATUS_CODES } from '~config/constants';

export const DEFAULT_ERROR = 'default_error';
export const defaultError = createError(DEFAULT_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR);

export const SERVICE_UNAVAILABLE = 'service_unavailable';
export const serviceUnavailableError = createError(SERVICE_UNAVAILABLE, STATUS_CODES.SERVICE_UNAVAILABLE);

export const INTERNAL_ERROR = 'internal_error';
export const internalError = createError(INTERNAL_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR);

export const ROUTE_NOT_FOUND_ERROR = 'route_not_found_error';
export const routeNotFoundError = createError(ROUTE_NOT_FOUND_ERROR, STATUS_CODES.NOT_FOUND);
