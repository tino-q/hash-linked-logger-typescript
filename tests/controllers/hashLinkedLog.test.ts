import request from 'supertest';

import app from '~app';
import { STATUS_CODES, MAX_MESSAGE_LENGTH } from '~config/constants';

import { register as registerHashLinkedLogService } from '~api/services/hashLinkedLogs';
import { entryWasOutPacedByAnotherOne, corruptedLogFileError } from '~api/errors';
import { InternalError } from '~api/middlewares/error_handler';
import { range } from '~libs/utils';
import { HashLinkedLog } from '~api/models/HashLinkedLog';

const DEFAULT_SERVICE_STUB = {
  log: async (line: string): Promise<void> => {
    await Promise.resolve(line);
  },
  getLogs: async (): Promise<HashLinkedLog[]> => {
    return Promise.resolve([]);
  }
};

describe('hashLinkedLog controller', () => {
  describe('/logs/entry POST', () => {
    describe.each([
      ['message is too short', { message: '' }],
      ['message is too long', { message: range(MAX_MESSAGE_LENGTH + 1).map(() => 'a').join('') }],
      ['message is null', { message: null }],
      ['message is undefined', {}],
      ['message is an object', { message: {} }],
      ['message is an array', { message: [] }],
    ])('when %s ', (str: string, payload: object) => {
      let response: request.Response;
      beforeAll(async (done: jest.DoneCallback) => {
        response = await request(app).post('/logs/entry').send(payload);
        done();
      });
      test(`Response status should be ${STATUS_CODES.UNPROCESSABLE_ENTITY}`,
        () => expect(response.status).toBe(STATUS_CODES.UNPROCESSABLE_ENTITY));
    });

    describe('with message on body', () => {
      let response: request.Response;
      const MESSAGE = 'SOME_TEST_MESSAGE';
      beforeAll(async (done: jest.DoneCallback) => {
        registerHashLinkedLogService(DEFAULT_SERVICE_STUB);
        response = await request(app).post('/logs/entry').send({ message: MESSAGE });
        done();
      });
      test(`Response status should be ${STATUS_CODES.NO_CONTENT}`,
        () => expect(response.status).toBe(STATUS_CODES.NO_CONTENT));
    });


    describe.each([
      ['corruptedLogFileError', corruptedLogFileError()],
      ['entryWasOutPacedByAnotherOne', entryWasOutPacedByAnotherOne()]
    ])('when service throws error %s', (str: string, err: InternalError) => {
      let response: request.Response;
      const MESSAGE = 'SOME_TEST_MESSAGE';
      beforeAll(async (done: jest.DoneCallback) => {
        registerHashLinkedLogService({
          ...DEFAULT_SERVICE_STUB,
          log: async (line: string): Promise<void> => {
            await Promise.resolve(line);
            throw err;
          },
        });
        response = await request(app).post('/logs/entry').send({ message: MESSAGE });
        done();
      });
      test(`Response status should be ${err.statusCode}`,
          () => expect(response.status).toBe(err.statusCode));
      test(`Response internal code should be ${err.internalCode}`,
          () => expect(response.body.internal_code).toBe(err.internalCode));
    });
  });

  describe('/logs GET', () => {
    describe('with no logs', () => {
      let response: request.Response;
      beforeAll(async (done: jest.DoneCallback) => {
        registerHashLinkedLogService(DEFAULT_SERVICE_STUB);
        response = await request(app).get('/logs');
        done();
      });
      test(`Response status should be ${STATUS_CODES.OK}`,
        () => expect(response.status).toBe(STATUS_CODES.OK));
      test('Response body should be empty', () => expect(response.body).toEqual({logs:[]}));
    });

    describe('with logs', () => {
      let response: request.Response;
      const LOGS = [
        {
          message: 'first message',
          nonce: 0,
          prevHash: 'prevHash',
          date: new Date().toISOString(),
        },
        {
          message: 'another message',
          nonce: 0,
          prevHash: 'prevHash',
          date: new Date().toISOString(),
        }
      ];
      beforeAll(async (done: jest.DoneCallback) => {
        registerHashLinkedLogService({
          ...DEFAULT_SERVICE_STUB,
          getLogs: (): Promise<HashLinkedLog[]> => Promise.resolve(LOGS)
        });
        response = await request(app).get('/logs');
        done();
      });
      test(`Response status should be ${STATUS_CODES.OK}`,
        () => expect(response.status).toBe(STATUS_CODES.OK));
      test('Response body should contain the logs', () => expect(response.body).toEqual({logs: [
        [LOGS[0].date, LOGS[0].message],
        [LOGS[1].date, LOGS[1].message]
      ]}));
    });
  });
});
