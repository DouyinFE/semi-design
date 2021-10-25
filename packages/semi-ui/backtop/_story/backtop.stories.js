import React from 'react';
import { storiesOf } from '@storybook/react'; // import { withKnobs, text, boolean } from '@storybook/addon-knobs';

import withPropsCombinations from 'react-storybook-addon-props-combinations';
import BackTop from '../index';
import Icon from '../../icons';
import { IconArrowUp } from '@douyinfe/semi-icons';

const stories = storiesOf('BackTop', module); // stories.addDecorator(withKnobs);;

stories.add('BackTop', () => (
    <div>
        <div style={{height: 1600, width: 300, background: 'grey'}}></div>
        <BackTop visibilityHeight={-1} />
  </div>
));
stories.add('custom BackTop', () => (
    <div>
        <div
            style={{
                height: 1600,
                width: 300,
                background: 'grey',
            }}
        ></div>
        <BackTop
            style={{
                height: 40,
                width: 40,
                backgroundColor: '#ddd',
                paddingTop: 12,
            }}
        >
            <IconArrowUp />
        </BackTop>
    </div>
));
