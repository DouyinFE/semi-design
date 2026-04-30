import Demo from './Demo';
import DraggableDemo from './DraggableDemo';
import React from 'react';
import { storiesOf } from '@storybook/react';

const stories = storiesOf('Tabs', module);
stories.add('Tabs', () => <Demo />);
stories.add('Draggable Tabs', () => <DraggableDemo />);
