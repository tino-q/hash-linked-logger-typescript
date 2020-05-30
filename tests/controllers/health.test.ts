import request from 'supertest';

import app from '~app';

describe('health controller', () => {
  describe('/health GET', () => {
    test('should return server status', (done: jest.DoneCallback) => {
      request(app)
        .get('/health')
        .then((res: request.Response) => {
          expect(res.status).toBe(200);
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty('uptime');
          expect(res.body.uptime).toBeGreaterThan(0);
          done();
        });
    });
  });
});
