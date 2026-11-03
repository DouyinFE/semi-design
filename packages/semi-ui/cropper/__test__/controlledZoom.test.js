import React from 'react';
import Cropper from '../index';

describe('Cropper controlled zoom', () => {
    beforeEach(() => {
        rs.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(400);
        rs.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(300);
    });
    afterEach(() => { rs.restoreAllMocks(); });

    it.each([undefined, 0])('updates zoom with rotate=%s', rotate => {
        const wrapper = mount(<Cropper src="image.png" zoom={1} rotate={rotate} />);
        try {
            wrapper.find('img').at(0).simulate('load', { target: { naturalWidth: 400, naturalHeight: 200 } });
            wrapper.setProps({ zoom: 2 });
            expect(wrapper.find('img').at(0).prop('style').width).toBe(800);
            expect(wrapper.find('img').at(0).prop('style').height).toBe(400);
            wrapper.setProps({ zoom: 1 });
            expect(wrapper.find('img').at(0).prop('style').width).toBe(400);
        } finally { wrapper.unmount(); }
    });

    it('supports controlled rotation without a zoom prop', () => {
        const wrapper = mount(<Cropper src="image.png" rotate={0} />);
        try {
            wrapper.find('img').at(0).simulate('load', { target: { naturalWidth: 400, naturalHeight: 200 } });
            wrapper.setProps({ rotate: 90 });
            const style = wrapper.find('img').at(0).prop('style');
            expect(style.width).toBe(400);
            expect(style.height).toBe(200);
            expect(style.transform).toContain('rotate(90deg)');
        } finally { wrapper.unmount(); }
    });
});
