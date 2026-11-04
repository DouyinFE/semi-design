import React from 'react';
import { renderToString } from 'react-dom/server';
import { mount } from 'enzyme';
import Radio from '../index';

describe('RadioGroup native group names', () => {
    it('keeps independently selected groups separate in a form', () => {
        const container = document.createElement('div');
        document.body.appendChild(container);
        const wrapper = mount(<form>
            <Radio.Group value="a"><Radio value="a">A</Radio><Radio value="b">B</Radio></Radio.Group>
            <Radio.Group value="c"><Radio value="c">C</Radio><Radio value="d">D</Radio></Radio.Group>
        </form>, { attachTo: container });
        try {
            const inputs = [...container.querySelectorAll('input')];
            expect(inputs[0].name).not.toBe('');
            expect(inputs[0].name).toBe(inputs[1].name);
            expect(inputs[2].name).toBe(inputs[3].name);
            expect(inputs[0].name).not.toBe(inputs[2].name);
            expect(inputs.map(input => input.checked)).toEqual([true, false, true, false]);
            expect([...new FormData(container.querySelector('form')).keys()]).toHaveLength(2);
        } finally { wrapper.unmount(); container.remove(); }
    });

    it('preserves an explicit native form field name', () => {
        const wrapper = mount(<form><Radio.Group name="choice" value="a"><Radio value="a">A</Radio><Radio value="b">B</Radio></Radio.Group></form>);
        try {
            const form = wrapper.getDOMNode();
            expect([...form.querySelectorAll('input')].map(input => input.name)).toEqual(['choice', 'choice']);
            expect([...new FormData(form).keys()]).toEqual(['choice']);
        } finally { wrapper.unmount(); }
    });

    it('keeps the generated name stable through updates and explicit overrides', () => {
        const wrapper = mount(<Radio.Group value="a"><Radio value="a">A</Radio><Radio value="b">B</Radio></Radio.Group>);
        try {
            const generated = wrapper.find('input').first().getDOMNode().name;
            wrapper.setProps({ value: 'b' });
            expect(wrapper.find('input').first().getDOMNode().name).toBe(generated);
            wrapper.setProps({ name: 'choice' });
            expect(wrapper.find('input').first().getDOMNode().name).toBe('choice');
            wrapper.setProps({ name: undefined });
            expect(wrapper.find('input').first().getDOMNode().name).toBe(generated);
        } finally { wrapper.unmount(); }
    });

    it('does not generate random group names during server rendering', () => {
        const element = <Radio.Group><Radio addonId="first" value="a">A</Radio></Radio.Group>;
        const first = renderToString(element), second = renderToString(element);
        expect(first).toBe(second);
        expect(first).not.toContain('name="default"');
        expect(first).not.toContain('name="semi-radio-group');
    });
});
