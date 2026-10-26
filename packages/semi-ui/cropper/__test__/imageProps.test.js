import React from 'react';
import { mount } from 'enzyme';
import Cropper from '../index';

describe('Cropper image props', () => {
    it('passes image attributes and preserves the cropper layout', () => {
        const wrapper = mount(<Cropper src="source.png" imgProps={{ alt: 'Photo', decoding: 'async', crossOrigin: 'use-credentials', className: 'photo', style: { opacity: 0.5, width: 999 }, 'data-photo': 'one' }} />);
        const image = wrapper.find('img').first();
        expect(image.prop('alt')).toBe('Photo');
        expect(image.prop('decoding')).toBe('async');
        expect(image.prop('crossOrigin')).toBe('use-credentials');
        expect(image.prop('data-photo')).toBe('one');
        expect(image.hasClass('photo')).toBe(true);
        expect(image.hasClass('semi-cropper-img')).toBe(true);
        expect(image.prop('style').opacity).toBe(0.5);
        expect(image.prop('style').width).toBe(0);
        wrapper.unmount();
    });

    it('keeps the internal load handler before notifying the caller', () => {
        let event;
        const preview = document.createElement('div');
        const wrapper = mount(<Cropper src="source.png" preview={() => preview} imgProps={{ onLoad: value => { event = value; } }} />);
        const component = wrapper.instance();
        component.foundation.containerData = { width: 500, height: 320 };
        const target = { naturalWidth: 800, naturalHeight: 500 };
        wrapper.find('img').first().simulate('load', { target });
        expect(wrapper.state('loaded')).toBe(true);
        expect(wrapper.state('imgData').width).toBe(500);
        expect(event.target).toBe(target);
        expect(wrapper.find('img').at(1).prop('alt')).toBe('');
        expect(preview.firstElementChild.getAttribute('alt')).toBe('');
        wrapper.unmount();
    });

    it('keeps the default crossOrigin and allows loading without imgProps', () => {
        const wrapper = mount(<Cropper src="source.png" />);
        expect(wrapper.find('img').first().prop('crossOrigin')).toBe('anonymous');
        wrapper.unmount();
    });
});
