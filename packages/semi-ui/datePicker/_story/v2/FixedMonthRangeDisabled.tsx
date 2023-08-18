import React from "react";
import { differenceInCalendarMonths } from 'date-fns';
import DatePicker from '../../index';

export default function App() {
    const disabledDate = (date) => {
        const now = new Date();
        const diff = differenceInCalendarMonths(now, date);
        return date > now || diff > 12; // 即只能选中近一年的所有日期
    };
    return (
        <DatePicker type="monthRange" placeholder="请选择年月范围" style={{ width: 200 }} disabledDate={disabledDate} />
    );
}