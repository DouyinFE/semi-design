import React from 'react';
import { mount } from 'enzyme';
import Cropper from '../index';

describe('Cropper drag lifecycle', () => {
    let wrapper;
    let foundation;
    let container;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.removeEventListener('mousemove', foundation.handleCornerMouseMove);
        document.removeEventListener('mousemove', foundation.handleCornerAspectMouseMove);
        document.removeEventListener('mouseup', foundation.handleCornerMouseUp);
        foundation.unBindImgMoveEvent();
        if (wrapper.length) {
            wrapper.unmount();
        }
        container.remove();
    });

    it.each([undefined, 2])('ends the active resize when aspectRatio changes from %s', aspectRatio => {
        wrapper = mount(<Cropper src="source.png" aspectRatio={aspectRatio} />, { attachTo: container });
        const component = wrapper.instance();
        foundation = component.foundation;
        component.foundation.containerData = { width: 500, height: 320 };
        component.foundation.handleImageLoad({ target: { naturalWidth: 800, naturalHeight: 500 } });
        wrapper.update();
        wrapper.find('[data-dir="br"]').simulate('mousedown', { clientX: 500, clientY: 300, currentTarget: { dataset: { dir: 'br' } }, preventDefault() {} });
        wrapper.setProps({ aspectRatio: aspectRatio ? undefined : 2 });
        const before = wrapper.state('cropperBox');
        document.dispatchEvent(new MouseEvent('mousemove', { clientX: 200, clientY: 100, buttons: 1 }));
        wrapper.update();
        expect(wrapper.state('cropperBox')).toEqual(before);
        document.dispatchEvent(new MouseEvent('mouseup'));
    });

    it('removes image dragging listeners on unmount', () => {
        wrapper = mount(<Cropper src="source.png" />, { attachTo: container });
        const component = wrapper.instance();
        foundation = component.foundation;
        component.foundation.containerData = { width: 500, height: 320 };
        component.foundation.handleImageLoad({ target: { naturalWidth: 800, naturalHeight: 500 } });
        wrapper.update();
        const mask = container.querySelector('.semi-cropper-mask');
        mask.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: 10, clientY: 10 }));
        let updates = 0;
        const setState = component.setState.bind(component);
        component.setState = (...args) => { updates++; setState(...args); };
        wrapper.unmount();
        document.dispatchEvent(new MouseEvent('mousemove', { clientX: 30, clientY: 30, buttons: 1 }));
        document.dispatchEvent(new MouseEvent('mouseup'));
        expect(updates).toBe(0);
    });
});
