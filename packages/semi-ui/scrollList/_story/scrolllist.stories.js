import React from 'react';
import { storiesOf } from '@storybook/react';
import ScrollList from '../index';
import ScrollItem from '../scrollItem';
import Button from '../../button';
import WheelListDemo from './WheelList';
import ScrollListDemo from './ScrollList';

const stories = storiesOf('scrollList', module);

stories.add('ScrollList simple', () => {
    return <ScrollListDemo />;
});

stories.add('wheel list demo', () => <WheelListDemo />);
