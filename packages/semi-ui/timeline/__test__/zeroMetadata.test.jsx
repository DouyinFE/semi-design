import React from 'react';
import { mount } from 'enzyme';
import Timeline from '../index';

describe('Timeline zero metadata', () => {
    let wrapper;
    afterEach(() => wrapper?.unmount());

    ['extra', 'time'].forEach(prop => {
        it(`keeps numeric zero in the ${prop} container`, () => {
            wrapper = mount(<Timeline><Timeline.Item {...{ [prop]: 0 }}>Item</Timeline.Item></Timeline>);
            expect(wrapper.exists(`div.semi-timeline-item-content-${prop}`)).toBe(true);
            expect(wrapper.find(`div.semi-timeline-item-content-${prop}`).text()).toBe('0');
        });

        it(`keeps string zero in the ${prop} container`, () => {
            wrapper = mount(<Timeline><Timeline.Item {...{ [prop]: '0' }}>Item</Timeline.Item></Timeline>);
            expect(wrapper.find(`div.semi-timeline-item-content-${prop}`).text()).toBe('0');
        });
    });

    it('does not add containers for absent or false metadata', () => {
        wrapper = mount(<Timeline><Timeline.Item extra={false} time={undefined}>Item</Timeline.Item></Timeline>);
        expect(wrapper.exists('.semi-timeline-item-content-extra')).toBe(false);
        expect(wrapper.exists('.semi-timeline-item-content-time')).toBe(false);
    });
});
