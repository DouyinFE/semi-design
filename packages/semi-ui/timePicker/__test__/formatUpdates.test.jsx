import React from 'react';
import { mount } from 'enzyme';
import TimePicker from '../index';
describe('TimePicker format updates', () => {
    it('updates the existing value and panel width when the format changes', () => {
        const onChange = sinon.spy();
        const wrapper = mount(<TimePicker open motion={false} defaultValue="10:20:30" format="HH:mm:ss" onChange={onChange} />);
        try {
            wrapper.setProps({ format: 'HH:mm' });
            wrapper.update();
            expect(wrapper.find('input').prop('value')).toBe('10:20');
            expect(document.querySelector('.semi-timepicker-panel-column-2')).not.toBeNull();
            expect(document.querySelectorAll('.semi-timepicker-panel-list-second').length).toBe(0);
            wrapper.setProps({ format: 'HH:mm:ss' });
            wrapper.update();
            expect(wrapper.find('input').prop('value')).toBe('10:20:30');
            expect(onChange.called).toBe(false);
        } finally { wrapper.unmount(); }
    });
    it.each([
        [false, 3],
        [true, 4],
    ])('counts the default columns for an explicit undefined format, use12Hours=%s', (use12Hours, columns) => {
        const wrapper = mount(<TimePicker open motion={false} format={undefined} use12Hours={use12Hours} />);
        try {
            expect(document.querySelector(`.semi-timepicker-panel-column-${columns}`)).not.toBeNull();
        } finally { wrapper.unmount(); }
    });
    it.each([
        ['defaultValue'],
        ['value'],
    ])('treats an explicit undefined format like an omitted one when use12Hours changes, %s', valueProp => {
        const props = { motion: false, timeZone: 'UTC', [valueProp]: new Date(Date.UTC(2026, 0, 15, 19, 20, 30)) };
        const onChange = sinon.spy();
        const omitted = mount(<TimePicker {...props} />);
        const explicit = mount(<TimePicker {...props} format={undefined} onChange={onChange} />);
        try {
            expect(explicit.find('input').prop('value')).toBe('19:20:30');
            [omitted, explicit].forEach(wrapper => {
                wrapper.setProps({ use12Hours: true });
                wrapper.update();
            });
            expect(explicit.find('input').prop('value')).not.toBe('19:20:30');
            expect(explicit.find('input').prop('value')).toBe(omitted.find('input').prop('value'));
            expect(onChange.called).toBe(false);
        } finally {
            omitted.unmount();
            explicit.unmount();
        }
    });
    it('formats an updated controlled value using the latest format', () => {
        const wrapper = mount(<TimePicker motion={false} value="10:20:30" format="HH:mm:ss" />);
        try {
            wrapper.setProps({ format: 'HH:mm', value: '11:22' });
            wrapper.update();
            expect(wrapper.find('input').prop('value')).toBe('11:22');
        } finally { wrapper.unmount(); }
    });
});
