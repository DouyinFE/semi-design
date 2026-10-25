import React from 'react';
import { mount } from 'enzyme';
import ScrollItem from '../scrollItem';

describe('ScrollItem pending tasks on unmount', () => {
    const list = Array.from({ length: 10 }, (_, value) => ({ value }));
    afterEach(() => jest.useRealTimers());

    [false, true].forEach(cycled => {
        it(`cancels a pending selection with cycled=${cycled}`, () => {
            jest.useFakeTimers();
            const onSelect = jest.fn();
            const wrapper = mount(<ScrollItem list={list} cycled={cycled} motion={false} onSelect={onSelect} />);
            wrapper.instance().clickToSelectItem({ target: wrapper.find('li').at(2).getDOMNode() });
            wrapper.unmount();
            jest.runAllTimers();
            expect(onSelect).not.toHaveBeenCalled();
        });
    });

    it('stops an active scroll animation on unmount', () => {
        const wrapper = mount(<ScrollItem list={list} />);
        const animation = { destroy: jest.fn() };
        wrapper.instance().scrollAnimation = animation;
        wrapper.unmount();
        expect(animation.destroy).toHaveBeenCalledTimes(1);
    });

    it('unmounts safely without a scroll animation', () => {
        const wrapper = mount(<ScrollItem list={list} motion={false} />);
        expect(() => wrapper.unmount()).not.toThrow();
    });
});
