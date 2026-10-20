import React from 'react';
import { act } from 'react-dom/test-utils';
import Switch from '../index';
import { Form } from '../../form';

describe('Switch blur', () => {
    it('forwards the blur event and clears focus-visible state', () => {
        const onBlur = sinon.spy();
        const wrapper = mount(<Switch onBlur={onBlur} />);
        try {
            const input = wrapper.find('input');
            input.simulate('focus', { target: { matches: () => true } });
            expect(wrapper.find('.semi-switch-focus').exists()).toBe(true);
            const event = { target: input.getDOMNode() };
            input.simulate('blur', event);
            expect(onBlur.calledOnce).toBe(true);
            expect(onBlur.firstCall.args[0].target).toBe(event.target);
            expect(wrapper.find('.semi-switch-focus').exists()).toBe(false);
        } finally { wrapper.unmount(); }
    });

    it('runs Form blur validation and marks the field touched', async () => {
        const validator = sinon.spy(() => 'Please confirm');
        let api;
        const wrapper = mount(<Form trigger="blur" getFormApi={value => { api = value; }}>
            <Form.Switch field="confirmed" validator={validator} />
        </Form>);
        try {
            await act(async () => { wrapper.find('input').simulate('blur'); });
            wrapper.update();
            expect(validator.callCount).toBe(1);
            expect(wrapper.text()).toContain('Please confirm');
            expect(api.getTouched('confirmed')).toBe(true);
        } finally { wrapper.unmount(); }
    });
});
