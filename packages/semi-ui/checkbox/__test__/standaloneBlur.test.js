import React from 'react';
import { act } from 'react-dom/test-utils';
import Checkbox from '../index';
import { Form } from '../../form';

describe('Checkbox blur', () => {
    it.each(['default', 'card', 'pureCard'])('forwards the event and clears focus-visible state (%s)', type => {
        const onBlur = sinon.spy();
        const wrapper = mount(<Checkbox type={type} onBlur={onBlur}>Confirm</Checkbox>);
        try {
            const input = wrapper.find('input');
            input.simulate('focus', { target: { matches: () => true } });
            expect(wrapper.find('.semi-checkbox-focus').exists()).toBe(true);
            input.simulate('blur');
            expect(onBlur.callCount).toBe(1);
            expect(onBlur.firstCall.args[0].target).toBe(input.getDOMNode());
            expect(wrapper.find('.semi-checkbox-focus').exists()).toBe(false);
        } finally { wrapper.unmount(); }
    });

    it('runs blur validation for a standalone Form.Checkbox', async () => {
        const validator = sinon.spy(() => 'Please confirm');
        let api;
        const wrapper = mount(<Form trigger="blur" getFormApi={value => { api = value; }}>
            <Form.Checkbox field="confirmed" validator={validator}>Confirm</Form.Checkbox>
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
