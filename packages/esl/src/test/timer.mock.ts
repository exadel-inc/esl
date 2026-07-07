import {vi} from 'vitest';

let nextId = 1;

const timeouts = new Map<number, ReturnType<typeof globalThis.setTimeout>>();
const intervals = new Map<number, ReturnType<typeof globalThis.setInterval>>();

const realSetTimeout = globalThis.setTimeout;
const realClearTimeout = globalThis.clearTimeout;
const realSetInterval = globalThis.setInterval;
const realClearInterval = globalThis.clearInterval;

function resetTimerMocks(): void {
  timeouts.forEach((timeout) => realClearTimeout(timeout));
  timeouts.clear();
  intervals.forEach((interval) => realClearInterval(interval));
  intervals.clear();

  nextId = 1;
}

function setTimeoutMock(callback: TimerHandler, delay?: number, ...args: any[]): number {
  const id = nextId++;
  const timeout = realSetTimeout(() => {
    if (!timeouts.has(id)) return;
    timeouts.delete(id);

    if (typeof callback === 'function') {
      callback(...args);
    } else {
      throw new Error('setTimeout with string callback is not supported in mock');
    }
  }, delay);

  timeouts.set(id, timeout);
  return id;
}

function clearTimeoutMock(id?: number): void {
  if (id === undefined) return;
  const timeout = timeouts.get(id);
  if (!timeout) return;
  realClearTimeout(timeout);
  timeouts.delete(id);
}

function setIntervalMock(callback: TimerHandler, delay?: number, ...args: any[]): number {
  const id = nextId++;
  const interval = realSetInterval(() => {
    if (!intervals.has(id)) return;
    if (typeof callback === 'function') {
      callback(...args);
    } else {
      throw new Error('setInterval with string callback is not supported in mock');
    }
  }, delay);

  intervals.set(id, interval);
  return id;
}

function clearIntervalMock(id?: number): void {
  if (id === undefined) return;
  const interval = intervals.get(id);
  if (!interval) return;
  realClearInterval(interval);
  intervals.delete(id);
}

vi.spyOn(globalThis, 'setTimeout').mockImplementation(setTimeoutMock);
vi.spyOn(globalThis, 'clearTimeout').mockImplementation(clearTimeoutMock);

vi.spyOn(globalThis, 'setInterval').mockImplementation(setIntervalMock);
vi.spyOn(globalThis, 'clearInterval').mockImplementation(clearIntervalMock);

afterEach(resetTimerMocks);
afterAll(resetTimerMocks);
