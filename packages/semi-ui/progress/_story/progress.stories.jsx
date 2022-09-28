import React, { useState } from 'react';
import { Progress, IconButton } from '../../index';

export default {
  title: 'Progress'
}

export const _Progress = () => (
  <div style={{ width: 200 }}>
    {/* <Progress percent={10} style= {{ height: 10 }}/> */}
    <Progress percent={25} aria-label="disk usage"/>
    <Progress percent={50} aria-label="disk usage"/>
    <Progress percent={80} aria-label="disk usage"/>
  </div>
);

_Progress.story = {
  name: 'progress',
};

export const Vertical = () => (
  <div style={{ height: 200 }}>
    <Progress percent={10} direction="vertical" style={{ width: 10 }} aria-label="disk usage"/>
    <Progress percent={25} direction="vertical" aria-label="disk usage"/>
    <Progress percent={50} direction="vertical" aria-label="disk usage"/>
    <Progress percent={80} direction="vertical" aria-label="disk usage"/>
  </div>
);

Vertical.story = {
  name: 'vertical',
};

export const CircleProgress = () => (
  <React.Fragment>
    <Progress percent={10} type="circle" aria-label="disk usage"/>
    <Progress percent={25} type="circle" aria-label="disk usage"/>
    <Progress percent={50} type="circle" aria-label="disk usage"/>
    <Progress percent={80} type="circle" aria-label="disk usage"/>
  </React.Fragment>
);

CircleProgress.story = {
  name: 'circle progress',
};

export const CircleProgressSmall = () => (
  <React.Fragment>
    <Progress percent={10} type="circle" size="small" aria-label="disk usage"/>
    <Progress percent={25} type="circle" size="small" aria-label="disk usage"/>
    <Progress percent={50} type="circle" size="small" aria-label="disk usage"/>
    <Progress percent={80} type="circle" size="small" aria-label="disk usage"/>
  </React.Fragment>
);

CircleProgressSmall.story = {
  name: 'circle progress small',
};

export const ProgressShowInfo = () => (
  <div style={{ width: 200 }}>
    {/* <Progress percent={10} style= {{ height: 10 }}/> */}
    <Progress percent={25} showInfo aria-label="disk usage"/>
    <Progress percent={50} showInfo aria-label="disk usage"/>
    <Progress percent={80} showInfo aria-label="disk usage"/>
  </div>
);

ProgressShowInfo.story = {
  name: 'progress showInfo',
};
