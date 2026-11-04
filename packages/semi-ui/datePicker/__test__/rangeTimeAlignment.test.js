import React from 'react';
import sinon from 'sinon';
import DatePicker from '../index';
import ScrollItem from '../../scrollList/scrollItem';

describe('DatePicker range time alignment', () => {
    it.each([
        ['default', 'right', 'left', 'Previous month', 2],
        ['compact', 'right', 'left', 'Previous month', 2],
        ['default', 'left', 'right', 'Next month', 1],
        ['compact', 'left', 'right', 'Next month', 1],
    ])('recenters %s %s time lists when the other calendar changes week count', (density, timeSide, calendarSide, direction, steps) => {
        const onChange = sinon.spy();
        const wrapper = mount(<DatePicker type="dateTimeRange" density={density} motion={false} defaultOpen defaultValue={[new Date(2026, 0, 15, 12, 30, 20), new Date(2026, 1, 15, 14, 40, 30)]} onChange={onChange} />);
        wrapper.find('.semi-datepicker-month-grid-' + timeSide + ' .semi-datepicker-switch-time').simulate('click');
        const scrollSpies = wrapper.find(ScrollItem).map(item => sinon.spy(item.instance(), 'scrollToIndex'));
        try {
            expect(scrollSpies.length).toBe(3);
            for (let step = 0; step < steps; step++) {
                wrapper.find('.semi-datepicker-month-grid-' + calendarSide + ' button[aria-label="' + direction + '"]').simulate('click');
                if (steps === 2 && step === 0) {
                    scrollSpies.forEach(spy => expect(spy.callCount).toBe(0));
                }
            }
            scrollSpies.forEach(spy => expect(spy.callCount).toBe(1));
            expect(onChange.callCount).toBe(0);
        } finally {
            scrollSpies.forEach(spy => spy.restore());
            wrapper.unmount();
        }
    });
});
