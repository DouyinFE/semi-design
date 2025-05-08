import { BASE_CLASS_PREFIX } from '../base/constants';

const cssClasses = {
    PREFIX: `${BASE_CLASS_PREFIX}-videoPlayer`,
    PREFIX_CONTROLS: `${BASE_CLASS_PREFIX}-videoPlayer-controls`,
    PREFIX_PROGRESS: `${BASE_CLASS_PREFIX}-videoPlayer-progress`,
} as const;

const strings = {
    PLAY: 'play',
    NEXT: 'next',
    TIME: 'time',
    VOLUME: 'volume',
    PLAYBACK_RATE: 'playbackRate',
    QUALITY: 'quality',
    ROUTE: 'route',
    MIRROR: 'mirror',
    FULLSCREEN: 'fullscreen',
    PICTURE_IN_PICTURE: 'pictureInPicture',
} as const;

const numbers = {
    DEFAULT_VOLUME: 100,
    DEFAULT_SEEK_TIME: 10,
    DEFAULT_VOLUME_STEP: 10,
    DEFAULT_PLAYBACK_RATE: 1,
} as const;

export { cssClasses, strings, numbers }; 