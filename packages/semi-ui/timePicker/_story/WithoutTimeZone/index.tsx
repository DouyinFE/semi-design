import React from 'react';
import { TimePicker } from '@douyinfe/semi-ui';

// Test 1. 无时区时，应使用计算机时区
// Test 2. 无时区时，选择时间应使用计算机时间
export default function Demo() {
    const defaultTimestamp = 1745532000000;
    return (
        <TimePicker
            defaultValue={defaultTimestamp}
            onChange={(date, dateString) => console.log('DatePicker changed: ', date, dateString)}
        />
    );
}
