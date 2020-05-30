/* eslint-disable @typescript-eslint/no-empty-function */
import { ENVIRONMENTS } from '~config/constants';
import env from '~config/environment';

const stubLogger = {
  info: (): void => {},
  error: (): void => {},
  warn: (): void => {}
};

export default env.NODE_ENV === ENVIRONMENTS.TEST ? stubLogger : console;
