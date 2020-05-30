import { MIN_MESSAGE_LENGTH, MAX_MESSAGE_LENGTH } from "~config/constants";

export const writeLogEntrySchema = {
  body: {
    type: 'object',
    required: ['message'],
    properties: {
      message: {
        type: 'string',
        minLength: MIN_MESSAGE_LENGTH,
        maxLength: MAX_MESSAGE_LENGTH
      }
    }
  }
};