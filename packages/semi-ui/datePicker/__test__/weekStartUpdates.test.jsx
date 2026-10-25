import React from 'react';
import { mount } from 'enzyme';
import { rstest } from '@rstest/core';
import Month from '../month';
import locale from '../../locale/source/zh_CN';

describe('DatePicker month weekStartsOn updates', () => {
    let wrapper;
    let reference;
    const month = new Date(2026, 10, 1);
    afterEach(() => {
        wrapper?.unmount();
        reference?.unmount();
        wrapper = null;
        reference = null;
    });

    it.each([1, 3, 6])('updates weekday labels and date cells after changing to %s', weekStartsOn => {
        wrapper = mount(<Month month={month} locale={locale.DatePicker} weekStartsOn={0} />);

        wrapper.setProps({ weekStartsOn });
        wrapper.update();
        reference = mount(<Month month={month} locale={locale.DatePicker} weekStartsOn={weekStartsOn} />);

        expect(wrapper.state('weekdays')).toEqual(reference.state('weekdays'));
        expect(wrapper.state('month').weeks).toEqual(reference.state('month').weeks);
    });

    it('updates and reports the number of week rows without changing the month', () => {
        const onWeeksRowNumChange = rstest.fn();
        wrapper = mount(<Month month={new Date(2026, 1, 1)} locale={locale.DatePicker} weekStartsOn={0} onWeeksRowNumChange={onWeeksRowNumChange} />);
        expect(wrapper.state('month').weeks).toHaveLength(4);
        onWeeksRowNumChange.mockClear();

        wrapper.setProps({ weekStartsOn: 1 });
        wrapper.update();

        expect(wrapper.state('month').weeks).toHaveLength(5);
        expect(onWeeksRowNumChange).toHaveBeenCalledWith(5);
    });
});
