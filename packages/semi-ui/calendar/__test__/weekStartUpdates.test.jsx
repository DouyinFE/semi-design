import React from 'react';
import { mount } from 'enzyme';
import { rstest } from '@rstest/core';
import Calendar from '../index';
import MonthCalendar from '../monthCalendar';

describe('Calendar month weekStartsOn updates', () => {
    let wrapper;
    let reference;
    let geometry;
    const displayValue = new Date(2026, 10, 4);
    const events = [{ key: 'monday', start: new Date(2026, 10, 2, 9), end: new Date(2026, 10, 2, 10), allDay: true, children: 'Monday event' }];
    const layout = calendar => calendar.find('.semi-calendar-month-weekrow').map((row, index) =>
        row.find('.semi-calendar-event-month').map(event => ({ row: index, left: event.prop('style').left, width: event.prop('style').width }))
    ).flat();

    beforeEach(() => {
        geometry = rstest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({ height: 132 });
    });
    afterEach(() => {
        wrapper?.unmount();
        reference?.unmount();
        wrapper = null;
        reference = null;
        geometry.mockRestore();
    });

    it.each([1, 3, 6])('keeps event placement consistent with a fresh calendar after changing to %s', weekStartsOn => {
        wrapper = mount(<Calendar mode="month" displayValue={displayValue} events={events} weekStartsOn={0} />);

        wrapper.setProps({ weekStartsOn });
        wrapper.update();
        reference = mount(<Calendar mode="month" displayValue={displayValue} events={events} weekStartsOn={weekStartsOn} />);

        expect(layout(wrapper)).toEqual(layout(reference));
        expect(layout(wrapper)).toHaveLength(1);
    });

    it('remeasures the event limit when changing weekStartsOn changes row heights', () => {
        wrapper = mount(<Calendar mode="month" displayValue={displayValue} events={events} weekStartsOn={0} />);
        const measure = rstest.spyOn(wrapper.find(MonthCalendar).instance(), 'calcItemLimit');
        geometry.mockReturnValue({ height: 108 });

        wrapper.setProps({ weekStartsOn: 1 });
        wrapper.update();

        expect(measure).toHaveBeenCalledTimes(1);
        expect(wrapper.find(MonthCalendar).state('itemLimit')).toBe(2);
    });
});
