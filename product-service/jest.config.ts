import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@libs/(.*)$': '<rootDir>/src/libs/$1',
    '^src/(.*)$': '<rootDir>/src/$1',
  },
};

export default config;
