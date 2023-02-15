export interface ResizeObserverMock {
  callback: ResizeObserverCallback;
  disconnect: jest.MockedFn<any>;
  observe: jest.MockedFn<any>;
  unobserve: jest.MockedFn<any>;
}

export const ResizeObserverMockImpl = jest.fn().mockImplementation((callback: ResizeObserverCallback) => ({
  callback,
  disconnect: jest.fn(),
  observe: jest.fn(),
  unobserve: jest.fn()
}));

export const getLastResizeObserverMock = (): ResizeObserverMock => ResizeObserverMockImpl.mock.results.at(-1)?.value;

window.ResizeObserver = window.ResizeObserver || ResizeObserverMockImpl;
