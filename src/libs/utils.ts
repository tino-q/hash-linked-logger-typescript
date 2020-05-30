import crypto from 'crypto';

export const randInt = (max: number): number => Math.floor(Math.random() * max);

export const range = (n: number): number[] => [...Array(n).keys()];

export const zeros = (length: number): string => range(length).map(() => '0').join('');

export const getUTCStringDate = (): string => (new Date()).toISOString();

export const hashString = (str: string): string =>
  crypto
    .createHash('sha256')
    .update(str,'utf8')
    .digest('hex').toString();

export const escapeCommas = (str: string): string => str.replace(/,/g, '\\,');

export const unscapeCommas = (str: string): string => str.replace(/\\,/g, ',');

export const getAllIndexesOf = (str: string, occurrence: string): number[] => {
  const allIndexes = [];
  let i = str.indexOf(occurrence);
  while (i !== -1) {
    allIndexes.push(i);
    i = str.indexOf(occurrence, i + 1);
  }
  return allIndexes;
};