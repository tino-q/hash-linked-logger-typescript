import { Method } from 'axios';

export const uuidv4regExp = new RegExp(
  /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
);

export const HEX_CHAR_POOL = '0123456789abcdef';

interface Methods {
  [key: string]: Method;
}

export const METHODS: Methods = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE'
};


export const STATUS_CODES = {
  ACCEPTED: 202,
  BAD_REQUEST: 400,
  CREATED: 201,
  FORBIDDEN: 403,
  INTERNAL_SERVER_ERROR: 500,
  NO_CONTENT: 204,
  NOT_ACCEPTABLE: 406,
  NOT_FOUND: 404,
  OK: 200,
  REQUEST_TIMEOUT: 408,
  SERVICE_UNAVAILABLE: 503,
  UNAUTHORIZED: 401,
  UNPROCESSABLE_ENTITY: 422,
};

export enum ENVIRONMENTS { 
  TEST = 'test',
  DEVELOPMENT = 'development'
}

export const NONCE_AMOUNT_ZEROS = 2;

export const LOG_FILE_NAME = 'hashLinkedLogs.csv';

export const MIN_MESSAGE_LENGTH = 1;

export const MAX_MESSAGE_LENGTH = 200;
