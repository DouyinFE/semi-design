import React from 'react';
import { mount } from 'enzyme';
import Rating from '../index';
import Tooltip from '../../tooltip';

describe('Rating tooltip focus', () => {
    it.each([false, true])('keeps radio nodes and focus across hover changes with allowHalf=%s', allowHalf => {
        const container = document.createElement('div');
        document.body.appendChild(container);
        const wrapper = mount(<Rating defaultValue={1} allowHalf={allowHalf}
            tooltips={['one', 'two', 'three', 'four', 'five']} />, { attachTo: container });
        try {
            const radio = container.querySelector('[role="radio"][tabindex="0"]');
            radio.focus();
            expect(document.activeElement).toBe(radio);
            wrapper.find('.semi-rating-star-wrapper').at(0).simulate('mousemove', { pageX: 10 });
            expect(wrapper.find(Tooltip).at(0).prop('visible')).toBe(true);
            expect(radio.isConnected).toBe(true);
            expect(document.activeElement).toBe(radio);

            wrapper.find('.semi-rating-star-wrapper').at(1).simulate('mousemove', { pageX: 10 });
            expect(wrapper.find(Tooltip).at(0).prop('visible')).toBe(false);
            expect(wrapper.find(Tooltip).at(1).prop('visible')).toBe(true);
            wrapper.find('ul.semi-rating').simulate('mouseleave');
            expect(wrapper.find(Tooltip).everyWhere(tooltip => tooltip.prop('visible') === false)).toBe(true);
            expect(radio.isConnected).toBe(true);
            expect(document.activeElement).toBe(radio);
        } finally { wrapper.unmount(); container.remove(); }
    });
});
