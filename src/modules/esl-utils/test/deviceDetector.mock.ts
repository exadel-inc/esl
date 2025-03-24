export const DevicesMock = {
  isMobile: false,
  isSafari: false
};

jest.mock('../environment/device-detector', () => DevicesMock);
