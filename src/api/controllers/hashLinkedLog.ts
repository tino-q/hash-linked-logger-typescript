import getHashLinkedLogService from '~api/services/hashLinkedLogs';
import { Request, Response , NextFunction} from 'express';
import { STATUS_CODES } from '~config/constants';
import { HashLinkedLog } from '~api/models/HashLinkedLog';
import { serializeLogs } from '~api/serializers/hashLinkedLogs';

export async function log(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  try{
    await getHashLinkedLogService().log(req.body.message);
    return res.status(STATUS_CODES.NO_CONTENT).send();
  } catch (e) {
    next(e);
  }
}

export async function getLogs(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  try{
    const logs: HashLinkedLog[] = await getHashLinkedLogService().getLogs();
    return res.status(STATUS_CODES.OK).send({logs: serializeLogs(logs)});
  } catch (e) {
    next(e);
  }
}
