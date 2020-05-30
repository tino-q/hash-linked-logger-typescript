import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import { Application } from 'express';

import { routeNotFound } from '~api/middlewares/route_not_found';
import routes from '~api';
import { errorHandlerMiddleware } from '~api/middlewares/error_handler';

const bodyParserJsonConfig: bodyParser.OptionsJson = {
  limit: 1024 * 1024 * 10
};

const bodyParserUrlencodedConfig: bodyParser.OptionsUrlencoded = {
  extended: true,
  parameterLimit: 10000
};

export function expressLoader(app: Application): void {
  /**
   * Enable Cross Origin Resource Sharing to all origins by default
   * More info: https://www.npmjs.com/package/cors
   */
  app.use(cors());
  /**
   * Enable compression on all responses.
   * More info: https://www.npmjs.com/package/compression
   */
  app.use(compression());
  /**
   * Set default HTTP headers to secure endpoints.
   * More info: https://www.npmjs.com/package/helmet
   */
  app.use(helmet());
  /**
   * Middleware that transforms the raw string of req.body into json
   * Client must send "Content-Type: application/json" header
   * More info: https://www.npmjs.com/package/body-parser
   */
  app.use(bodyParser.json(bodyParserJsonConfig));
  app.use(bodyParser.urlencoded(bodyParserUrlencodedConfig));
  /**
   * Disable Etag header
   */
  app.disable('etag');
  /**
   * Load API routes and add prefix to them
   */
  app.use(routes());
  /**
   *  Middleware to handle not-found's errors.
   */
  app.use(routeNotFound);
  /**
   * Middleware to handle API's errors
   */
  app.use(errorHandlerMiddleware);
}
