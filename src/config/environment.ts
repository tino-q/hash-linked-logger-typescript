require('dotenv').config();

import { ENVIRONMENTS } from '~config/constants';

const {
  NODE_ENV = ENVIRONMENTS.DEVELOPMENT,
  PORT = 8080
} = process.env;

export default {
  NODE_ENV,
  PORT
};