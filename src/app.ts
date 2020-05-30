import 'module-alias/register';
import express from 'express';

import env from '~config/environment';
import { expressLoader, swaggerLoader } from '~loaders';
import { ENVIRONMENTS } from '~config/constants';

const app = express();

env.NODE_ENV != ENVIRONMENTS.TEST && swaggerLoader(app);
expressLoader(app);

export default app;
