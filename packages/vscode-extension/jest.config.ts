import type { Config } from 'jest';

const config: Config = {
	roots: ['<rootDir>/src/'],
	testPathIgnorePatterns: ['<rootDir>/src/test/'],
};

export default config;
