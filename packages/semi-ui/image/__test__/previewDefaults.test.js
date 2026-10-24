import React from 'react';
import { mount } from 'enzyme';
import Image from '../image';
import Preview from '../preview';
import PreviewInner from '../previewInner';

// React 19 automatic JSX leaves class defaultProps out of child element props.
const imageElement = props => ({ ...React.createElement(Image, props), props });

describe('ImagePreview child defaults', () => {
    [{ src: 'first.png' }, { src: 'first.png', preview: undefined }].forEach(props => {
        it(`includes images with ${'preview' in props ? 'undefined' : 'omitted'} preview props`, () => {
            const wrapper = mount(<Preview lazyLoad={false}>{imageElement(props)}</Preview>);
            try {
                expect(wrapper.find(PreviewInner).prop('src')).toEqual(['first.png']);
                expect(wrapper.find(Image).prop('imageID')).toBe(0);
            } finally {
                wrapper.unmount();
            }
        });
    });

    it('keeps disabled images out and preserves custom preview sources and indexes', () => {
        const wrapper = mount(<Preview lazyLoad={false}>
            <div>
                {imageElement({ src: 'disabled.png', preview: false })}
                {imageElement({ src: 'default.png' })}
                {imageElement({ src: 'thumbnail.png', preview: { src: 'full.png', previewTitle: 'Full image' } })}
                {imageElement({ src: 'null.png', preview: null })}
                {imageElement({ src: 'enabled.png', preview: true })}
            </div>
        </Preview>);
        try {
            expect(wrapper.find(PreviewInner).prop('src')).toEqual(['default.png', 'full.png', 'enabled.png']);
            expect(wrapper.find(Image).map(image => image.prop('imageID'))).toEqual([undefined, 0, 1, undefined, 2]);
            expect(wrapper.instance().loopImageIndex().titles).toEqual([undefined, 'Full image', undefined]);
        } finally {
            wrapper.unmount();
        }
    });
});
