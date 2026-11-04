import React from 'react';
import { mount } from 'enzyme';
import Steps from '../index';

describe('Steps current accessibility state', () => {
    ['basic', 'fill', 'nav'].forEach(type => {
        it(`marks only the current step and follows updates in ${type} mode`, () => {
            const wrapper = mount(<Steps type={type} current={1} status="error">
                <Steps.Step title="First" status="process" />
                <Steps.Step title="Second" />
                <Steps.Step title="Third" />
            </Steps>);
            expect(wrapper.find('div[aria-current="step"]')).toHaveLength(1);
            expect(wrapper.find('div[aria-current="step"]').text()).toContain('Second');
            wrapper.setProps({ current: 2 });
            expect(wrapper.find('div[aria-current="step"]')).toHaveLength(1);
            expect(wrapper.find('div[aria-current="step"]').text()).toContain('Third');
            wrapper.unmount();
        });
    });
    ['basic', 'fill'].forEach(type => {
        it(`respects initial and has no current item outside the range in ${type} mode`, () => {
            const wrapper = mount(<Steps type={type} initial={3} current={4}>
                <Steps.Step title="First" /><Steps.Step title="Second" />
            </Steps>);
            expect(wrapper.find('div[aria-current="step"]')).toHaveLength(1);
            expect(wrapper.find('div[aria-current="step"]').text()).toContain('Second');
            wrapper.setProps({ current: 5 });
            expect(wrapper.find('div[aria-current="step"]')).toHaveLength(0);
            wrapper.unmount();
        });
    });
});
