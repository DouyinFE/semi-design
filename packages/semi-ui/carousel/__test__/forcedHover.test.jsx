import React from 'react';
import { mount } from 'enzyme';
import Carousel from '../index';

function create(props) {
    return mount(<Carousel activeIndex={0} speed={0} autoPlay={{ interval: 800, hoverToPause: true }} {...props}><div>one</div><div>two</div></Carousel>);
}
describe('Carousel explicit playback and hover', () => {
    beforeEach(() => { rs.useFakeTimers(); });
    afterEach(() => { rs.useRealTimers(); });
    it('resumes explicitly started controlled playback after leaving', () => {
        const onChange = rs.fn();
        const wrapper = create({ onChange });
        try {
            wrapper.instance().play();
            rs.advanceTimersByTime(801);
            expect(onChange).toHaveBeenCalledTimes(1);
            wrapper.find('.semi-carousel').simulate('mouseenter');
            rs.advanceTimersByTime(1600);
            const paused = onChange.mock.calls.length;
            wrapper.find('.semi-carousel').simulate('mouseleave');
            rs.advanceTimersByTime(1800);
            expect(onChange.mock.calls.length).toBeGreaterThan(paused);
        } finally { wrapper.unmount(); }
    });
    it('does not start controlled playback just because the mouse leaves', () => {
        const onChange = rs.fn();
        const wrapper = create({ onChange });
        try {
            wrapper.find('.semi-carousel').simulate('mouseenter');
            rs.advanceTimersByTime(600);
            wrapper.find('.semi-carousel').simulate('mouseleave');
            rs.advanceTimersByTime(1800);
            expect(onChange).not.toHaveBeenCalled();
        } finally { wrapper.unmount(); }
    });
    it('does not restart after an explicit stop', () => {
        const onChange = rs.fn();
        const wrapper = create({ onChange });
        try {
            wrapper.instance().play();
            rs.advanceTimersByTime(801);
            wrapper.instance().stop();
            const stopped = onChange.mock.calls.length;
            wrapper.find('.semi-carousel').simulate('mouseleave');
            rs.advanceTimersByTime(1800);
            expect(onChange).toHaveBeenCalledTimes(stopped);
        } finally { wrapper.unmount(); }
    });
});
