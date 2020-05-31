import { HASH_LINKED_LOG_TAG } from "../tags";
import { getSwaggerParameters, generateErrorResponses } from "../utils";
import { writeLogEntrySchema } from "~api/schemas/hashLinkedLog";
import { STATUS_CODES } from "~config/constants";
import { corruptedLogFileError, entryWasOutPacedByAnotherOne, invalidLogMessageError } from '~api/errors';

export default {
  '/logs/entry': {
    post: {
      tags: [HASH_LINKED_LOG_TAG],
      description: 'Attempts to write an entry to the end of the hash linked log',
      operationId: 'writeLogEntry',
      parameters: getSwaggerParameters(writeLogEntrySchema),
      responses: {
        [STATUS_CODES.NO_CONTENT]: {
          description: 'The entry was written ok',
        },
        ...generateErrorResponses(invalidLogMessageError(), corruptedLogFileError(), entryWasOutPacedByAnotherOne())
      }
    }
  },
  '/logs': {
    get: {
      tags: [HASH_LINKED_LOG_TAG],
      description: 'Get the logs',
      operationId: 'getLogs',
      responses: {
        [STATUS_CODES.OK]: {
          description: 'The logs',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  logs: {
                    type: 'array',
                    example: [
                      ['2020-05-31T12:19:34.231Z', 'Some message'],
                      ['2020-06-31T03:11:01.643Z', 'Some message'],
                      ['2020-02-31T02:02:12.8122Z', 'Some message']
                    ]
                  },
                }
              }
            }
          }
        },
        ...generateErrorResponses(corruptedLogFileError())
      }
    }
  }
};