import {decorate} from '../decorate';
import {debounce} from '../../async/debounce';
import {throttle} from '../../async/throttle';

// Type regression coverage for wrappers that augment the callable
// with extra API (`promise`, `cancel`) while preserving method compatibility.
class DecorateTypesTest {
  @decorate(debounce, 50)
  onDebounced(): void {}

  @decorate(throttle, 50)
  onThrottled(event: MouseEvent): void {}
}
