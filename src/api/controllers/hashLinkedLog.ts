import getHashLinkedLogService from '~api/services/hashLinkedLogs';
import { Request, Response , NextFunction} from 'express';
import { STATUS_CODES } from '~config/constants';
import { HashLinkedLog } from '~api/models/HashLinkedLog';
import { serializeLogs } from '~api/serializers/hashLinkedLogs';
import logger from '~libs/logger';
import { inspect } from 'util';

export async function log(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  try{
    logger.info(`Got request to write log: ${req.body.message}`);
    await getHashLinkedLogService().log(req.body.message);
    return res.status(STATUS_CODES.NO_CONTENT).send();
  } catch (e) {
    logger.info(`Error while writing log: ${inspect(e)}`);
    next(e);
  }
}

export async function getLogs(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  try{
    logger.info(`Got request to return logs`);
    const logs: HashLinkedLog[] = await getHashLinkedLogService().getLogs();
    logger.info(`Returning ${logs.length} logs`);
    return res.status(STATUS_CODES.OK).send({logs: serializeLogs(logs)});
  } catch (e) {
    logger.info(`Error while returning logs: ${inspect(e)}`);
    next(e);
  }
}
