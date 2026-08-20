module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testEnvironment: 'node',
  testRegex: '\\.e2e-spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  testPathIgnorePatterns: ['/node_modules/', '/client/', '/dist/'],
  setupFiles: ['<rootDir>/test/setup.ts'],
  collectCoverageFrom: ['src/**/*.ts'],
};
