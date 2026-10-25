import React, { useState } from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';
import InputNumber from '../index';

describe('InputNumber scientific notation preserves the numeric value', () => {
    it.each([
        [true, 123456789, '1.2346e+8'],
        [false, 123456789, '1.2346e+8'],
        [true, -123456789, '-1.2346e+8'],
        [false, -123456789, '-1.2346e+8'],
        [true, 0.00000123456789, '1.2346e-6'],
        [false, 0.00000123456789, '1.2346e-6'],
    ])('keeps the full number with controlled=%s and value=%s', (controlled, value, display) => {
        const onChange = sinon.spy();
        const onNumberChange = sinon.spy();
        const props = controlled ? { value } : { defaultValue: value };
        const wrapper = mount(<InputNumber {...props} scientificNotation={{ threshold: 5 }} onChange={onChange} onNumberChange={onNumberChange} />);
        try {
            expect(wrapper.find('input').getDOMNode().value).toBe(display);
            wrapper.find('input').simulate('focus');
            expect(wrapper.find('input').getDOMNode().value).toBe(String(value));
            wrapper.find('input').simulate('blur');
            expect(wrapper.find('input').getDOMNode().value).toBe(display);
            for (const spy of [onChange, onNumberChange]) {
                expect(spy.getCalls().every(call => call.args[0] === value)).toBe(true);
            }
        } finally {
            wrapper.unmount();
        }
    });

    it('does not replace a parent value with the abbreviated display', () => {
        function Demo() {
            const [value, setValue] = useState(123456789);
            return <div><InputNumber value={value} scientificNotation={{ threshold: 5 }} onChange={setValue} /><output>{value}</output></div>;
        }
        const wrapper = mount(<Demo />);
        try {
            expect(wrapper.find('output').text()).toBe('123456789');
            wrapper.find('input').simulate('focus');
            wrapper.find('input').simulate('blur');
            expect(wrapper.find('output').text()).toBe('123456789');
        } finally {
            wrapper.unmount();
        }
    });

    it('preserves full values received from the parent after mounting', () => {
        const onChange = sinon.spy();
        const wrapper = mount(<InputNumber value={123456789} scientificNotation={{ threshold: 5 }} onChange={onChange} />);
        try {
            onChange.resetHistory();
            wrapper.setProps({ value: 987654321 });
            expect(wrapper.find('input').getDOMNode().value).toBe('9.8765e+8');
            expect(onChange.getCalls().every(call => call.args[0] === 987654321)).toBe(true);
            wrapper.find('input').simulate('focus');
            expect(wrapper.find('input').getDOMNode().value).toBe('987654321');
        } finally {
            wrapper.unmount();
        }
    });

    it('keeps the exact number entered using exponent notation', () => {
        const onChange = sinon.spy();
        const wrapper = mount(<InputNumber defaultValue={1} scientificNotation={{ threshold: 5 }} onChange={onChange} />);
        try {
            wrapper.find('input').simulate('focus');
            wrapper.find('input').simulate('change', { target: { value: '1.23456789e+8' } });
            wrapper.find('input').simulate('blur');
            expect(onChange.lastCall.args[0]).toBe(123456789);
            wrapper.find('input').simulate('focus');
            expect(wrapper.find('input').getDOMNode().value).toBe('123456789');
        } finally {
            wrapper.unmount();
        }
    });

    it('keeps parser and formatter behavior when expanding the number', () => {
        const onChange = sinon.spy();
        const wrapper = mount(<InputNumber defaultValue={123456789} scientificNotation={{ threshold: 5 }} formatter={value => `$${value}`} parser={value => value.replace('$', '')} onChange={onChange} />);
        try {
            expect(wrapper.find('input').getDOMNode().value).toBe('$1.2346e+8');
            wrapper.find('input').simulate('focus');
            expect(wrapper.find('input').getDOMNode().value).toBe('$123456789');
            wrapper.find('input').simulate('blur');
            expect(onChange.getCalls().every(call => call.args[0] === 123456789)).toBe(true);
        } finally {
            wrapper.unmount();
        }
    });

    it('still applies precision and range limits before notifying changes', () => {
        const onChange = sinon.spy();
        const wrapper = mount(<InputNumber defaultValue={12345.6789} precision={2} max={12000.12} scientificNotation={{ threshold: 3 }} onChange={onChange} />);
        try {
            expect(onChange.lastCall.args[0]).toBe(12000.12);
            wrapper.find('input').simulate('focus');
            expect(wrapper.find('input').getDOMNode().value).toBe('12000.12');
            wrapper.find('input').simulate('blur');
            expect(onChange.lastCall.args[0]).toBe(12000.12);
        } finally {
            wrapper.unmount();
        }
    });
});
