import * as RandomString from 'randomstring';

export const generateAccessCode = (): string =>
  RandomString.generate({
    length: 7,
    readable: true,
    capitalization: 'uppercase',
  });
