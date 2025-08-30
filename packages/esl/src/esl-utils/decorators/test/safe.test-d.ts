import {safe} from '../safe';

class SafeTypesTest {

  @safe(1)
  get safeGetterNum(): number {
    return 1;
  }

  @safe('fallback')
  get safeGetterStr(): string {
    return 'test';
  }

  @safe(() => 1)
  get safeGetterNumFn(): number {
    return 1;
  }

  @safe(0)
  safeMethodNum(): number {
    return 1;
  }

  @safe('fallback')
  safeMethodStr(): string {
    return 'test';
  }

  @safe(() => 'fallback')
  safeMethodStrFn(): string {
    return 'test';
  }

  // @ts-expect-error
  @safe('fallback')
  get incompatibleProperty(): number {
    return 1;
  }

  // @ts-expect-error
  @safe(1)
  incompatibleMethod(): string {
    return 'test';
  }

  // @ts-expect-error
  @safe(true)
  incompatibleFallbackType(): string {
    return 'test';
  }

  // @ts-expect-error
  @safe(() => true)
  incompatibleFallbackFnType(): string {
    return 'test';
  }
}
