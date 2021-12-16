import React from 'react';

import Banner from '../index';
import Button from '@douyinfe/semi-ui/button/index';

export default {
  title: 'Banner',
}


export const Default = () => (
  <>
    <Banner description="A pre-released version is available" />
    <br />
    <Banner
      onClick={e => console.log('clicking banner!!!!', e.target)}
      onClose={e => {
        e.stopPropagation();
      }}
      description="A pre-released version is available A pre-released version is availableA pre-released version is availableA pre-released version is availableA pre-released version is availableA pre-released version is availableA pre-released version is available"
    >
      <Button onClick={e => e.stopPropagation()}>test</Button>
    </Banner>
  </>
);

export const InContainer = () => (
  <Banner
    onClick={e => console.log('clicking banner!!!!', e.target)}
    onClose={e => {
      e.stopPropagation();
    }}
    fullMode={false}
    title="标题"
    description="A pre-released version is available"
  >
    <Button onClick={e => e.stopPropagation()}>test</Button>
  </Banner>
);

export const InContainerAndBordered = () => (
  <Banner title="标题" bordered description="A pre-released version is available">
    <Button onClick={e => e.stopPropagation()}>test</Button>
  </Banner>
);
