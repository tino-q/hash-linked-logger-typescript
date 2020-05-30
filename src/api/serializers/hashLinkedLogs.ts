import { HashLinkedLog } from "~api/models/HashLinkedLog";

export function serializeLogs(logs: HashLinkedLog[]): Record<string, string> {
  return logs.reduce((acum: Record<string, string>, curr: HashLinkedLog): Record<string, string> => ({
    ...acum,
    [curr.date]: curr.message
  }), {});
}

/*

import { serializeLogs } from '~api/serializers/hashLinkedLogs';
export async function getLogEntries(req: Request, res: Response): Promise<Response> {
  const logs = await services.hashLinkedLogs.getLogs();
  return res.status(STATUS_CODES.OK).send(serializeLogs(logs));
}


export async function getLogs(): Promise<HashLinkedLog[]> {
  const lines: string[] = await getLineRepository().getLines();
  const logs: HashLinkedLog[] = lines.map(parseLine);
  return logs;
}


*/
