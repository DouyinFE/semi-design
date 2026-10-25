import React from 'react';
import { mount } from 'enzyme';
import { spy } from 'sinon';
import InputNumber from '../index';
import { plus } from '@douyinfe/semi-foundation/utils/number';

describe('InputNumber exponent steps within its bounds', () => {
    it.each([
        [1e-7, 1, 1.0000001],
        [1e-7, 2e-7, 3e-7],
        [1.2e-7, 2.4e-7, 3.6e-7],
        [-1e-7, -2e-7, -3e-7],
        [1e-300, 2e-300, 3e-300],
        [1e307, 1e-7, 1e307],
        [1e-323, 2e-323, 3e-323],
        [Infinity, 1, Infinity],
        [0.1, 0.2, 0.3],
        [0.3, -0.1, 0.2],
    ])('adds %s and %s without losing decimal precision', (left, right, expected) => {
        expect(plus(left, right)).toBe(expected);
    });

    it.each([
        [1e-7, 0, 3e-7, 1e-7, 38, 2e-7],
        [1e-7, 0, 3e-7, 1e-7, 40, 0],
        [-1e-7, -3e-7, 0, 1e-7, 38, 0],
        [-1e-7, -3e-7, 0, 1e-7, 40, -2e-7],
        [1.2e-7, 0, 3.6e-7, 1.2e-7, 38, 2.4e-7],
        [0.1, 0, 0.3, 0.1, 38, 0.2],
        [0.1, 0, 0.3, 0.1, 40, 0],
    ])('steps from %s in [%s, %s] by %s with key %s to %s', (value, min, max, step, keyCode, expected) => {
        const onChange = spy();
        const wrapper = mount(<InputNumber defaultValue={value} min={min} max={max} step={step} precision={8} onChange={onChange} />);
        try {
            onChange.resetHistory();
            wrapper.find('input').simulate('keydown', { keyCode });
            expect(Number(wrapper.find('input').getDOMNode().value)).toBe(expected);
            expect(Number(onChange.lastCall.args[0])).toBe(expected);
        } finally {
            wrapper.unmount();
        }
    });

    it('uses exponent shiftStep for Shift + ArrowUp', () => {
        const wrapper = mount(<InputNumber defaultValue={1e-7} min={0} max={5e-7} step={1e-7} shiftStep={2e-7} precision={8} />);
        try {
            wrapper.find('input').simulate('keydown', { keyCode: 38, shiftKey: true });
            expect(Number(wrapper.find('input').getDOMNode().value)).toBe(3e-7);
        } finally {
            wrapper.unmount();
        }
    });

    it('steps with the visible up button', () => {
        const wrapper = mount(<InputNumber defaultValue={1e-7} min={0} max={3e-7} step={1e-7} precision={8} />);
        try {
            const button = wrapper.find('.semi-input-number-button-up');
            button.simulate('mousedown', { button: 0 });
            button.simulate('mouseup', { button: 0 });
            expect(Number(wrapper.find('input').getDOMNode().value)).toBe(2e-7);
        } finally {
            wrapper.unmount();
        }
    });
});
