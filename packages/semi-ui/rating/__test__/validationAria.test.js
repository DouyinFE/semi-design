import React from 'react';
import { mount } from 'enzyme';
import Rating from '../index';
import { Form } from '../../form';

describe('Rating validation accessibility', () => {
    it('renders and updates validation attributes on the radio group', () => {
        const wrapper = mount(<Rating aria-required aria-invalid aria-errormessage="rating-error" />);
        try {
            const root = wrapper.find('ul.semi-rating').getDOMNode();
            expect(root.getAttribute('role')).toBe('radiogroup');
            expect(root.getAttribute('aria-required')).toBe('true');
            expect(root.getAttribute('aria-invalid')).toBe('true');
            expect(root.getAttribute('aria-errormessage')).toBe('rating-error');
            wrapper.setProps({ 'aria-required': false, 'aria-invalid': false, 'aria-errormessage': undefined });
            expect(root.getAttribute('aria-required')).toBe('false');
            expect(root.getAttribute('aria-invalid')).toBe('false');
            expect(root.hasAttribute('aria-errormessage')).toBe(false);
        } finally { wrapper.unmount(); }
    });

    it.each([false, true])('groups radios and preserves keyboard scoring with tooltips/allowHalf=%s', enabled => {
        const container = document.createElement('div');
        document.body.appendChild(container);
        const onChange = rs.fn();
        const wrapper = mount(<Rating defaultValue={1} allowHalf={enabled} onChange={onChange}
            tooltips={enabled ? ['one', 'two', 'three', 'four', 'five'] : undefined} />, { attachTo: container });
        try {
            const root = wrapper.find('ul.semi-rating').getDOMNode();
            expect(root.getAttribute('role')).toBe('radiogroup');
            expect([...root.querySelectorAll('li')].every(item => item.getAttribute('role') === 'none')).toBe(true);
            expect(root.querySelectorAll('[role="radio"]')).toHaveLength(enabled ? 11 : 6);
            expect(root.querySelectorAll('[aria-checked="true"]')).toHaveLength(1);
            wrapper.find('ul.semi-rating').simulate('keydown', { key: 'ArrowRight' });
            expect(onChange.mock.calls[0][0]).toBe(enabled ? 1.5 : 2);
            const checked = root.querySelector('[role="radio"][aria-checked="true"]');
            expect(checked).toBe(document.activeElement);
            expect(root.querySelectorAll('[aria-checked="true"]')).toHaveLength(1);
        } finally { wrapper.unmount(); container.remove(); }
    });

    it('exposes the required state provided by Form.Rating', () => {
        const wrapper = mount(<Form><Form.Rating field="score" rules={[{ required: true }]} /></Form>);
        try {
            expect(wrapper.find('ul.semi-rating').getDOMNode().getAttribute('aria-required')).toBe('true');
        } finally { wrapper.unmount(); }
    });
});
