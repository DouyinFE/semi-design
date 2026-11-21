import React from 'react';
import AutoComplete from '..';
import { Form } from '../../form';

describe('AutoComplete input id', () => {
    it('puts the id on the native input', () => {
        const wrapper = mount(<AutoComplete id="city" />);
        expect(wrapper.find('input').prop('id')).toBe('city');
        expect(wrapper.find('div#city').exists()).toBe(false);
        wrapper.setProps({ id: 'destination' });
        expect(wrapper.find('input').prop('id')).toBe('destination');
        wrapper.unmount();
    });

    it('associates the Form label with its input', () => {
        const wrapper = mount(<Form><Form.AutoComplete field="city" label="City" /></Form>);
        const input = wrapper.find('input').getDOMNode();
        const label = wrapper.find('label').getDOMNode();
        expect(label.control).toBe(input);
        expect(label.htmlFor).toBe(input.id);
        wrapper.unmount();
    });

    it('lets a custom trigger put the id on its own input', () => {
        const wrapper = mount(<AutoComplete id="custom-city" triggerRender={({ id }) => <input id={id} />} />);
        expect(wrapper.find('input').prop('id')).toBe('custom-city');
        expect(wrapper.find('div#custom-city').exists()).toBe(false);
        wrapper.unmount();
    });

    it('keeps an omitted id unset', () => {
        const wrapper = mount(<AutoComplete />);
        expect(wrapper.find('input').prop('id')).toBeUndefined();
        wrapper.unmount();
    });
});
