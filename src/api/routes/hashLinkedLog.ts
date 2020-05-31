import { Router } from 'express';

import { log, getLogs } from '~api/controllers/hashLinkedLog';
import { writeLogEntrySchema } from '~api/schemas/hashLinkedLog';
import { validateSchema } from '~api/middlewares/schema';

const route = Router();

export function hashLinkedLogRouter(app: Router): void {
  app.use('/logs', route);
  route.post('/entry', validateSchema(writeLogEntrySchema), log);
  route.get('/', getLogs);
}
