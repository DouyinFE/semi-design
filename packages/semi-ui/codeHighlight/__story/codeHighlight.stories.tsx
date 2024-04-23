import * as React from 'react';
import Demo from './Demo';
import { storiesOf } from '@storybook/react';

const stories = storiesOf('CodeHighlight', module);
stories.add('CodeHighlight', () => <Demo />);
