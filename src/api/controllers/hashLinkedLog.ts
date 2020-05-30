import { Request, Response } from 'express';
import { STATUS_CODES } from '~config/constants';

export function writeHashLinkedLogEntry(req: Request, res: Response): Response {
  return res.status(STATUS_CODES.NO_CONTENT).send();
}
