import React from 'react';
import TableOnRow from '../Perf/Render/onRow';
import RTLWrapper from '../../../configProvider/_story/RTLDirection/RTLWrapper';

const App = function (props) {
    return (
        <RTLWrapper>
            <TableOnRow />
        </RTLWrapper>
    );
};

export default App;
