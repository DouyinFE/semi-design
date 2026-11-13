import React from 'react';
import InputNumber from '../index';
import { mount } from 'enzyme';

// Regression test for #3369: an explicitly provided 0 must not be treated as
// "not configured" by the fraction-digit fallbacks in currency mode.
const renderValue = props => {
    const wrapper = mount(
        <InputNumber localeCode="en-US" currency="USD" defaultValue={12} {...props} />
    );
    try {
        return wrapper.find('input').instance().value;
    } finally {
        wrapper.unmount();
    }
};

describe('InputNumber currency fraction digits', () => {
    it('honours precision={0}', () => {
        expect(renderValue({ precision: 0 })).toBe('$12');
    });

    it('honours precision={0} together with explicit zero bounds', () => {
        expect(renderValue({ precision: 0, minimumFractionDigits: 0, maximumFractionDigits: 0 })).toBe('$12');
    });

    it('honours minimumFractionDigits={0}', () => {
        expect(renderValue({ minimumFractionDigits: 0 })).toBe('$12');
    });

    it('honours maximumFractionDigits={0}', () => {
        expect(renderValue({ maximumFractionDigits: 0 })).toBe('$12');
    });

    it('keeps the currency default when precision is absent', () => {
        expect(renderValue({})).toBe('$12.00');
    });

    it('keeps precision={2}', () => {
        expect(renderValue({ precision: 2 })).toBe('$12.00');
    });

    it('keeps precision={1}', () => {
        expect(renderValue({ precision: 1 })).toBe('$12.0');
    });

    // The issue asks for clarification before changing mixed-option behaviour,
    // so these two combinations must keep their previous output.
    it('does not change mixed precision={0} + minimumFractionDigits=1', () => {
        expect(renderValue({ precision: 0, minimumFractionDigits: 1 })).toBe('$12.0');
    });

    it('does not change mixed precision={2} + maximumFractionDigits=0', () => {
        expect(renderValue({ precision: 2, maximumFractionDigits: 0 })).toBe('$12.00');
    });
});
