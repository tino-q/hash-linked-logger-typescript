import Ajv from 'ajv';
import ajvErrors from 'ajv-errors';
import { RequestHandler, Request, Response, NextFunction } from 'express';

import { InternalMessage } from './error_handler';

import { schemaError } from '~api/errors';

const ajv = new Ajv({ allErrors: true, jsonPointers: true, coerceTypes: true });
ajvErrors(ajv);

export interface RequestSchema {
  headers?: object;
  body?: object;
  query?: object;
  params?: object;
}

function baseSchema(schema: object): object {
  return {
    type: 'object',
    required: Object.keys(schema),
    properties: {
      ...schema
    }
  };
}

function formatErrors(errors?: Ajv.ErrorObject[] | null): InternalMessage[] {
  return errors?.map((err: Ajv.ErrorObject) => ({ message: `${err.dataPath}: ${err.message || ''}` })) || [];
}

export function validateSchema(schema: RequestSchema): RequestHandler {
  const validationFunction = ajv.compile(baseSchema(schema));
  return (req: Request, res: Response, next: NextFunction): void => {
    const valid = validationFunction(req);
    if (valid) return next();
    return next(schemaError({ messages: formatErrors(validationFunction.errors) }));
  };
}
