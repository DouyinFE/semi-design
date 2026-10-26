import React from 'react';
import { mount } from 'enzyme';
import Steps from '../index';

describe('Steps error predecessor class', () => {
    it.each(['fill', 'basic'])('%s preserves the supplied class', type => {
        const wrapper = mount(<Steps type={type} current={1} status="error"><Steps.Step className="my-step" title="first" /><Steps.Step title="second" /></Steps>);
        try { expect(wrapper.find('div.semi-steps-next-error').hasClass('my-step')).toBe(true); }
        finally { wrapper.unmount(); }
    });
    it.each(['fill', 'basic'])('%s supports an omitted custom class', type => {
        const wrapper = mount(<Steps type={type} current={1} status="error"><Steps.Step title="first" /><Steps.Step title="second" /></Steps>);
        try { expect(wrapper.find('div.semi-steps-next-error').text()).toContain('first'); }
        finally { wrapper.unmount(); }
    });
});
