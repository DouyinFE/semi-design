import React from 'react';
import { mount } from 'enzyme';
import Cropper from '../index';

describe('Cropper source transforms', () => {
    it.each([1, 1.5, 2])('keeps zoom %s when a replacement image loads', zoom => {
        const wrapper = mount(<Cropper src="first.png" zoom={zoom} rotate={30} />);
        const component = wrapper.instance();
        component.foundation.containerData = { width: 500, height: 320 };
        component.foundation.handleImageLoad({ target: { naturalWidth: 800, naturalHeight: 500 } });
        wrapper.update();
        wrapper.setProps({ src: 'second.png' });
        component.foundation.handleImageLoad({ target: { naturalWidth: 500, naturalHeight: 800 } });
        wrapper.update();
        expect(wrapper.state('zoom')).toBe(zoom);
        expect(wrapper.state('rotate')).toBe(30);
        expect(wrapper.state('imgData').width).toBe(200 * zoom);
        expect(wrapper.state('imgData').height).toBe(320 * zoom);
        wrapper.unmount();
    });

    it('keeps the user zoom when changing an uncontrolled image', () => {
        const wrapper = mount(<Cropper src="first.png" />);
        const component = wrapper.instance();
        component.foundation.containerData = { width: 500, height: 320 };
        component.foundation.handleImageLoad({ target: { naturalWidth: 800, naturalHeight: 500 } });
        component.setState({ zoom: 2, rotate: 30 });
        wrapper.setProps({ src: 'second.png' });
        component.foundation.handleImageLoad({ target: { naturalWidth: 500, naturalHeight: 800 } });
        wrapper.update();
        expect(wrapper.state('imgData').width).toBe(400);
        expect(wrapper.state('imgData').height).toBe(640);
        expect(wrapper.state('rotate')).toBe(30);
        wrapper.unmount();
    });
});
