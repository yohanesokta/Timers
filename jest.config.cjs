module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  setupFiles: ['./jest.setup.js'], // Run this before tests
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  moduleNameMapper: {
    // Mock CSS imports
    '\.css$': 'identity-obj-proxy',
  },
  transform: {
    // Use babel-jest to transpile tests with the .js, .jsx, .ts, and .tsx extensions
    '^.+\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
};