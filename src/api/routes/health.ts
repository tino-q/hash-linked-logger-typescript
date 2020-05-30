import { Router } from 'express';

import { healthCheck } from '~api/controllers/health';

const route = Router();

export function generateHealthRoutes(app: Router): void {
  app.use('/health', route);
  route.get('/', healthCheck);
}
