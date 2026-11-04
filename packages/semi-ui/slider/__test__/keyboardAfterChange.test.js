import React from 'react';
import { mount } from 'enzyme';
import Slider from '../index';

describe('Slider keyboard completion', () => {
    [null, 0, 1].forEach(rangeHandle => {
        const range = rangeHandle !== null;
        const handleIndex = rangeHandle ?? 0;

        it(`ignores unrelated key releases, range=${range}, handle=${handleIndex}`, () => {
            const onChange = sinon.spy();
            const onAfterChange = sinon.spy();
            const onMouseUp = sinon.spy();
            const value = range ? [20, 60] : 40;
            const wrapper = mount(<Slider range={range} defaultValue={value} onChange={onChange}
                onAfterChange={onAfterChange} onMouseUp={onMouseUp} />);
            try {
                ['Tab', 'Shift', 'a', 'Escape', 'Enter'].forEach(key => {
                    const handle = wrapper.find('[role="slider"]').at(handleIndex);
                    handle.simulate('keydown', { key });
                    handle.simulate('keyup', { key });
                });
                expect(wrapper.find('[role="slider"]').map(node => node.prop('aria-valuenow')))
                    .toEqual(range ? value : [value]);
                expect(onChange.callCount).toBe(0);
                expect(onAfterChange.callCount).toBe(0);
                expect(onMouseUp.callCount).toBe(0);
            } finally {
                wrapper.unmount();
            }
        });

        it(`completes supported keyboard adjustments, range=${range}, handle=${handleIndex}`, () => {
            const onAfterChange = sinon.spy();
            const wrapper = mount(<Slider range={range} defaultValue={range ? [20, 60] : 40} onAfterChange={onAfterChange} />);
            try {
                ['ArrowLeft', 'ArrowDown', 'ArrowRight', 'ArrowUp', 'PageUp', 'PageDown', 'Home', 'End'].forEach((key, index) => {
                    const handle = wrapper.find('[role="slider"]').at(handleIndex);
                    handle.simulate('keydown', { key });
                    handle.simulate('keyup', { key });
                    const values = wrapper.find('[role="slider"]').map(node => node.prop('aria-valuenow'));
                    expect(onAfterChange.callCount).toBe(index + 1);
                    expect(onAfterChange.lastCall.args[0]).toEqual(range ? values : values[0]);
                });
            } finally {
                wrapper.unmount();
            }
        });
    });
});
