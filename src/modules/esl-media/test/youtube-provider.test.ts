import {YouTubeProvider} from '../providers/youtube-provider';

describe('ESLMedia: YoutubeProvider', () => {
  test.each([
    ['', null],
    ['https://youtu.be/', null],
    ['https://youtu.be/1234567', {mediaId: '1234567'}],
    ['https://www.youtube.com/watch', null],
    ['https://www.youtube.com/watch?v=1234567', {mediaId: '1234567'}]
  ])('parseUrl result for "%s"', (url, parsed) => {
    if (parsed) {
      expect(YouTubeProvider.parseUrl(url)).toEqual(parsed);
    } else {
      expect(YouTubeProvider.parseUrl(url)).toBeNull();
    }
  });
});
