import { register as registerLineRepo } from '~api/repositories/lines';
import getHashLinkedLogsService from '~api/services/hashLinkedLogs';
import { INVALID_LOG_MESSAGE, CORRUPTED_LOG_FILE } from '~api/errors';
import { InternalError } from '~api/middlewares/error_handler';

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
        'second message',
        'third message',
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
      TO_LOG_MESSAGES.map((message: string, i: number) =>
        test(`The ${i}th line should include the message ${message}`,
          () => expect(lines[i].includes(message)).toBeTruthy()));
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
