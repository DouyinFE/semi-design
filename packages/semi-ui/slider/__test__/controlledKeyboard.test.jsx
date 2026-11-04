import React from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';
import Slider from '../index';

const keys = [
    ['ArrowLeft', 29, [19, 60]],
    ['ArrowDown', 29, [19, 60]],
    ['ArrowRight', 31, [21, 60]],
    ['ArrowUp', 31, [21, 60]],
    ['PageUp', 40, [30, 60]],
    ['PageDown', 20, [10, 60]],
    ['Home', 0, [0, 60]],
    ['End', 100, [60, 60]],
];

describe('Slider controlled keyboard values', () => {
    it.each(keys)('keeps a controlled single value after %s', (key, expected) => {
        const onChange = sinon.spy();
        const wrapper = mount(<Slider value={30} tipFormatter={null} onChange={onChange} />);
        try {
            const handle = wrapper.find('[role="slider"]');
            handle.simulate('keyDown', { key });
            expect(onChange.calledOnceWithExactly(expected)).toBe(true);
            expect(wrapper.find('[role="slider"]').prop('aria-valuenow')).toBe(30);
            handle.simulate('keyDown', { key });
            expect(onChange.secondCall.args[0]).toBe(expected);
            wrapper.setProps({ value: expected });
            wrapper.update();
            expect(wrapper.find('[role="slider"]').prop('aria-valuenow')).toBe(expected);
        } finally {
            wrapper.unmount();
        }
    });

    it.each(keys)('keeps both controlled range handles after %s', (key, single, expected) => {
        const onChange = sinon.spy();
        const value = [20, 60];
        const wrapper = mount(<Slider range value={value} tipFormatter={null} onChange={onChange} />);
        try {
            wrapper.find('[role="slider"]').at(0).simulate('keyDown', { key });
            expect(onChange.firstCall.args[0]).toEqual(expected);
            expect(wrapper.find('[role="slider"]').map(handle => handle.prop('aria-valuenow'))).toEqual(value);
            expect(value).toEqual([20, 60]);
            wrapper.setProps({ value: expected });
            wrapper.update();
            expect(wrapper.find('[role="slider"]').map(handle => handle.prop('aria-valuenow'))).toEqual(expected);
        } finally {
            wrapper.unmount();
        }
    });

    it.each([
        ['ArrowRight', [20, 61]],
        ['ArrowLeft', [20, 59]],
        ['Home', [20, 20]],
        ['End', [20, 100]],
    ])('keeps the controlled upper handle after %s', (key, expected) => {
        const onChange = sinon.spy();
        const wrapper = mount(<Slider range value={[20, 60]} tipFormatter={null} onChange={onChange} />);
        try {
            wrapper.find('[role="slider"]').at(1).simulate('keyDown', { key });
            expect(onChange.firstCall.args[0]).toEqual(expected);
            expect(wrapper.find('[role="slider"]').map(handle => handle.prop('aria-valuenow'))).toEqual([20, 60]);
        } finally {
            wrapper.unmount();
        }
    });

    it.each([false, true])('still updates uncontrolled sliders with range=%s', range => {
        const onChange = sinon.spy();
        const wrapper = mount(<Slider range={range} defaultValue={range ? [20, 60] : 30} tipFormatter={null} onChange={onChange} />);
        try {
            wrapper.find('[role="slider"]').at(0).simulate('keyDown', { key: 'ArrowRight' });
            const expected = range ? [21, 60] : [31];
            expect(wrapper.find('[role="slider"]').map(handle => handle.prop('aria-valuenow'))).toEqual(expected);
            expect(onChange.calledOnce).toBe(true);
        } finally {
            wrapper.unmount();
        }
    });

    it('does not notify when disabled', () => {
        const onChange = sinon.spy();
        const wrapper = mount(<Slider disabled value={30} tipFormatter={null} onChange={onChange} />);
        try {
            wrapper.find('[role="slider"]').simulate('keyDown', { key: 'ArrowRight' });
            expect(onChange.called).toBe(false);
            expect(wrapper.find('[role="slider"]').prop('aria-valuenow')).toBe(30);
        } finally {
            wrapper.unmount();
        }
    });
});
