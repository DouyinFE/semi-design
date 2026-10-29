import React from 'react';
import { mount } from 'enzyme';
import Banner from '../index';

describe('Banner numeric content', () => {
    it.each([
        ['title', '.semi-banner-title'],
        ['description', '.semi-banner-description'],
        ['children', '.semi-banner-extra'],
    ])('renders numeric zero in %s', (prop, selector) => {
        const wrapper = mount(<Banner {...{ [prop]: 0 }} />);
        try {
            expect(wrapper.find(selector).hostNodes()).toHaveLength(1);
            expect(wrapper.find(selector).hostNodes().text()).toBe('0');
        } finally {
            wrapper.unmount();
        }
    });

    it('preserves other numeric and string content', () => {
        const wrapper = mount(<Banner title={1} description="0">2</Banner>);
        try {
            expect(wrapper.find('.semi-banner-title').hostNodes().text()).toBe('1');
            expect(wrapper.find('.semi-banner-description').hostNodes().text()).toBe('0');
            expect(wrapper.find('.semi-banner-extra').text()).toBe('2');
        } finally {
            wrapper.unmount();
        }
    });

    it('keeps empty React content hidden', () => {
        const wrapper = mount(<Banner title={false} description="">{null}</Banner>);
        try {
            expect(wrapper.find('.semi-banner-title')).toHaveLength(0);
            expect(wrapper.find('.semi-banner-description')).toHaveLength(0);
            expect(wrapper.find('.semi-banner-extra')).toHaveLength(0);
        } finally {
            wrapper.unmount();
        }
    });
});
