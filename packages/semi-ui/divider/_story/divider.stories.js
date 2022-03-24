import React from 'react';
import { storiesOf } from '@storybook/react';
// import { withKnobs, text, boolean } from '@storybook/addon-knobs';

import Divider from '../index';
import { IllustrationSuccess } from '@douyinfe/semi-illustrations';

const stories = storiesOf('Divider', module);

stories.add('Divider default', () => (
    <div>
        <p>Semi Design</p>
        <Divider />
        <p>Semi Design</p>
        <Divider />
        <p>Semi Design</p>
        <Divider dashed />
        <p>Semi Design</p>
    </div>
));

stories.add('Divider vertical', () => (
    <div>
        <span>Semi Design</span>
        <Divider layout="vertical" />
        <span>Semi Design</span>
        <Divider layout="vertical" />
        <span>Semi Design</span>
    </div>
));

stories.add('Divider title', () => (
    <div>
        <p>Semi Design </p>
        <Divider>Title</Divider>
        <p>Semi Design </p>
        <Divider align='left'>Title</Divider>
        <p>Semi Design </p>
        <Divider align='right'>Title</Divider>
        <p>Semi Design </p>
        <Divider plain>Title</Divider>
        <p>Semi Design </p>
        <Divider plain align='left'>Title</Divider>
        <p>Semi Design </p>
        <Divider plain align='right'>Title</Divider>
        <p>Semi Design </p>
    </div>
));
