import {resolveDomTarget} from '../dom-target';

describe('resolveDomTarget (abstract/dom-target) works correctly', () => {
  test.each([
    null,
    undefined,
    0,
    {},
    {nodeType: 1},
    {nodeType: 1, nodeName: 'DIV'},
    []
  ])('resolveDomTarget returns null for non-Element (%o)', (value) => {
    expect(resolveDomTarget(value)).toBeNull();
  });

  test('resolveDomTarget resolves an DOM Element from the current global realm (window)', () => {
    const el = document.createElement('div');
    expect(resolveDomTarget(el)).toBe(el);
  });

  test('resolveDomTarget resolves an DOM Element from ESLDomElementRelated', () => {
    const $host = document.createElement('div');
    const obj = {$host};
    expect(resolveDomTarget(obj)).toBe($host);
  });

  test('resolveDomTarget resolves an DOM Element from different realms', () => {
    const $iframe: HTMLIFrameElement = document.createElement('iframe');
    document.body.appendChild($iframe);
    const $iframeDoc = $iframe.contentDocument as Document;
    const el = $iframeDoc.createElement('div');
    $iframeDoc.body.appendChild(el);

    expect(resolveDomTarget(el)).toBe(el);
    $iframe.remove();
  });
});
