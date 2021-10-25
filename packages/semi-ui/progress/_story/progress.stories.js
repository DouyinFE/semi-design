import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { Progress, IconButton } from '../../index';

const stories = storiesOf('Progress', module);

stories.add('progress', () => (
    <div style={{ width: 200 }}>
        {/* <Progress percent={10} style= {{ height: 10 }}/> */}
        <Progress percent={25} />
        <Progress percent={50} />
        <Progress percent={80} />
    </div>
));

stories.add('vertical', () => (
    <div style={{ height: 200 }}>
        <Progress percent={10} direction="vertical" style={{ width: 10 }} />
        <Progress percent={25} direction="vertical" />
        <Progress percent={50} direction="vertical" />
        <Progress percent={80} direction="vertical" />
    </div>
));

stories.add('circle progress', () => (
    <React.Fragment>
        <Progress percent={10} type="circle" />
        <Progress percent={25} type="circle" />
        <Progress percent={50} type="circle" />
        <Progress percent={80} type="circle" />
    </React.Fragment>
));

stories.add('circle progress small', () => (
    <React.Fragment>
        <Progress percent={10} type="circle" size="small" />
        <Progress percent={25} type="circle" size="small" />
        <Progress percent={50} type="circle" size="small" />
        <Progress percent={80} type="circle" size="small" />
    </React.Fragment>
));

stories.add('progress showInfo', () => (
    <div style={{ width: 200 }}>
        {/* <Progress percent={10} style= {{ height: 10 }}/> */}
        <Progress percent={25} showInfo />
        <Progress percent={50} showInfo />
        <Progress percent={80} showInfo />
    </div>
));
