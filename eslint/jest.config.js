module.exports = {
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  testEnvironment: 'jsdom',
  testRegex: '/test/(.+)\\.test\\.ts$',
  moduleFileExtensions: ['ts', 'js', 'json']
};
