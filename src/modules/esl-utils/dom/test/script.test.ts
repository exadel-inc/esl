import {loadScript} from '../script';

describe('loadScript', () => {
  beforeEach(() => {
    document.title = 'loadScript test page';
  });
  afterEach(() => {
    document.head.innerHTML = '';
  });

  test('should create a script element with a specified id in the head', () => {
    loadScript('test-script', 'http://example.com');
    const script = document.querySelector('head > script#test-script');
    expect(script).toBeInstanceOf(HTMLScriptElement);
  });
  test('should create a script element with a specified URL as src', () => {
    loadScript('test-script', 'http://example.org');
    const script = document.querySelector('head > script#test-script') as HTMLScriptElement;
    expect(script && script.getAttribute('src')).toBe('http://example.org');
  });
  test('should use the existing script element for the same content instead of creating a new one', () => {
    loadScript('test-script', 'http://example.com');
    loadScript('test-script', 'http://example.com');
    loadScript('test-script', 'http://example.com');
    const scripts = document.querySelectorAll('head > script[src="http://example.com"]');
    expect(scripts).toHaveLength(1);
  });

  describe('should create attributes on the script element according to the passed list', () => {
    test('should create an attribute with value when passed string value', () => {
      loadScript('test', 'http://example.com', {crossorigin: 'anonymous'});
      const script = document.querySelector('head > script#test') as HTMLScriptElement;
      expect(script && script.getAttribute('crossorigin')).toBe('anonymous');
    });
    test('should create an attribute without value when passed a true boolean value', () => {
      loadScript('test', 'http://example.com', {async: true});
      const script = document.querySelector('head > script#test') as HTMLScriptElement;
      expect(script && script.getAttribute('async')).toBe('');
    });
    test('should not create an attribute when passed a false boolean value', () => {
      loadScript('test', 'http://example.com', {nomodule: false});
      const script = document.querySelector('head > script#test') as HTMLScriptElement;
      expect(script && script.getAttribute('nomodule')).toBe(null);
    });
    test('should have all attributes specified by the list', () => {
      loadScript('test', 'http://example.com', {async: true, crossorigin: 'anonymous', referrerpolicy: 'no-referrer'});
      const script = document.querySelector('head > script#test') as HTMLScriptElement;
      expect(script && script.hasAttribute('async')).toBe(true);
      expect(script && script.hasAttribute('crossorigin')).toBe(true);
      expect(script && script.hasAttribute('referrerpolicy')).toBe(true);
    });
    test('should be able to redeclare an implicitly defined attribute async', () => {
      loadScript('test', 'http://example.com', {async: false});
      const script = document.querySelector('head > script#test') as HTMLScriptElement;
      expect(script && script.getAttribute('async')).toBe(null);
    });
  });

  describe('should return a Promise', () => {
    let promise: Promise<Event>;
    let script: HTMLScriptElement | null;
    beforeEach(() => {
      promise = loadScript('test', 'http://example.com/');
      script = document.querySelector('head > script#test');
    });
    test('should return Promise', () => {
      return expect(promise).toBeInstanceOf(Promise);
    });

    test('should return a Promise that resolves with instance of Event on successful script loading', () => {
      script?.dispatchEvent(new Event('load'));
      return expect(promise).resolves.toBeInstanceOf(Event);
    });
    test('should return a Promise that resolves with load type Event on successful script loading', () => {
      script?.dispatchEvent(new Event('load'));
      return expect(promise).resolves.toMatchObject({type: 'load'});
    });
    test('should return a Promise that rejects with instance of Event if the script fails to load', () => {
      script?.dispatchEvent(new Event('error'));
      return expect(promise).rejects.toBeInstanceOf(Event);
    });
    test('should return a Promise that resolves with error type Event if the script fails to load', () => {
      script?.dispatchEvent(new Event('error'));
      return expect(promise).rejects.toMatchObject({type: 'error'});
    });
  });

  describe('should have proper state attribute', () => {
    let script: HTMLScriptElement | null;
    beforeEach(() => {
      loadScript('test', 'http://example.com/').catch(() => {});
      script = document.querySelector('head > script#test');
    });
    test('should not have a state attribute on pending script loading', () => {
      expect(script?.getAttribute('state')).toBe(null);
    });
    test('should have state="success" attribute on successful script loading', () => {
      script?.dispatchEvent(new Event('load'));
      expect(script?.getAttribute('state')).toBe('success');
    });
    test('should have state="error" attribute on failed script loading', async () => {
      script?.dispatchEvent(new Event('error'));
      return expect(script?.getAttribute('state')).toBe('error');
    });
  });
});
