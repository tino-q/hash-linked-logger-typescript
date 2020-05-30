import { inspect } from 'util';

import app from './app';

import env from '~config/environment';
import logger from '~libs/logger';

(function startServer(): void {
  try {
    app.listen(env.PORT);
    logger.info(`Server listening on port ${env.PORT} ☕︎`);
  } catch (error) {
    logger.error(inspect(error));
  }
})();
