import React from 'react';
import InputNumber from '../index';

describe('InputNumber current numeric value', () => {
    it.each([0, 1, -1])('exposes aria-valuenow for %s', value => {
        const wrapper = mount(<InputNumber defaultValue={value} />);
        expect(wrapper.find('input').getDOMNode().getAttribute('aria-valuenow')).toBe(String(value));
        wrapper.unmount();
    });

    it('keeps zero when a controlled value changes through zero', () => {
        const wrapper = mount(<InputNumber value={1} />);
        wrapper.setProps({ value: 0 });
        wrapper.update();
        expect(wrapper.find('input').getDOMNode().getAttribute('aria-valuenow')).toBe('0');
        wrapper.setProps({ value: -1 });
        wrapper.update();
        expect(wrapper.find('input').getDOMNode().getAttribute('aria-valuenow')).toBe('-1');
        wrapper.unmount();
    });

    it('omits aria-valuenow for an empty value', () => {
        const wrapper = mount(<InputNumber />);
        expect(wrapper.find('input').getDOMNode().getAttribute('aria-valuenow')).toBeNull();
        wrapper.unmount();
    });
});

