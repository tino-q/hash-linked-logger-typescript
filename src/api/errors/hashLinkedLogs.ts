import { createError } from '~api/middlewares/error_handler';
import { STATUS_CODES } from '~config/constants';

export const CORRUPTED_LOG_FILE = 'corrupted_log_file';
export const corruptedLogFileError = createError(CORRUPTED_LOG_FILE, STATUS_CODES.SERVICE_UNAVAILABLE);

export const ENTRY_NO_LONGER_VALID = 'entry_no_longer_valid';
export const entryNoLongerValidError = createError(ENTRY_NO_LONGER_VALID, STATUS_CODES.BAD_REQUEST);

export const INVALID_LOG_MESSAGE = 'invalid_log_message';
export const invalidLogMessageError = createError(INVALID_LOG_MESSAGE, STATUS_CODES.BAD_REQUEST);

