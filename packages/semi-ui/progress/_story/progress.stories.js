import React, { useState } from 'react';
import { Progress, IconButton } from '../../index';

export default {
  title: 'Progress'
}

export const _Progress = () => (
  <div style={{ width: 200 }}>
    {/* <Progress percent={10} style= {{ height: 10 }}/> */}
    <Progress percent={25} />
    <Progress percent={50} />
    <Progress percent={80} />
  </div>
);

_Progress.story = {
  name: 'progress',
};

export const Vertical = () => (
  <div style={{ height: 200 }}>
    <Progress percent={10} direction="vertical" style={{ width: 10 }} />
    <Progress percent={25} direction="vertical" />
    <Progress percent={50} direction="vertical" />
    <Progress percent={80} direction="vertical" />
  </div>
);

Vertical.story = {
  name: 'vertical',
};

export const CircleProgress = () => (
  <React.Fragment>
    <Progress percent={10} type="circle" />
    <Progress percent={25} type="circle" />
    <Progress percent={50} type="circle" />
    <Progress percent={80} type="circle" />
  </React.Fragment>
);

CircleProgress.story = {
  name: 'circle progress',
};

export const CircleProgressSmall = () => (
  <React.Fragment>
    <Progress percent={10} type="circle" size="small" />
    <Progress percent={25} type="circle" size="small" />
    <Progress percent={50} type="circle" size="small" />
    <Progress percent={80} type="circle" size="small" />
  </React.Fragment>
);

CircleProgressSmall.story = {
  name: 'circle progress small',
};

export const ProgressShowInfo = () => (
  <div style={{ width: 200 }}>
    {/* <Progress percent={10} style= {{ height: 10 }}/> */}
    <Progress percent={25} showInfo />
    <Progress percent={50} showInfo />
    <Progress percent={80} showInfo />
  </div>
);

ProgressShowInfo.story = {
  name: 'progress showInfo',
};
