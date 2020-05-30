import { Request, Response , NextFunction} from 'express';
import { STATUS_CODES } from '~config/constants';
import getHashLinkedLogService from '~api/services/hashLinkedLogs';

export async function log(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  try{
    await getHashLinkedLogService().log(req.body.message);
    return res.status(STATUS_CODES.NO_CONTENT).send();
  } catch (e) {
    next(e);
  }
}
