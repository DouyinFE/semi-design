import React from 'react';
import { act } from 'react-dom/test-utils';
import Carousel from '../index';

const content = [<div key="a">First</div>, <div key="b">Second</div>, <div key="c">Third</div>];

describe('Carousel hover timers', () => {
    beforeEach(() => { rs.useFakeTimers(); });
    afterEach(() => { rs.clearAllTimers(); rs.useRealTimers(); });

    it.each(['mouseEnter', 'mouseLeave'])('cancels pending %s work when unmounted', event => {
        const onChange = rs.fn();
        const wrapper = mount(<Carousel autoPlay={{ interval: 1000, hoverToPause: true }} onChange={onChange}>{content}</Carousel>);
        wrapper.find('.semi-carousel').simulate(event);
        wrapper.setProps({ className: 'updated-before-unmount' });
        act(() => { rs.advanceTimersByTime(100); });
        wrapper.unmount();
        expect(rs.getTimerCount()).toBe(0);
        act(() => { rs.advanceTimersByTime(5000); });
        expect(onChange).not.toHaveBeenCalled();
        expect(rs.getTimerCount()).toBe(0);
    });

    it('debounces repeated leave events across renders before resuming autoplay', () => {
        const onChange = rs.fn();
        const wrapper = mount(<Carousel speed={0} autoPlay={{ interval: 100, hoverToPause: true }} onChange={onChange}>{content}</Carousel>);
        try {
            wrapper.find('.semi-carousel').simulate('mouseEnter');
            act(() => { rs.advanceTimersByTime(400); });
            onChange.mockClear();
            wrapper.find('.semi-carousel').simulate('mouseLeave');
            act(() => { rs.advanceTimersByTime(100); });
            wrapper.setProps({ className: 'updated' });
            wrapper.find('.semi-carousel').simulate('mouseLeave');
            act(() => { rs.advanceTimersByTime(400); });
            expect(onChange).not.toHaveBeenCalled();
            act(() => { rs.advanceTimersByTime(100); });
            expect(onChange).toHaveBeenCalledTimes(1);
        } finally { wrapper.unmount(); }
    });
});
