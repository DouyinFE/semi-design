import React from 'react';
import { mount } from 'enzyme';
import DatePicker from '../index';

// 06:30:12.123Z is the second 01:30:12 in New York on 2026-11-01.
const secondOccurrence = () => new Date('2026-11-01T06:30:12.123Z');

describe('DatePicker keeps a known instant across timezone switches', () => {
    it.each([['value'], ['defaultValue']])('keeps the second occurrence of a repeated time, %s', valueProp => {
        const props = { type: 'dateTime', format: 'yyyy-MM-dd HH:mm:ss', motion: false, [valueProp]: secondOccurrence() };
        const wrapper = mount(<DatePicker {...props} timeZone="America/New_York" />);
        const input = () => wrapper.find('input').getDOMNode().value;
        try {
            expect(input()).toBe('2026-11-01 01:30:12');
            wrapper.setProps({ timeZone: 'UTC' });
            expect(input()).toBe('2026-11-01 06:30:12');
            wrapper.setProps({ timeZone: 'America/New_York' });
            wrapper.setProps({ timeZone: 'Asia/Shanghai' });
            expect(input()).toBe('2026-11-01 14:30:12');
        } finally {
            wrapper.unmount();
        }
    });
});
