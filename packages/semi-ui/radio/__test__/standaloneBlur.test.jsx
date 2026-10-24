import React from 'react';
import { act } from 'react-dom/test-utils';
import Radio from '../index';
import { Form } from '../../form';

describe('Radio blur', () => {
    it.each(['default', 'button', 'card', 'pureCard'])('forwards the event and clears focus-visible state (%s)', type => {
        const onBlur = sinon.spy();
        const wrapper = mount(<Radio type={type} onBlur={onBlur}>Confirm</Radio>);
        try {
            const input = wrapper.find('input');
            input.simulate('focus', { target: { matches: () => true } });
            expect(wrapper.find('.semi-radio-focus').exists()).toBe(true);
            input.simulate('blur');
            expect(onBlur.callCount).toBe(1);
            expect(onBlur.firstCall.args[0].target).toBe(input.getDOMNode());
            expect(wrapper.find('.semi-radio-focus').exists()).toBe(false);
        } finally { wrapper.unmount(); }
    });

    it('runs blur validation for a standalone Form.Radio', async () => {
        const validator = sinon.spy(() => 'Please confirm');
        let api;
        const wrapper = mount(<Form trigger="blur" getFormApi={value => { api = value; }}>
            <Form.Radio field="confirmed" validator={validator}>Confirm</Form.Radio>
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
