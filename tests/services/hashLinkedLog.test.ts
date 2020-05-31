import { register as registerLineRepo } from '~api/repositories/lines';
import getHashLinkedLogsService from '~api/services/hashLinkedLogs';
import { INVALID_LOG_MESSAGE, CORRUPTED_LOG_FILE } from '~api/errors';
import { InternalError } from '~api/middlewares/error_handler';
import { getAllIndexesOf, unscapeCommas, hashString, escapeCommas } from '~libs/utils';
import { NONCE_AMOUNT_ZEROS } from '~config/constants';
import { HashLinkedLog } from '~api/models/HashLinkedLog';

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

  describe('getLogs', () => {
    describe('returning some logs', () => {
      const LOG_LINES = [
        `0037f12989d76a1f480ccb924aa9173e17dbbf836f71f04e1c46dbfd02f0b1c1,first log! =),2020-05-31T00:47:23.697Z,0`,
        `00ef489c94ac56366f2af856913d81de6fccdb0c88aa74c2a2d26dfc35f7e70f,second log! =),2020-05-31T00:47:27.253Z,0`,
        `00d257ce032a620a51c63795ed88600a74ef4341a10947ee9b1fbd06a1ce5d5a,the final log,2020-05-31T00:47:32.839Z,68`
      ];
      let logs: HashLinkedLog[] | undefined;
      beforeAll(async (done: jest.DoneCallback) => {
        lines.length = 0;
        LOG_LINES.forEach((l: string) => lines.push(l));
        logs = await getHashLinkedLogsService().getLogs();
        done();
      });
      test(`There should be ${LOG_LINES.length} logs`, () => expect(logs?.length).toBe(LOG_LINES.length));
    });

    describe('without logs', () => {
      let logs: HashLinkedLog[] | undefined;
      beforeAll(async (done: jest.DoneCallback) => {
        lines.length = 0;
        logs = await getHashLinkedLogsService().getLogs();
        done();
      });
      test('There should be no logs', () => expect(logs?.length).toBe(0));
    });
  });
});
