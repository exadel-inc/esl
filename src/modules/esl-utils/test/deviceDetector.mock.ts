export const DDMock = {
  isMobile: false,
  isSafari: false,
  isBot: false
};

jest.mock('../environment/device-detector', () => ({
  DeviceDetector: DDMock
}));
