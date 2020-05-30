import { Application } from 'express';
import swaggerUi from 'swagger-ui-express';

import swaggerDocument from '~docs';

export function swaggerLoader(app: Application): Application {
  app.use(
    '/swagger',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
  );
  return app;
}
