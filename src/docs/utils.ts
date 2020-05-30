import * as _ from 'lodash';

import { serviceUnavailableError, defaultError, internalError } from '~api/errors';
import { InternalError } from '~api/middlewares/error_handler';

/* eslint-disable @typescript-eslint/no-explicit-any */
export function getSwaggerParameters(jsonSchema: object): any[] {
  const mapJsonSchemaToSwagger = (location: string, schema: any): any => {
    const properties = Object.entries(schema.properties);
    return properties.map(([propertyName, propertySchema]: [string, unknown]) => ({
      in: location,
      name: propertyName,
      schema: propertySchema,
      required: schema.required.includes(propertyName)
    }));
  };

  return _.flatMap(Object.entries(jsonSchema), ([location, schema]: [string, any]): any => {
    if (schema.oneOf) {
      // Like oneOf is not yet supported in swagger-ui we merge all schemas into one
      const required = _.intersection(...schema.oneOf.map((nestedSchema: any) => nestedSchema.required));
      const schemas = schema.oneOf.map((nestedSchema: any) =>
        mapJsonSchemaToSwagger(location, { ...nestedSchema, required })
      );
      return _.flatten(schemas);
    }
    if (schema.items) {
      return {
        in: location,
        name: 'array',
        schema,
        required: true
      };
    }
    return mapJsonSchemaToSwagger(location, schema);
  });
}
/* eslint-disable @typescript-eslint/no-explicit-any */

function buildErrorResponse(error: InternalError, internalCodes?: string[]): object {
  const errorsSchema = {
    type: 'array',
    items: {
      type: 'object',
      required: ['message'],
      properties: {
        message: {
          type: 'string',
          example: 'Some descriptive error message'
        },
        code: {
          type: 'string',
          example: 'A22'
        }
      }
    },
    example: error.errors
  };

  return {
    'application/json': {
      schema: {
        type: 'object',
        required: ['internal_code'],
        properties: {
          errors: errorsSchema,
          internal_code: {
            type: 'string',
            enum: internalCodes ? internalCodes : [error.internalCode]
          }
        }
      }
    }
  };
}

export function generateErrorResponses(...errors: InternalError[]): object {
  const defaultErrors = [serviceUnavailableError(), defaultError(), internalError()];
  const mappedErrors = [...defaultErrors, ...errors];
  return {
    ...mappedErrors.reduce((errorResponses: object, error: InternalError) => {
      let content;
      const errorSchema: { content: object } = errorResponses[error.statusCode];
      if (errorSchema) {
        const errorProperties = errorSchema.content?.['application/json']?.schema?.properties;
        const newInternalCode = error.internalCode;
        const actualInternalCodes = errorProperties?.internal_code.enum || [];
        content = buildErrorResponse(error, [...actualInternalCodes, newInternalCode]);
      } else {
        content = buildErrorResponse(error);
      }
      errorResponses[error.statusCode] = {
        content
      };
      return errorResponses;
    }, {})
  };
}
