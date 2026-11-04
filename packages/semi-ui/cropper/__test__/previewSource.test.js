import CropperFoundation from '../../../semi-foundation/cropper/foundation';

function createCropper(previewContainer) {
    const container = document.createElement('div');
    Object.defineProperties(container, { clientWidth: { value: 480 }, clientHeight: { value: 320 } });
    const props = { src: 'first.png', preview: () => previewContainer, defaultAspectRatio: 1 };
    const state = {};
    const foundation = new CropperFoundation({
        getContainer: () => container,
        getProps: () => props,
        getStates: () => state,
        setState: update => Object.assign(state, update),
    });
    foundation.init();
    const load = src => {
        props.src = src;
        foundation.handleImageLoad({ target: { naturalWidth: 600, naturalHeight: 400 } });
    };
    return { foundation, props, load };
}

describe('Cropper preview source updates', () => {
    it('keeps the preview on the current source after each image load', () => {
        const preview = document.createElement('div');
        const { foundation, load } = createCropper(preview);
        try {
            for (const src of ['first.png', 'second.png', 'third.png']) {
                load(src);
                expect(preview.querySelectorAll('img')).toHaveLength(1);
                expect(preview.querySelector('img').getAttribute('src')).toBe(src);
            }
        } finally {
            foundation.destroy();
        }
    });

    it('removes all owned preview images on destroy after replacing the source', () => {
        const preview = document.createElement('div');
        const { foundation, load } = createCropper(preview);
        load('first.png');
        load('second.png');
        foundation.destroy();
        expect(preview.querySelectorAll('img')).toHaveLength(0);
    });

    it('preserves consumer content in the preview container', () => {
        const preview = document.createElement('div');
        const consumerImage = document.createElement('img');
        consumerImage.src = 'consumer.png';
        preview.appendChild(consumerImage);
        const { foundation, load } = createCropper(preview);
        load('first.png');
        load('second.png');
        foundation.destroy();
        expect([...preview.children]).toEqual([consumerImage]);
    });

    it('cleans up the previous preview container when the target changes', () => {
        const first = document.createElement('div');
        const second = document.createElement('div');
        const { foundation, props, load } = createCropper(first);
        try {
            load('first.png');
            props.preview = () => second;
            load('second.png');
            expect(first.querySelectorAll('img')).toHaveLength(0);
            expect(second.querySelectorAll('img')).toHaveLength(1);
            expect(second.querySelector('img').getAttribute('src')).toBe('second.png');
        } finally {
            foundation.destroy();
        }
    });

    it('does not create preview images when the callback returns no container', () => {
        const { foundation, load } = createCropper(null);
        expect(() => load('first.png')).not.toThrow();
        foundation.destroy();
    });
});
