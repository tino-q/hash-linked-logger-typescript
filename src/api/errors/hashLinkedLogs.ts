import { createError } from '~api/middlewares/error_handler';
import { STATUS_CODES } from '~config/constants';

export const CORRUPTED_LOG_FILE = 'corrupted_log_file';
export const corruptedLogFileError = createError(CORRUPTED_LOG_FILE, STATUS_CODES.INTERNAL_SERVER_ERROR);

export const ENTRY_WAS_OUT_PACED_BY_ANOTHER_ONE = 'entry_was_out_paced_by_another_one';
export const entryWasOutPacedByAnotherOne = createError(ENTRY_WAS_OUT_PACED_BY_ANOTHER_ONE, STATUS_CODES.BAD_REQUEST);

export const INVALID_LOG_MESSAGE = 'invalid_log_message';
export const invalidLogMessageError = createError(INVALID_LOG_MESSAGE, STATUS_CODES.BAD_REQUEST);
