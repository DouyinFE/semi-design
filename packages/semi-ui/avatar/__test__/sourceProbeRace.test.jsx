import React from 'react';
import { mount } from 'enzyme';
import Avatar from '../index';

describe('Avatar image probe ownership', () => {
    let NativeImage;
    let images;
    beforeEach(() => {
        NativeImage = global.Image;
        images = [];
        global.Image = class { constructor() { images.push(this); } };
    });
    afterEach(() => { global.Image = NativeImage; });
    it('ignores an older failure after a newer source succeeds', () => {
        const wrapper = mount(<Avatar src="initial">fallback</Avatar>);
        try {
            wrapper.setProps({ src: 'older' });
            wrapper.setProps({ src: 'newer' });
            images[1].onload();
            images[0].onerror();
            wrapper.update();
            expect(wrapper.find('img').prop('src')).toBe('newer');
        } finally { wrapper.unmount(); }
    });
    it('ignores an older success after the current source fails', () => {
        const wrapper = mount(<Avatar src="initial">fallback</Avatar>);
        try {
            wrapper.setProps({ src: 'older' });
            wrapper.setProps({ src: 'newer' });
            images[1].onerror();
            images[0].onload();
            wrapper.update();
            expect(wrapper.find('img')).toHaveLength(0);
            expect(wrapper.text()).toBe('fallback');
        } finally { wrapper.unmount(); }
    });
    it('does not update an unmounted avatar', () => {
        const wrapper = mount(<Avatar src="initial">fallback</Avatar>);
        wrapper.setProps({ src: 'newer' });
        const update = rs.spyOn(wrapper.instance(), 'setState');
        wrapper.unmount();
        images[0].onload();
        expect(update).not.toHaveBeenCalled();
    });
    it('retains the latest probe failure and abort behavior', () => {
        const wrapper = mount(<Avatar src="initial">fallback</Avatar>);
        try {
            wrapper.setProps({ src: 'failure' });
            images[0].onerror();
            wrapper.update();
            expect(wrapper.find('img')).toHaveLength(0);
            wrapper.setProps({ src: 'abort' });
            images[1].onabort();
            wrapper.update();
            expect(wrapper.find('img')).toHaveLength(0);
        } finally { wrapper.unmount(); }
    });
});
