module.exports = {
  preset: "jest-puppeteer",
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  roots: ['./tests/'],
  testRegex: '(.+)\\.(spec|test)\\.ts$',
  moduleFileExtensions: ['ts', 'js'],
  setupFilesAfterEnv: ['./setup/image.ts'],
};
