module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    testMatch: ['**/__tests__/**/*.test.ts'],
    transform: {
      '^.+\\.tsx?$': 'ts-jest'
    },
    collectCoverage: true,
    collectCoverageFrom: [
      'src/**/*.ts',
      '!src/**/*.d.ts',
      '!src/**/__tests__/**'
    ],
    coverageDirectory: 'coverage'
};