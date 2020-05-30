import * as utils from '~libs/utils';
import { HEX_CHAR_POOL, NONCE_AMOUNT_ZEROS } from '~config/constants';

export interface HashLinkedLog {
  message: string;
  nonce: number;
  prevHash: string;
  date: string;
}

export const buildInitialMessage = (message: string): HashLinkedLog => ({
  nonce: 0,
  message,
  date: utils.getUTCStringDate(),
  prevHash: `${utils.zeros(NONCE_AMOUNT_ZEROS)}${utils.range(64 - NONCE_AMOUNT_ZEROS)
    .map(() => HEX_CHAR_POOL[utils.randInt(HEX_CHAR_POOL.length)]).join('')}`
});
