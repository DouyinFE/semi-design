import React from 'react';
import DatePicker from '../../index';
import { Tooltip } from '@douyinfe/semi-ui';

export default function Demo() {
    const dateStyle = { width: '100%', height: '100%', border: '1px solid #0077FA', display: 'flex', justifyContent: 'center', alignItems: 'center' };
    const renderDate = (dayNumber, fullDate) => {
        if (dayNumber === 1) {
            return <Tooltip content={'Always Day 1'} >
                <div style={dateStyle}>{dayNumber}</div>
            </Tooltip>
        }
        return dayNumber;
    };
    return (
        <div>
            <div>通过 renderDate 可以自定义日期的显示内容</div>
            <DatePicker renderDate={renderDate} />
        </div>
    );
}
