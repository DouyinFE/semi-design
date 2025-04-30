import React from 'react';
import { ConfigProvider, DatePicker, TimePicker } from '@douyinfe/semi-ui';

export default function FixTimeZoneDST() {
    const defaultValue = 1745532000000;
    return (
        <>
            <ConfigProvider timeZone={0}>
                <DatePicker defaultValue={defaultValue} type='dateTime' />
                {/* <TimePicker defaultValue={defaultValue} /> */}
            </ConfigProvider>
        </>
    );
}