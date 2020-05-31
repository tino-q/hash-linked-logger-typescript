import { register as registerLineRepo } from '~api/repositories/lines';
import getHashLinkedLogsService from '~api/services/hashLinkedLogs';
import { INVALID_LOG_MESSAGE, CORRUPTED_LOG_FILE } from '~api/errors';
import { InternalError } from '~api/middlewares/error_handler';
import { getAllIndexesOf, unscapeCommas, hashString, escapeCommas } from '~libs/utils';
import { NONCE_AMOUNT_ZEROS } from '~config/constants';

const lines: string[] = [];

registerLineRepo({
  appendLine: async (line: string): Promise<void> => {
    lines.push(line);
  },
  getLastLine: (): Promise<string | null> =>
    Promise.resolve(lines.length ? lines[lines.length - 1] : null),
  getLines: (): Promise<string[]> => Promise.resolve(lines)
});


describe('hashLinkedLog service', () => {
  describe('log', () => {
    describe('logging some messages', () => {
      const TO_LOG_MESSAGES = [
        'first message',
        'second, message',
        'third, message',
        'fourth message',
      ];
      let error: Error | undefined;
      beforeAll(async (done: jest.DoneCallback) => {
        lines.length = 0;
        try {
          for (const message of TO_LOG_MESSAGES) {
            await getHashLinkedLogsService().log(message);
          }
        } catch (e) {
          error = e;
        }
        done();
      });
      test('There should be no error', () => expect(error).toBeUndefined());
      test(`There should be ${TO_LOG_MESSAGES.length} of lines`,
        () => expect(lines.length).toBe(TO_LOG_MESSAGES.length));

      test('Lines should include the message', () => {
        TO_LOG_MESSAGES.map((message: string, i: number) => {
          expect(lines[i].includes(escapeCommas(message))).toBeTruthy();
        });
      });

      test('Lines should have three separator commas', () => {
        TO_LOG_MESSAGES.map((message: string, i: number) => {
          const line = lines[i];
          const escapedCommaIndexes = getAllIndexesOf(line, '\\,');
          const separatorIndexes = getAllIndexesOf(line, ',')
            .filter((n: number) => !escapedCommaIndexes.includes(n - 1));
          expect(separatorIndexes.length).toBe(3); 
        });
      });

      test('Line contents', () => {
        TO_LOG_MESSAGES.map((message: string, i: number) => {
          const line = lines[i];
          const escapedCommaIndexes = getAllIndexesOf(line, '\\,');
          const separatorIndexes = getAllIndexesOf(line, ',')
            .filter((n: number) => !escapedCommaIndexes.includes(n - 1));
          
          const prevHash = line.substring(0, separatorIndexes[0]);
          const lineMessage = unscapeCommas(line.substring(separatorIndexes[0] + 1, separatorIndexes[1]));
          const date = line.substring(separatorIndexes[1] + 1, separatorIndexes[2]);
          const nonce = line.substring(separatorIndexes[2] + 1);
          expect(typeof prevHash).toBe('string');
          expect(prevHash.length).toBe(64);
          expect(lineMessage).toBe(message);
          expect(Date.parse(date)).toBeGreaterThan(0);
          expect(Number(nonce)).toBeGreaterThanOrEqual(0);
        });
      });


      test('Line contents should be linked through hashes', () => {
        for (let i = 1; i < TO_LOG_MESSAGES.length; i++) {
          const prevLine = lines[i - 1];
          const line = lines[i];

          const escapedCommaIndexes = getAllIndexesOf(line, '\\,');
          const separatorIndexes = getAllIndexesOf(line, ',')
            .filter((n: number) => !escapedCommaIndexes.includes(n - 1));
          
          const prevHash = line.substring(0, separatorIndexes[0]);
          const lineMessage = unscapeCommas(line.substring(separatorIndexes[0] + 1, separatorIndexes[1]));
          const date = line.substring(separatorIndexes[1] + 1, separatorIndexes[2]);
          const nonce = line.substring(separatorIndexes[2] + 1);

          const prevEscapedCommaIndexes = getAllIndexesOf(prevLine, '\\,');
          const prevSeparatorIndexes = getAllIndexesOf(prevLine, ',')
            .filter((n: number) => !prevEscapedCommaIndexes.includes(n - 1));
          
          const prevPrevHash = prevLine.substring(0, prevSeparatorIndexes[0]);
          const prevLineMessage = unscapeCommas(prevLine.substring(prevSeparatorIndexes[0] + 1, prevSeparatorIndexes[1]));

          const toHashStr = `${prevPrevHash},${prevLineMessage},${lineMessage},${date},${nonce}`;
          const hashedString = hashString(toHashStr);
          expect(hashedString).toBe(prevHash);
        }
      });


      test(`Hashes should begin with ${NONCE_AMOUNT_ZEROS} zeros`, () => {
        TO_LOG_MESSAGES.map((message: string, i: number) => {
          const line = lines[i];
          const escapedCommaIndexes = getAllIndexesOf(line, '\\,');
          const separatorIndexes = getAllIndexesOf(line, ',')
            .filter((n: number) => !escapedCommaIndexes.includes(n - 1));
          
          const prevHash = line.substring(0, separatorIndexes[0]);
          const prevHashZeros = prevHash.substring(0, NONCE_AMOUNT_ZEROS);
          prevHashZeros.split('').map((c: string) => expect(c).toBe('0'));
        });
      });
    });

    describe('with invalid lines in the log', () => {
      let error: InternalError | undefined;
      beforeAll(async (done: jest.DoneCallback) => {
        lines.length = 0;
        lines.push('this_is_an_invalid_line');
        try {
          await getHashLinkedLogsService().log('some message');
        } catch (e) {
          error = e;
        }
        done();
      });
      test('There should be an error', () => expect(error).toBeDefined());
      test(`There error internal code should be ${CORRUPTED_LOG_FILE}`,
        () => expect(error?.internalCode).toBe(CORRUPTED_LOG_FILE));
    });

    describe.each([
      ['message is too short', ''],
      ['message is null', null],
      ['message is undefined', undefined],
      ['message is an object', {}],
      ['message is an array', []],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ])('when %s ', (str: string, message: any) => {
      let error: InternalError | undefined;
      beforeAll(async (done: jest.DoneCallback) => {
        lines.length = 0;
        try {
          await getHashLinkedLogsService().log(message);
        } catch (e) {
          error = e;
        }
        done();
      });
      test('There should be an error', () => expect(error).toBeDefined());
      test(`Error internal code should be ${INVALID_LOG_MESSAGE}`,
        () => expect(error?.internalCode).toBe(INVALID_LOG_MESSAGE));
    });
  });
});
