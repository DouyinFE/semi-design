import React from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';
import DatePicker from '../index';
import { sleep } from '../../_test_/utils';

describe('DatePicker local dates when changing month or year', () => {
    it.each([
        ['2024-06-15', 'Next month', '2024-07-15'],
        ['2024-06-15', 'Previous month', '2024-05-15'],
        ['2024-06-15', 'Next year', '2025-06-15'],
        ['2024-06-15', 'Previous year', '2023-06-15'],
        ['2024-01-31', 'Next month', '2024-02-29'],
    ])('keeps %s at local midnight after %s', async (defaultValue, button, expected) => {
        const onChange = sinon.spy();
        const wrapper = mount(<DatePicker defaultOpen motion={false} defaultValue={defaultValue} onChange={onChange} />);
        try {
            await sleep(20);
            wrapper.update();
            wrapper.find(`button[aria-label="${button}"]`).simulate('click');
            expect(onChange.calledOnce).toBe(true);
            const [date, dateString] = onChange.firstCall.args;
            expect(dateString).toBe(expected);
            expect([date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()]).toEqual([0, 0, 0, 0]);
        } finally {
            wrapper.unmount();
        }
    });

    it.each([
        { autoSwitchDate: false },
        { disabledDate: date => date.getMonth() === 6 },
    ])('does not change the selected date when blocked by %j', async props => {
        const onChange = sinon.spy();
        const wrapper = mount(<DatePicker defaultOpen motion={false} defaultValue="2024-06-15" onChange={onChange} {...props} />);
        try {
            await sleep(20);
            wrapper.update();
            wrapper.find('button[aria-label="Next month"]').simulate('click');
            expect(onChange.called).toBe(false);
        } finally {
            wrapper.unmount();
        }
    });

    it('preserves the selected time for dateTime', async () => {
        const onChange = sinon.spy();
        const wrapper = mount(<DatePicker type="dateTime" defaultOpen motion={false} defaultValue={new Date(2024, 5, 15, 8, 9, 10)} onChange={onChange} />);
        try {
            await sleep(20);
            wrapper.update();
            wrapper.find('button[aria-label="Next month"]').simulate('click');
            expect(onChange.calledOnce).toBe(true);
            const [date] = onChange.firstCall.args;
            expect([date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()]).toEqual([2024, 6, 15, 8, 9, 10]);
        } finally {
            wrapper.unmount();
        }
    });
});
