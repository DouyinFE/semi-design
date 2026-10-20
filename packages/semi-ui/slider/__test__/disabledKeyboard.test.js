import React from 'react';
import { mount } from 'enzyme';
import Slider from '../index';

describe('Slider disabled keyboard interaction', () => {
    const keys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown'];

    [false, true].forEach(controlled => {
        [false, true].forEach(range => {
            (range ? [0, 1] : [0]).forEach(handleIndex => {
                it(`ignores keys when disabled, controlled=${controlled}, range=${range}, handle=${handleIndex}`, () => {
                    const value = range ? [20, 60] : 40;
                    const onChange = sinon.spy();
                    const onAfterChange = sinon.spy();
                    const props = controlled ? { value } : { defaultValue: value };
                    const wrapper = mount(<Slider {...props} range={range} disabled onChange={onChange} onAfterChange={onAfterChange} />);
                    try {
                        keys.forEach(key => {
                            const handle = wrapper.find('[role="slider"]').at(handleIndex);
                            handle.simulate('keydown', { key });
                            handle.simulate('keyup', { key });
                            expect(wrapper.find('[role="slider"]').map(node => node.prop('aria-valuenow')))
                                .toEqual(range ? value : [value]);
                            expect(onChange.callCount).toBe(0);
                            expect(onAfterChange.callCount).toBe(0);
                        });
                    } finally {
                        wrapper.unmount();
                    }
                });
            });
        });
    });

    [false, true].forEach(range => {
        it(`resumes keyboard changes after re-enabling, range=${range}`, () => {
            const onChange = sinon.spy();
            const onAfterChange = sinon.spy();
            const wrapper = mount(<Slider range={range} defaultValue={range ? [20, 60] : 40} onChange={onChange} onAfterChange={onAfterChange} />);
            const press = () => {
                const handle = wrapper.find('[role="slider"]').at(0);
                handle.simulate('keydown', { key: 'ArrowRight' });
                handle.simulate('keyup', { key: 'ArrowRight' });
            };
            try {
                press();
                expect(onChange.lastCall.args[0]).toEqual(range ? [21, 60] : 41);
                wrapper.setProps({ disabled: true });
                press();
                expect(onChange.callCount).toBe(1);
                expect(onAfterChange.callCount).toBe(1);
                wrapper.setProps({ disabled: false });
                press();
                expect(onChange.callCount).toBe(2);
                expect(onChange.lastCall.args[0]).toEqual(range ? [22, 60] : 42);
                expect(onAfterChange.callCount).toBe(2);
            } finally {
                wrapper.unmount();
            }
        });
    });
});
