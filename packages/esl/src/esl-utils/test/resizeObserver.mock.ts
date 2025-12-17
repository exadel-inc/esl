import { vi } from 'vitest';
import type { MockedFunction } from 'vitest';

export interface ResizeObserverMock {
  callback: ResizeObserverCallback;
  disconnect: MockedFunction<any>;
  observe: MockedFunction<any>;
  unobserve: MockedFunction<any>;
}

export const ResizeObserverMockImpl = vi.fn().mockImplementation(function ResizeObserver(callback: ResizeObserverCallback) {
  return {
    callback,
    disconnect: vi.fn(),
    observe: vi.fn(),
    unobserve: vi.fn()
  };
});

export const getLastResizeObserverMock = (): ResizeObserverMock => ResizeObserverMockImpl.mock.results.at(-1)?.value;

window.ResizeObserver = window.ResizeObserver || ResizeObserverMockImpl;
