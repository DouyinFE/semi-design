import React from 'react';
import { mount } from 'enzyme';
import Carousel from '../index';

function create(props) {
    return mount(<Carousel activeIndex={0} autoPlay={false} {...props}><div>one</div><div>two</div><div>three</div></Carousel>);
}
describe('Carousel controlled transitions', () => {
    it('animates a direct controlled-index update', () => {
        const wrapper = create();
        try {
            wrapper.setProps({ activeIndex: 1 });
            expect(wrapper.find('.semi-carousel-content-item-current').hasClass('semi-carousel-content-item-slide-in')).toBe(true);
            expect(wrapper.find('.semi-carousel-content-item').at(0).hasClass('semi-carousel-content-item-slide-out')).toBe(true);
        } finally { wrapper.unmount(); }
    });
    it('uses the previously displayed index on later prop updates', () => {
        const wrapper = create();
        try {
            wrapper.setProps({ activeIndex: 1 });
            wrapper.setProps({ activeIndex: 2 });
            expect(wrapper.find('.semi-carousel-content-item').at(1).hasClass('semi-carousel-content-item-slide-out')).toBe(true);
            expect(wrapper.find('.semi-carousel-content-item').at(0).hasClass('semi-carousel-content-item-slide-out')).toBe(false);
        } finally { wrapper.unmount(); }
    });
    it('preserves an explicit previous-wrap direction and callback count', () => {
        const onChange = rs.fn();
        const wrapper = create({ onChange });
        try {
            wrapper.instance().prev();
            expect(onChange).toHaveBeenCalledTimes(1);
            expect(onChange).toHaveBeenCalledWith(2, 0);
            wrapper.setProps({ activeIndex: 2 });
            expect(wrapper.state('isReverse')).toBe(true);
            expect(onChange).toHaveBeenCalledTimes(1);
        } finally { wrapper.unmount(); }
    });
});
