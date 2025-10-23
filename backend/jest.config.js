module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: [
    'rules/**/*.js',
    'routes/**/*.js',
    'middleware/**/*.js',
    '!**/*.test.js'
  ],
  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],
  verbose: true
};
