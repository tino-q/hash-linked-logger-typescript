import {
  randInt,
  range,
  zeros,
  getUTCStringDate,
  hashString,
  escapeCommas,
  unscapeCommas,
  getAllIndexesOf,
} from '~libs/utils';
import { HEX_CHAR_POOL } from '~config/constants';

describe('utils', () => {
  describe('randInt', () => {
    const RANDOM_MAX = 10;
    const RANDOM_NUMBERS = range(10).map(() => randInt(RANDOM_MAX));
    RANDOM_NUMBERS.map((randomInt: number) => {
      test(`Should give a random integer with maximum ${RANDOM_MAX}`,
        () => expect(randomInt).toBeLessThan(10));
      test('Should give a random integer greater or equal than 0',
        () => expect(randomInt).toBeGreaterThanOrEqual(0));
    });
  });
  
  describe('range', () => {
    const RANGE_LENGTH = 10;
    const array = range(RANGE_LENGTH);
    test('Should be an array',
      () => expect(Array.isArray(array)).toBeTruthy());
    test(`Should be of length ${RANGE_LENGTH}`,
      () => expect(array.length).toBe(RANGE_LENGTH));
  });
  
  describe('zeros', () => {
    const ZEROS_LENGTH = 10;
    const someZeros = zeros(ZEROS_LENGTH);
    test('Should be a string',
      () => expect(typeof someZeros).toBe('string'));
    test(`Should be of length ${ZEROS_LENGTH}`,
      () => expect(someZeros.length).toBe(ZEROS_LENGTH));
    test('Should be composed of zeros',
      () => {
        someZeros.split('').map((char: string) => expect(char).toBe('0'));
      });
  });
  
  describe('getUTCStringDate', () => {
    const date = getUTCStringDate();
    test('should be a string', () => expect(typeof date).toBe('string'));
    test('should be a date', () => expect(Date.parse(date)).toBeGreaterThan(0));
  });
  
  describe('hashString', () => {
    const hashed = hashString('asdasd');
    test('should be a string', () => expect(typeof hashed).toBe('string'));
    test('should be of length 64', () => expect(hashed.length).toBe(64));
    test('should be composed of the hex char pool', () => {
      hashed.split('').map((char: string) => expect(HEX_CHAR_POOL.includes(char)).toBeTruthy());
    });
  });
  
  describe('escapeCommas', () => {
    const stringWithCommas = 'this, string, has, commas';
    const escappedStringWithCommas = 'this\\, string\\, has\\, commas';
    const escapedString = escapeCommas(stringWithCommas);
    test('string commas show now be escaped', () =>
      expect(escapedString).toBe(escappedStringWithCommas));
  });
  
  describe('unscapeCommas', () => {
    const stringWithCommas = 'this, string, has, commas';
    const escappedStringWithCommas = 'this\\, string\\, has\\, commas';
    const unscapedString = unscapeCommas(escappedStringWithCommas);
    test('string commas show now be unscaped', () =>
      expect(unscapedString).toBe(stringWithCommas));
  });
  
  describe('getAllIndexesOf', () => {
    const occurrence = 'occurrence';
    const stringWithThreeOcurrences = `there is one ${occurrence} two ${occurrence} and three ${occurrence}sssss`;
    const occurrenceIndexes = getAllIndexesOf(stringWithThreeOcurrences, occurrence);
    test('there should be three ocurrences', () => expect(occurrenceIndexes.length).toBe(3));
  });
});
