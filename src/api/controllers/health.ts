import { Request, Response } from 'express';

export function healthCheck(req: Request, res: Response): Response {
  return res.send({ uptime: process.uptime() });
}
