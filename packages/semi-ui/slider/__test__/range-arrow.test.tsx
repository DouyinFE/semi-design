import React from 'react';
import Slider from '../index';
import Tooltip from '../../tooltip';
it('honors showArrow on both range tooltips', () => {
    const wrapper = mount(<Slider range defaultValue={[20, 60]} showArrow={false} />);
    try {
        expect(wrapper.find(Tooltip)).toHaveLength(2);
        wrapper.find(Tooltip).forEach(tooltip => expect(tooltip.prop('showArrow')).toBe(false));
    } finally { wrapper.unmount(); }
});
