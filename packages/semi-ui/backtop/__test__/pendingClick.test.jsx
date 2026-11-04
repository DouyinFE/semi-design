import React from 'react';
import { mount } from 'enzyme';
import { useFakeTimers } from 'sinon';
import BackTop from '../index';

describe('BackTop pending clicks', () => {
    let wrapper;
    let clock;
    beforeEach(() => {
        clock = useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date'] });
        rstest.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => callback());
    });
    afterEach(() => { wrapper?.unmount(); clock.restore(); window.requestAnimationFrame.mockRestore(); });

    it('does not deliver a throttled click after unmount', () => {
        const onClick = rstest.fn();
        wrapper = mount(<BackTop visibilityHeight={-1} duration={100} onClick={onClick} />);
        wrapper.find('div.semi-backtop').simulate('click');
        wrapper.find('div.semi-backtop').simulate('click');
        expect(onClick).toHaveBeenCalledTimes(1);
        wrapper.unmount();
        wrapper = null;
        clock.tick(100);
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('keeps the trailing click while mounted', () => {
        const onClick = rstest.fn();
        wrapper = mount(<BackTop visibilityHeight={-1} duration={100} onClick={onClick} />);
        wrapper.find('div.semi-backtop').simulate('click');
        wrapper.find('div.semi-backtop').simulate('click');
        expect(onClick).toHaveBeenCalledTimes(1);
        clock.tick(100);
        expect(onClick).toHaveBeenCalledTimes(2);
    });
});
