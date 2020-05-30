import request from 'supertest';

import app from '~app';
import { STATUS_CODES } from '~config/constants';

describe('hashLinkedLog controller', () => {
  describe('/logs/entry POST', () => {
    describe('message missing on body', () => {
      let response: request.Response;
      beforeAll(async (done: jest.DoneCallback) => {
        response = await request(app).post('/logs/entry');
        done();
      });
      test(`Response status should be ${STATUS_CODES.UNPROCESSABLE_ENTITY}`,
        () => expect(response.status).toBe(STATUS_CODES.UNPROCESSABLE_ENTITY));
    });
    describe('with message on body', () => {
      let response: request.Response;
      const MESSAGE = 'SOME_TEST_MESSAGE';
      beforeAll(async (done: jest.DoneCallback) => {
        response = await request(app).post('/logs/entry').send({ message: MESSAGE });
        done();
      });
      test(`Response status should be ${STATUS_CODES.NO_CONTENT}`,
        () => expect(response.status).toBe(STATUS_CODES.NO_CONTENT));
    });
  });
});
