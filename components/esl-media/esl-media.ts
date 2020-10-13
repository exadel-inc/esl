import './ts/providers/html5/video-provider';
import './ts/providers/html5/audio-provider';

import './ts/providers/youtube-provider';
import './ts/providers/iframe-provider';
import './ts/providers/brightcove-provider';

/**
 * Tag declaration interface of ESLMedia element
 * Used for JSX declaration
 */
export type ESLMediaTag = ({
    /** Define media player id */
    'media-id': string;
    /** Define media player type */
    'media-type': string;
} | {
    /** Define media source path */
    'media-src': string;
    /** Define media player type */
    'media-type': string;
}) & {
    /** Define media player group */
    group: string;
    /** Define media fill mode */
    'fill-mode'?: string;
    /** Define preferable aspect ratio */
    'aspect-ratio'?: string;

    /** Define prevent loading marker */
    disabled?: boolean;
    /** Define autoplay marker */
    autoplay?: boolean;
    /** Define auto grab focus on play marker */
    autofocus?: boolean;
    /** Mute media source */
    muted?: boolean;
    /** Define play in loop marker */
    loop?: boolean;
    /** Allow show controls */
    controls?: boolean;
    /** Define viewport control marker */
    'play-in-viewport'?: boolean;
    /** Define preload media param */
    'preload'?: string;
    /** Allow play media inline */
    'playsinline'?: boolean;

    /** Optional BC provider player id */
    'data-player-id'?: string;
    /** Optional BC provider account id */
    'data-account-id'?: string;

    /** Allowed children */
    children: [];
};

export * from './ts/esl-media';
