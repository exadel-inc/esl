export const DevicesMock = {
  isMobile: false,
  isSafari: false,
  isBot: false
};

jest.mock('../environment/device-detector', () => DevicesMock);
