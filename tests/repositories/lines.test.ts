import { LOG_FILE_NAME } from '~config/constants';
import getLineRepository from '~api/repositories/lines';
import { readFileSync, unlinkSync, writeFileSync } from 'fs';
import { compact } from 'lodash';
import { InternalError } from '~api/middlewares/error_handler';

const deleteLogFile = (): void => {
  try {
    unlinkSync(LOG_FILE_NAME);
  } catch (e) {}
};

const readFileLines = (): string[] => {
  try {
    const fileContents = readFileSync(LOG_FILE_NAME).toString('utf8');
    return compact(fileContents?.split('\n'));
  } catch (e) {
    return [];
  }
};


describe('line repository', () => {
  const LINES_TO_APPEND = [
    'first sweet line',
    'second sweet line',
    'third sweet line',
  ];
  describe('appendLine', () => {
    describe('appending some lines', () => {
      let lines: string[];
      beforeAll(async (done: jest.DoneCallback) => {
        deleteLogFile();
        for (const line of LINES_TO_APPEND)
          await getLineRepository().appendLine(line);
        lines = readFileLines();
        done();
      });
      test(`There should be ${LINES_TO_APPEND.length} lines`,
        () => expect(lines?.length).toBe(LINES_TO_APPEND.length));
      LINES_TO_APPEND.map((line: string, i: number) =>
        test(`The ${i}th line should be: ${line}`, () => expect(lines[i]).toBe(line)));
    });

    describe.each([
      ['line is empty', ''],
      ['line is null', null],
      ['line is undefined', undefined],
      ['line is an object', {}],
      ['line is an array', []],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ])('when %s ', (str: string, message: any) => {
      let error: InternalError | undefined;
      let lines: string[];
      beforeAll(async (done: jest.DoneCallback) => {
        deleteLogFile();
        try {
          await getLineRepository().appendLine(message);
        } catch (e) {
          error = e;
        }
        lines = readFileLines();
        done();
      });
      test('There should be no error', () => expect(error).toBeUndefined());
      test('There should be no lines', () => expect(lines?.length).toBe(0));
    });
  });

  describe('getLines', () => {
    let lines: string[];
    beforeAll(async (done: jest.DoneCallback) => {
      writeFileSync(LOG_FILE_NAME, LINES_TO_APPEND.join('\n'));
      lines = await getLineRepository().getLines();
      done();
    });
    test(`There should be ${LINES_TO_APPEND.length} lines`,
      () => expect(lines?.length).toBe(LINES_TO_APPEND.length));
    LINES_TO_APPEND.map((line: string, i: number) =>
      test(`The ${i}th line should be: ${line}`, () => expect(lines[i]).toBe(line)));
  });

  describe('getLastLine', () => {
    describe('with lines', () => {
      let lastLine: string | null;
      beforeAll(async (done: jest.DoneCallback) => {
        writeFileSync(LOG_FILE_NAME, LINES_TO_APPEND.join('\n'));
        lastLine = await getLineRepository().getLastLine();
        done();
      });
      test('the last line should be defined', () => expect(lastLine).toBeDefined());
      test(`the last line should be ${LINES_TO_APPEND[LINES_TO_APPEND.length - 1]}`,
        () => expect(lastLine).toBe(LINES_TO_APPEND[LINES_TO_APPEND.length - 1]));
    });

    describe('without lines', () => {
      let lastLine: string | null;
      beforeAll(async (done: jest.DoneCallback) => {
        deleteLogFile();
        lastLine = await getLineRepository().getLastLine();
        done();
      });
      test('the last line should be null', () => expect(lastLine).toBeNull());
    });
  });
});
