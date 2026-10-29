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
    it('formats an updated controlled value using the latest format', () => {
        const wrapper = mount(<TimePicker motion={false} value="10:20:30" format="HH:mm:ss" />);
        try {
            wrapper.setProps({ format: 'HH:mm', value: '11:22' });
            wrapper.update();
            expect(wrapper.find('input').prop('value')).toBe('11:22');
        } finally { wrapper.unmount(); }
    });
});
