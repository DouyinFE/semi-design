import PreviewInnerFoundation from '@douyinfe/semi-foundation/image/previewInnerFoundation';

describe('ImagePreview preload cache', () => {
    let images;
    let state;
    let foundation;

    beforeEach(() => {
        images = [];
        const NativeImage = window.Image;
        rs.stubGlobal('Image', function () {
            const image = new NativeImage();
            images.push(image);
            return image;
        });
        state = {
            imgSrc: ['first.png', 'second.png', 'third.png'],
            imgLoadStatus: new Map(),
            currentIndex: 0,
            direction: 'next',
        };
        foundation = new PreviewInnerFoundation({
            getProps: () => ({ preLoad: true, preLoadGap: 1, infinite: false, currentIndex: 0 }),
            getStates: () => state,
            setState: changes => Object.assign(state, changes),
        });
    });

    afterEach(() => rs.unstubAllGlobals());

    it('uses the original relative source when caching an initial preload', () => {
        foundation.preloadGapImage();
        expect(images).toHaveLength(1);
        expect(images[0].src).toBe('http://localhost/second.png');
        images[0].onload();
        foundation.preloadSingleImage();
        expect(images).toHaveLength(1);
    });

    it('does not preload a source that already loaded at another index', () => {
        state.imgSrc = ['same.png', 'same.png'];
        foundation.setLoadSuccessStatus('same.png');
        foundation.preloadSingleImage();
        expect(images).toHaveLength(0);
    });

    it('retries an uncached preload and skips it after success', () => {
        foundation.preloadSingleImage();
        foundation.preloadSingleImage();
        expect(images).toHaveLength(2);
        images[1].onload();
        foundation.preloadSingleImage();
        expect(images).toHaveLength(2);
    });

    it('does not confuse a numeric source with another image index', () => {
        state.imgSrc = ['1', 'second.png'];
        foundation.setLoadSuccessStatus('1');
        foundation.preloadSingleImage();
        expect(images).toHaveLength(1);
        expect(images[0].src).toBe('http://localhost/second.png');
    });

    it('keeps the source cache as an immutable Map', () => {
        const previous = state.imgLoadStatus;
        foundation.setLoadSuccessStatus('first.png');
        foundation.setLoadSuccessStatus('second.png');
        expect(state.imgLoadStatus).toBeInstanceOf(Map);
        expect(Array.from(state.imgLoadStatus.keys())).toEqual(['first.png', 'second.png']);
        expect(previous.size).toBe(0);
    });
});
