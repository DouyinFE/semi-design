import React, { useRef } from 'react';
import BaseDatePicker from '../../datePicker';
import { DatePicker, Space } from '../../../index';

/**
 * test in cypress
 */
export default function Demo() {
    const ref = useRef<BaseDatePicker>();

    const handleClickOutside = () => {
        console.log('click outside');
        ref.current && ref.current.close();
    };

    return (
        <DatePicker motion={false} type="dateTime" needConfirm ref={ref} onClickOutSide={handleClickOutside} />
    );
}

Demo.storyName = 'onClickOutside';
Demo.parameters = {
    chromatic: { disableSnapshot: false },
};
