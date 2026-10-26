import React from 'react';
import { mount } from 'enzyme';
import Input from '../index';
import TextArea from '../textarea';

for (const [name, Component, selector] of [['Input', Input, 'input'], ['TextArea', TextArea, 'textarea']]) {
    describe(`${name} zero maxLength with a custom counter`, () => {
        for (const composition of [undefined, false, true]) {
            it(`keeps the value empty after input with composition=${composition}`, () => {
                const changes = [];
                const wrapper = mount(<Component maxLength={0} getValueLength={value => value.length} composition={composition} onChange={value => changes.push(value)} />);
                const field = wrapper.find(selector);
                if (composition !== undefined) {
                    field.simulate('compositionStart');
                }
                field.simulate('change', { target: { value: 'a' } });
                if (composition !== undefined) {
                    field.simulate('compositionEnd', { target: { value: 'a' } });
                }
                expect(wrapper.find(selector).getDOMNode().value).toBe('');
                expect(changes[changes.length - 1]).toBe('');
                wrapper.unmount();
            });
        }

        it('keeps an omitted maxLength unlimited', () => {
            const wrapper = mount(<Component getValueLength={value => value.length} />);
            wrapper.find(selector).simulate('change', { target: { value: 'abc' } });
            expect(wrapper.find(selector).getDOMNode().value).toBe('abc');
            wrapper.unmount();
        });
    });
}
