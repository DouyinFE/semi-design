import React from 'react';
import WheelListDemo from './WheelList';
import ScrollListDemo from './ScrollList';


export default {
  title: 'ScrollList'
}

export const ScrollListSimple = () => {
  return <ScrollListDemo />;
};

ScrollListSimple.story = {
  name: 'ScrollList simple',
};

ScrollListSimple.parameters = {
  chromatic: { disableSnapshot: true },
}

export const _WheelListDemo = () => <WheelListDemo />;

_WheelListDemo.story = {
  name: 'wheel list demo',
};
