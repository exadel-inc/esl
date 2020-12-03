export const DDMock = {
  isMobile: false,
  isSafari: false,
  isBot: false
};

jest.mock('../enviroment/device-detector', () => ({
  DeviceDetector: DDMock
}));
