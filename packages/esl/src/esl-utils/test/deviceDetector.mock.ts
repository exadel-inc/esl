import { vi } from 'vitest';

export const DevicesMock = {
  isMobile: false,
  isBlink: false,
  isSafari: false
};

vi.mock('../environment/device-detector', async (importOriginal) => {
  const actual = await importOriginal() as any;
  return {
    ...actual,
    get isBlink() { return DevicesMock.isBlink; },
    get isMobile() { return DevicesMock.isMobile; },
    get isSafari() { return DevicesMock.isSafari; },
  };
});
