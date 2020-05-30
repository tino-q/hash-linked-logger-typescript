import { Router } from 'express';

import { generateHealthRoutes } from './routes/health';

export default function generateAppRoutes(): Router {
  const app = Router();

  generateHealthRoutes(app);

  return app;
}
