import { HASH_LINKED_LOG_TAG } from "../tags";
import { getSwaggerParameters, generateErrorResponses } from "../utils";
import { writeLogEntrySchema } from "~api/schemas/hashLinkedLog";
import { STATUS_CODES } from "~config/constants";

export default {
  '/entry': {
    post: {
      tags: [HASH_LINKED_LOG_TAG],
      description: 'Attempts to write an entry to the end of the hash linked log',
      operationId: 'writeLogEntry',
      parameters: getSwaggerParameters(writeLogEntrySchema),
      responses: {
        [STATUS_CODES.NO_CONTENT]: {
          description: 'The entry was written ok',
        },
        ...generateErrorResponses()
      }
    }
  }
};