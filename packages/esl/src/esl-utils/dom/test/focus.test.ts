import {getKeyboardFocusableElements} from '../focus';

describe('Focus Utils', () => {
  describe('getKeyboardFocusableElements with visibility check disabled', () => {
    test.each([
      // Links
      ['<a href>Hi<a>', 1],
      ['<a href="javascript:void(0)">Hi<a>', 1],
      ['<a href="#">Hi<a>', 1],
      ['<a>Hi<a>', 0],
      // Forms
      ['<button>Hi</button>', 1],
      ['<input type="text" />', 1],
      ['<textarea></textarea>', 1],
      ['<select></select>', 1],
      // Tabindex
      ['<div tabindex="0"></div>', 1],
      ['<div tabindex="1"></div>', 1],
      ['<div tabindex="-1"></div>', 0],
      // Disabled
      ['<button disabled>Hi</button>', 0],
      ['<input type="text" disabled />', 0],
      ['<textarea disabled></textarea>', 0],
      ['<select disabled></select>', 0],
      // Inert
      ['<div inert><button>Hi</button></div>', 0],
      ['<div inert><input type="text" /></div>', 0],
      ['<div inert><textarea></textarea></div>', 0],
      ['<div inert><select></select></div>', 0],
      // Embed
      ['<iframe></iframe>', 0],
      ['<object></object>', 0],
      ['<embed/>', 0],
      ['<output></output>', 1],
      ['<details></details>', 1],
      ['<summary></summary>', 1],
      ['<audio></audio>', 0],
      ['<video></video>', 0],
      ['<canvas></canvas>', 0],
      ['<map></map>', 0],
      ['<area/>', 0]
    ])('For %s content found %d focusable elements.', (content, count) => {
      const $container = document.createElement('div');
      $container.innerHTML = content;
      const $elements = getKeyboardFocusableElements($container, false);
      expect($elements.length).toBe(count);
    });
  });
  describe('getKeyboardFocusableElements with visibility check enabled', () => {
    test.each([
      ['<div style="display:none"><a href>Hi<a></div>', false, 0],
      ['<div style="visibility:hidden"><a href>Hi<a></div>', true, 0],
      ['<div style="opacity:0"><a href>Hi<a></div>', true, 1],
      ['<div style="position:absolute; top:-10000px"><a href>Hi<a></div>', true, 1],
    ])('For %s content with the area = %b found %d focusable elements', (content, hasBounds, count) => {
      const $container = document.createElement('div');
      $container.innerHTML = content;
      document.body.appendChild($container);

      getKeyboardFocusableElements($container, false).forEach(($el) => {
        vi.spyOn($el, 'getClientRects').mockReturnValueOnce(hasBounds ? [{}] as any : []);
      });
      const $elements = getKeyboardFocusableElements($container);
      expect($elements.length).toBe(count);
      document.body.removeChild($container);
    });
  });
});
