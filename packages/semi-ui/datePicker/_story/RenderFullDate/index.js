import React from 'react';
import DatePicker from '../../index';
import classNames from 'classnames';
import '@douyinfe/semi-foundation/datePicker/datePicker.scss'; 

export default function Demo() {
    const dayStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        margin: '0 auto',
        boxSizing: 'border-box',
        borderRadius: '50%',
    };

    const renderFullDate = (dayNumber, fullDate, dayStatus) => {
        const { isToday, isInRange, isHover, isSelected, isSelectedStart, isSelectedEnd, isDisabled } = dayStatus;
        const prefix = 'components-datepicker-demo';
        const dateCls = classNames({
            [`${prefix}-day-today`]: isToday,
            [`${prefix}-day-inrange`]: isInRange,
            [`${prefix}-day-hover`]: isHover,
            [`${prefix}-day-selected`]: isSelected,
            [`${prefix}-day-selected-start`]: isSelectedStart,
            [`${prefix}-day-selected-end`]: isSelectedEnd,
            [`${prefix}-day-disabled`]: isDisabled,
        });
        return (
            <div style={dayStyle} className={dateCls}>
                {dayNumber}
            </div>
        );
    };

    return (
        <div>
            <div>
                通过 renderFullDate 可以自定义日期单元格子的渲染，API 提供日期的当前状态：是否被选中，是否是当前日等。
            </div>  
            <div>
                单选选中
                <DatePicker style={{ width: '230px' }} renderFullDate={renderFullDate} />
            </div>
            <div>
                多选选中
                <DatePicker style={{ width: '230px' }} multiple={true} renderFullDate={renderFullDate} />
            </div>
            <div>
                范围选中
                <DatePicker style={{ width: '230px' }} type={'dateRange'} renderFullDate={renderFullDate} />
            </div>
        </div>
    );
}
