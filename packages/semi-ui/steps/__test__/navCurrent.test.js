import React, { useState } from 'react';
import Steps from '../index';

it.each(['click', 'keyDown'])('keeps nav highlighting and controlled current aligned on %s', event => {
    const onChange = rs.fn();
    function Demo() {
        const [current, setCurrent] = useState(1);
        return <Steps type="nav" initial={1} current={current} onChange={value => {
            onChange(value);
            setCurrent(value);
        }}>
            <Steps.Step title="First" />
            <Steps.Step title="Second" />
            <Steps.Step title="Third" />
        </Steps>;
    }
    const wrapper = mount(<Demo />);
    const activate = index => wrapper.find('.semi-steps-item').at(index).simulate(event, { key: 'Enter' });
    try {
        expect(wrapper.find('.semi-steps-item-active').text()).toBe('First');
        activate(0);
        expect(onChange).not.toHaveBeenCalled();
        activate(1);
        expect(onChange).toHaveBeenLastCalledWith(2);
        expect(wrapper.find('.semi-steps-item-active').text()).toBe('Second');
        activate(1);
        expect(onChange).toHaveBeenCalledTimes(1);
        activate(0);
        expect(onChange).toHaveBeenLastCalledWith(1);
        expect(wrapper.find('.semi-steps-item-active').text()).toBe('First');
    } finally {
        wrapper.unmount();
    }
});
