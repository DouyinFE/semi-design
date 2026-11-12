import React from 'react';
import { mount } from 'enzyme';
import { PinCode } from '../../index';

describe('PinCode deleting from an empty input', () => {
    let container;
    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });
    afterEach(() => {
        container.remove();
    });
    const press = (input, key) => {
        input.focus();
        input.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
    };

    ['Backspace', 'Delete'].forEach(key => {
        [
            ['uncontrolled', { defaultValue: '12' }],
            ['controlled', { value: '12' }],
        ].forEach(([mode, props]) => {
            it(`${key} keeps the value silent and still moves focus when ${mode}`, () => {
                const onChange = sinon.spy();
                const wrapper = mount(<PinCode {...props} count={4} onChange={onChange} />, { attachTo: container });
                try {
                    const inputs = container.querySelectorAll('input');
                    press(inputs[2], key);
                    expect(onChange.callCount).toBe(0);
                    expect(document.activeElement).toBe(inputs[key === 'Backspace' ? 1 : 3]);
                } finally {
                    wrapper.unmount();
                }
            });
        });

        it(`${key} does not notify when every input is empty`, () => {
            const onChange = sinon.spy();
            const wrapper = mount(<PinCode count={4} onChange={onChange} />, { attachTo: container });
            try {
                press(container.querySelector('input'), key);
                expect(onChange.callCount).toBe(0);
            } finally {
                wrapper.unmount();
            }
        });
    });
});
