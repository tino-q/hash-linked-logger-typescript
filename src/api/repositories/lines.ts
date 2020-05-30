import { readFileSync, appendFileSync } from 'fs';
import { compact } from 'lodash';
import { LOG_FILE_NAME } from '~config/constants';
import { createContainer, asValue, AwilixContainer } from 'awilix';

async function appendLine(line: string): Promise<void> {
  if (typeof line === 'string' && line.length)
    appendFileSync(LOG_FILE_NAME, `${line}\n`);
};

async function getLines(): Promise<string[]> {
  try {
    return compact(readFileSync(LOG_FILE_NAME).toString('utf8').split('\n'));
  } catch (e) {
    return [];
  }
};

async function getLastLine(): Promise<string | null> {
  const lines = await getLines(); 
  return lines.length ? lines[lines.length - 1] : null;
}

interface ITextLiner {
  appendLine: (line: string) => Promise<void>;
  getLines: () => Promise<string[]>;
  getLastLine: () => Promise<string | null>;
}

const REGISTRY_NAME = 'lineRepository';
const container = createContainer();
container.register(REGISTRY_NAME, asValue({ appendLine, getLines, getLastLine }));

export default (): ITextLiner => container.cradle.lineRepository;

export const register = (implementation: ITextLiner): AwilixContainer =>
  container.register(REGISTRY_NAME, asValue(implementation));

