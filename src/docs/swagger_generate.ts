import 'module-alias/register';
import fs from 'fs';
import { inspect } from 'util';

import { isEqual } from 'lodash';

import newSchema from '~docs';
import logger from '~libs/logger';

let currentSchema;
try {
  currentSchema = JSON.parse(fs.readFileSync('swagger_schema.json', 'utf8'));
} catch (e) {
  logger.error(inspect(e));
  currentSchema = {};
}

const equalSchemas = isEqual(currentSchema, newSchema);
if (!equalSchemas) {
  fs.writeFileSync('swagger_schema.json', JSON.stringify(newSchema));
  logger.error('OpenAPI schemas have changed, add them to your commit');
  process.exit(1);
}
