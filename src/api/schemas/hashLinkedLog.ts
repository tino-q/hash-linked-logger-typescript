
export const writeLogEntrySchema = {
  body: {
    type: 'object',
    required: ['message'],
    properties: {
      message: {
        type: 'string',
      }
    }
  }
};