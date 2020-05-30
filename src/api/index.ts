import { Router } from 'express';

import { healthRouter } from './routes/health';
import { hashLinkedLogRouter } from './routes/hashLinkedLog';

export default function generateAppRoutes(): Router {
  const app = Router();

  healthRouter(app);
  hashLinkedLogRouter(app);

  return app;
}
