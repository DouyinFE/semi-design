import React from 'react';
import { mount } from 'enzyme';
import Checkbox from '../index';

describe('Checkbox description ids', () => {
    it('updates supplied label and description ids', () => {
        const wrapper = mount(<Checkbox addonId="before-label" extraId="before-extra" extra="details">label</Checkbox>);
        try {
            wrapper.setProps({ addonId: 'after-label', extraId: 'after-extra' });
            wrapper.update();
            expect(wrapper.find('.semi-checkbox-addon').prop('id')).toBe('after-label');
            expect(wrapper.find('.semi-checkbox-extra').prop('id')).toBe('after-extra');
            expect(wrapper.find('input').prop('aria-labelledby')).toBe('after-label');
            expect(wrapper.find('input').prop('aria-describedby')).toBe('after-extra');
            wrapper.setProps({ addonId: undefined, extraId: undefined });
            wrapper.update();
            const labelId = wrapper.find('input').prop('aria-labelledby');
            const extraId = wrapper.find('input').prop('aria-describedby');
            expect(labelId).toBeTruthy();
            expect(extraId).toBeTruthy();
            expect(labelId).not.toBe('after-label');
            expect(extraId).not.toBe('after-extra');
            expect(wrapper.find('#' + labelId).exists()).toBe(true);
            expect(wrapper.find('#' + extraId).exists()).toBe(true);
        } finally { wrapper.unmount(); }
    });
});
