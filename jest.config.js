/**
 * @type {import('jest').Config}
 **/
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleDirectories: ['src', 'node_modules'],
  collectCoverage: true,
  coverageReporters: ['text']
}
