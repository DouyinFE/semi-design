import React from 'react';
import { mount } from 'enzyme';
import Calendar from '../index';
import DayCalendar from '../dayCalendar';
import WeekCalendar from '../weekCalendar';
import MonthCalendar from '../monthCalendar';
const views = [['public-day', Calendar, { mode: 'day' }], ['public-week', Calendar, { mode: 'week' }], ['public-month', Calendar, { mode: 'month' }], ['day-subpath', DayCalendar, {}], ['week-subpath', WeekCalendar, {}], ['month-subpath', MonthCalendar, {}]];
describe('Calendar current default date', ()=>{
    beforeEach(()=>{rs.useFakeTimers({ toFake: ['Date'] });rs.setSystemTime(new Date(2032, 0, 7, 12));});
    afterEach(()=>rs.useRealTimers());
    it.each(views)('resolves a fresh date when mounting %s', (name, View, props)=>{
        const dates = [];
        const wrapper = mount(<View {...props} showCurrTime={false} dateGridRender={(s, date)=>{dates.push(date);return null;}}/>);
        try {expect(dates.length).toBeGreaterThan(0);expect(dates.some(date=>date.getFullYear() === 2032 && date.getMonth() === 0 && date.getDate() === 7)).toBe(true);expect(dates.every(date=>date.getFullYear() >= 2031)).toBe(true);} finally {wrapper.unmount();}
    });
    it('keeps an explicit displayValue', ()=>{
        const date = new Date(2024, 5, 12, 12), dates = [];
        const wrapper = mount(<Calendar mode="day" displayValue={date} showCurrTime={false} dateGridRender={(s, value)=>{dates.push(value);return null;}}/>);
        try {expect(dates.at(-1)).toBe(date);} finally {wrapper.unmount();}
    });
});

