/**
 * @type {import('jest').Config}
 **/
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleDirectories: ['src', 'node_modules'],
  collectCoverage: true,
  coverageReporters: ['text']
}
