import React from 'react';
import { mount } from 'enzyme';
import Radio from '../index';
import { Form } from '../../form';
import { act } from 'react-dom/test-utils';

describe('Radio validation accessibility', () => {
    it('forwards Form.Radio validation and description attributes to its native input', async () => {
        let api;
        const wrapper = mount(<Form getFormApi={value => { api = value; }}><Form.Radio field="agree" extraText="Additional instructions" rules={[{ required: true, validator: () => false, message: 'Please confirm' }]}>Confirm</Form.Radio></Form>);
        try {
            await act(async () => { await api.validate().catch(() => {}); });
            wrapper.update();
            const input = wrapper.find('input');
            expect(input.prop('aria-invalid')).toBe(true);
            expect(input.prop('aria-required')).toBe(true);
            expect(input.prop('aria-errormessage')).toBeTruthy();
            expect(wrapper.find('#' + input.prop('aria-errormessage')).exists()).toBe(true);
            expect(input.prop('aria-describedby')).toBeTruthy();
            expect(wrapper.find('#' + input.prop('aria-describedby')).text()).toBe('Additional instructions');
        } finally { wrapper.unmount(); }
    });
    it('keeps its generated extra description when present', () => {
        const wrapper = mount(<Radio extra="Extra" aria-describedby="external">Label</Radio>);
        try { expect(wrapper.find('input').prop('aria-describedby')).toBe(wrapper.find('.semi-radio-extra').prop('id')); }
        finally { wrapper.unmount(); }
    });
    it('forwards a description without extra content', () => {
        const wrapper = mount(<Radio aria-describedby="external">Label</Radio>);
        try { expect(wrapper.find('input').prop('aria-describedby')).toBe('external'); }
        finally { wrapper.unmount(); }
    });
});
