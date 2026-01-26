// jest.config.ts
import type { Config } from 'jest';

const config: Config = {
	preset: 'ts-jest',
	testEnvironment: 'node',

	// Where your tests live
	testMatch: ['**/tests/**/*.test.ts', '**/__tests__/**/*.test.ts'],

	// Keeps output readable
	verbose: true,

	// If you want stable snapshots and deterministic tests
	clearMocks: true,
	restoreMocks: true,

	// Prevent haste-map collisions from build artifacts (e.g. dist/package.json)
	modulePathIgnorePatterns: ['<rootDir>/dist/'],
	testPathIgnorePatterns: ['<rootDir>/dist/'],

	// Coverage (optional; enable when you want)
	collectCoverageFrom: ['nodes/**/*.ts', '!**/*.d.ts', '!**/node_modules/**', '!**/dist/**'],

	// ts-jest config (globals is deprecated; use transform instead)
	transform: {
		'^.+\\.ts$': [
			'ts-jest',
			{
				tsconfig: 'tsconfig.jest.json',
			},
		],
	},
};

export default config;
