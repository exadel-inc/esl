import {VimeoProvider} from '../providers/vimeo-provider';

describe('ESLMedia: VimeoProvider', () => {
  test.each([
    ['', null],
    ['https://vimeo.com/', null],
    ['https://vimeo.com/557592709', {mediaId: '557592709'}],
    ['https://player.vimeo.com/video/', null],
    ['https://player.vimeo.com/video/557592709', {mediaId: '557592709'}]
  ])('parseUrl result for "%s"', (url, parsed) => {
    if (parsed) {
      expect(VimeoProvider.parseUrl(url)).toEqual(parsed);
    } else {
      expect(VimeoProvider.parseUrl(url)).toBeNull();
    }
  });
});
