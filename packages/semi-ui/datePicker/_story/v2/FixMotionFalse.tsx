import React from 'react';
import { DatePicker, Space } from '../../../index';

/**
 * fix https://github.com/DouyinFE/semi-design/issues/1202
 */
function App() {
    return (
        <>
            <h4>motion true</h4>
            <DatePicker type="dateTimeRange" onChange={console.log} />
            <h4>motion false</h4>
            <DatePicker type="dateTimeRange" motion={false} onChange={console.log} />
            <h4>motion true minuteStep=15</h4>
            <DatePicker
                type="dateTimeRange"
                timePickerOpts={{
                    minuteStep: 15,
                }}
                format={'yyyy-MM-dd mm'}
            />

        </>
    );
}

export default App;
