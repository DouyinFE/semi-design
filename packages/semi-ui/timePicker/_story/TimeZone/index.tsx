import React from 'react';
import { Space, TimePicker } from '@douyinfe/semi-ui';

export default function Demo() {
    const defaultTimestamp = 1745532000000;
    return (
        <Space align="start" vertical>
            <div>默认时间：{new Date(defaultTimestamp).toISOString()}</div>
            <TimePicker
                prefix="0"
                timeZone={0}
                defaultValue={defaultTimestamp}
                onChange={(date, dateString) => console.log('DatePicker changed: ', date, dateString)}
            />
            <TimePicker
                prefix="Asia/Shanghai"
                timeZone="Asia/Shanghai"
                defaultValue={defaultTimestamp}
                onChange={(date, dateString) => console.log('DatePicker changed: ', date, dateString)}
            />
            <TimePicker
                prefix="8"
                timeZone={8}
                defaultValue={defaultTimestamp}
                onChange={(date, dateString) => console.log('DatePicker changed: ', date, dateString)}
            />
            <TimePicker
                prefix="Africa/Cairo"
                timeZone="Africa/Cairo"
                defaultValue={defaultTimestamp}
                onChange={(date, dateString) => console.log('DatePicker changed: ', date, dateString)}
            />
        </Space>
    );
}
