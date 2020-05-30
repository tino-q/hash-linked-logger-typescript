import nock from 'nock';

interface MockOptions {
  url: string;
  path?: string;
  method?: string;
  status?: number;
  body: object;
  requestBody?: object;
  times?: number;
}

export function mockRequest(options: MockOptions): void {
  const method = options.method || 'get';
  // eslint-disable-next-line prettier/prettier
  nock(options.url)[method](options.path || '/', options.requestBody).query(true)
    .reply(options.status || 200, options.body);
}

export function cleanRequestMocks(): void {
  nock.cleanAll();
}
