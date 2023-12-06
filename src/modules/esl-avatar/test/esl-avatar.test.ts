import {ESLAvatar} from '../core/esl-avatar';

describe('ESLAvatar tests', () => {
  beforeAll(() => {
    ESLAvatar.register();
  });

  describe('Static class methods', () => {
    test('has create() method that returns new instanse', () => {
      const $avatar = ESLAvatar.create();
      expect($avatar).toBeInstanceOf(ESLAvatar);
    });
  });

  describe('instance with image content', () => {
    let $avatar: ESLAvatar;

    beforeAll(() => {
      $avatar = ESLAvatar.create();
      $avatar.setAttribute('src', '/test/image/url');
      $avatar.setAttribute('username', 'Test user');
      document.body.appendChild($avatar);
    });

    afterAll(() => {
      document.body.innerHTML = '';
    });

    test('has with-image marker', () => {
      expect($avatar.$$attr('with-image')).not.toBeNull();
    });

    test('has image inside', () => {
      const $img = $avatar.querySelector('img');
      expect($img).not.toBeNull();
    });

    test('has image with esl-avatar-img class', () => {
      const $img = $avatar.querySelector('img');
      expect($img?.className).toBe('esl-avatar-img');
    });

    test('has image with proper alt attribute', () => {
      const $img = $avatar.querySelector('img');
      expect($img?.alt).toBe($avatar['abbr']);
    });

    test('has image with loading attribute', () => {
      const $img = $avatar.querySelector('img');
      expect($img?.loading).toBe('lazy');
    });

    test('has image with src attribute', () => {
      const $img = $avatar.querySelector('img');
      expect($img?.src).toBe('http://localhost/test/image/url');
    });

    test('has image with error handler', () => {
      const $img = $avatar.querySelector('img');
      expect($img?.onerror).toBe($avatar['_onImageError']);
    });
  });

  describe('instance with text only content', () => {
    let $avatar: ESLAvatar;

    beforeAll(() => {
      $avatar = ESLAvatar.create();
      $avatar.setAttribute('username', 'Test user');
      document.body.appendChild($avatar);
    });

    afterAll(() => {
      document.body.innerHTML = '';
    });

    test('has no with-image marker', () => {
      expect($avatar.$$attr('with-image')).toBeNull();
    });

    test('has abbr inside', () => {
      const $abbr = $avatar.querySelector('abbr');
      expect($abbr).not.toBeNull();
    });

    test('has abbr with esl-avatar-text class', () => {
      const $abbr = $avatar.querySelector('abbr');
      expect($abbr?.className).toBe('esl-avatar-text');
    });

    test('has abbr with proper text content', () => {
      const $abbr = $avatar.querySelector('abbr');
      expect($abbr?.textContent).toBe($avatar['abbr']);
    });
  });

  describe('abbreviation text generation', () => {
    let $avatar: ESLAvatar;

    beforeAll(() => {
      $avatar = ESLAvatar.create();
      $avatar.setAttribute('username', 'Bartholomew jojo Bart Simpson');
      document.body.appendChild($avatar);
    });

    afterAll(() => {
      document.body.innerHTML = '';
    });

    test('should return an abbr with word length not over the default limit', () => {
      expect($avatar['abbr']).toBe('Bj');
    });

    test('should return an abbr with word length not over the limit', () => {
      $avatar.abbrLength = 1;
      expect($avatar['abbr']).toBe('B');
    });

    test('should return an abbr for each word of the username when the limit is over the username word count', () => {
      $avatar.abbrLength = 5;
      expect($avatar['abbr']).toBe('BjBS');
    });

    test('should return an empty string when the username is empty', () => {
      $avatar.username = '';
      expect($avatar['abbr']).toBe('');
    });
  });
});
