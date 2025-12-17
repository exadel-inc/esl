import { vi } from 'vitest';

type TimerId = number;

let nextId = 1;

const timeouts = new Map<TimerId, ReturnType<typeof globalThis.setTimeout>>();
const intervals = new Map<TimerId, ReturnType<typeof globalThis.setInterval>>();

const realSetTimeout = globalThis.setTimeout;
const realClearTimeout = globalThis.clearTimeout;
const realSetInterval = globalThis.setInterval;
const realClearInterval = globalThis.clearInterval;

vi.spyOn(globalThis, 'setTimeout').mockImplementation(
  (callback: TimerHandler, delay?: number, ...args: any[]): TimerId => {
    const id = nextId++;

    // console.log('id assigned', id); 
    const timeout = realSetTimeout(() => {
      // console.log('Timeout fired', id);
      if (!timeouts.has(id)) return;
      // console.log('setTimeout mock', id, timeout, callback.toString());
      timeouts.delete(id);

      if (typeof callback === 'function') {
        callback(...args);
      } else {
        eval(callback);
      }
    }, delay);

    timeouts.set(id, timeout);
    return id;
  }
);

vi.spyOn(globalThis, 'clearTimeout').mockImplementation((id?: TimerId) => {
  // console.log('clearTimeout mock', id);
  if (!id) return;
  const timeout = timeouts.get(id);
  // console.log('clearTimeout mock', id, timeout);
  if (!timeout) return;
  realClearTimeout(timeout);
  timeouts.delete(id);
});

vi.spyOn(globalThis, 'setInterval').mockImplementation(
  (callback: TimerHandler, delay?: number, ...args: any[]): TimerId => {
    const id = nextId++;
    const interval = realSetInterval(() => {
      if (!intervals.has(id)) return;
      if (typeof callback === 'function') {
        callback(...args);
      } else {
        eval(callback);
      }
    }, delay);

    intervals.set(id, interval);
    return id;
  }
);

vi.spyOn(globalThis, 'clearInterval').mockImplementation((id?: TimerId) => {
  if (!id) return;
  const interval = intervals.get(id);
  if (!interval) return;
  realClearInterval(interval);
  intervals.delete(id);
});

if (typeof window !== 'undefined') {
  window.setTimeout = globalThis.setTimeout;
  window.clearTimeout = globalThis.clearTimeout;
  window.setInterval = globalThis.setInterval;
  window.clearInterval = globalThis.clearInterval;
}
