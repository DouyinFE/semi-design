import React from 'react';
import { DatePicker } from '@douyinfe/semi-ui';
import * as _ from 'lodash';

function Demo() {
    return (
        <div>
            <DatePicker type="dateTimeRange" style={{ width: 400 }} cancelRangeDisabled clearRangeOnReSelect />
            <DatePicker type="dateRange" style={{ width: 400 }} cancelRangeDisabled clearRangeOnReSelect />
        </div>
    );
}

export default Demo;
