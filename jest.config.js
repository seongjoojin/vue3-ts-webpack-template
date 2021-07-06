module.exports = {
	preset: 'ts-jest',
	globals: {
		'ts-jest': {
			babelConfig: true,
		},
	},
	testEnvironment: 'jsdom',
	moduleFileExtensions: ['js', 'ts', 'vue'],
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1',
	},
	modulePathIgnorePatterns: ['<rootDir>/node_modules', '<rootDir>/dist'],
	testMatch: ['**/tests/**/*.spec.(ts|js)'],
	transform: {
		'^.+\\.ts$': 'ts-jest',
		'^.+\\.js$': 'babel-jest',
		'^.+\\.vue$': 'vue-jest',
	},
};
