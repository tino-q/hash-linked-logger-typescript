import { HashLinkedLog } from "~api/models/HashLinkedLog";

export function serializeLogs(logs: HashLinkedLog[]): [string, string][] {
  const sortedLogs = logs.sort((a: HashLinkedLog, b: HashLinkedLog) =>
    Date.parse(a.date) - Date.parse(b.date));
  return sortedLogs.reduce((acum: [string, string][], curr: HashLinkedLog): [string, string][] => {
    return [...acum, [curr.date, curr.message]];
  }, []);
}
