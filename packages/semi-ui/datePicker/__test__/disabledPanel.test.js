import React from 'react';
import DatePicker from '../index';
import BaseDatePicker from '../datePicker';

describe('DatePicker dynamic disabled', () => {
    it.each(['date', 'dateRange'])('closes an open %s panel when disabled changes', type => {
        const value = new Date(2026, 0, 15);
        const wrapper = mount(<DatePicker motion={false} open type={type} defaultValue={type === 'date' ? value : [value, new Date(2026, 1, 15)]} />);
        expect(wrapper.find('.semi-datepicker-month-grid').length).toBe(1);
        wrapper.setProps({ disabled: true });
        wrapper.update();
        expect(wrapper.find(BaseDatePicker).state('panelShow')).toBe(false);
        expect(wrapper.find('input').everyWhere(input => input.prop('disabled'))).toBe(true);
        wrapper.setProps({ disabled: false });
        wrapper.update();
        expect(wrapper.find(BaseDatePicker).state('panelShow')).toBe(true);
        expect(wrapper.find('.semi-datepicker-month-grid').length).toBe(1);
        wrapper.unmount();
    });

    it('does not reopen a closed controlled panel when enabled', () => {
        const wrapper = mount(<DatePicker motion={false} open={false} disabled />);
        wrapper.setProps({ disabled: false });
        wrapper.update();
        expect(wrapper.find(BaseDatePicker).state('panelShow')).toBe(false);
        wrapper.unmount();
    });

    it('closes an uncontrolled open panel when disabled changes', () => {
        const wrapper = mount(<DatePicker motion={false} defaultOpen />);
        expect(wrapper.find('.semi-datepicker-month-grid').length).toBe(1);
        wrapper.setProps({ disabled: true });
        wrapper.update();
        expect(wrapper.find(BaseDatePicker).state('panelShow')).toBe(false);
        wrapper.setProps({ disabled: false });
        wrapper.update();
        expect(wrapper.find(BaseDatePicker).state('panelShow')).toBe(false);
        wrapper.unmount();
    });
});

