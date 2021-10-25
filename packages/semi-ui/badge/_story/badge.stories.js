import React from 'react';
import { storiesOf } from '@storybook/react';
// import { withKnobs, text, boolean } from '@storybook/addon-knobs';

import Badge from '../index';
import Icon from '../../icons';

const stories = storiesOf('Badge', module);



const style = {
    width: '42px',
    height: '42px',
    borderRadius: '4px',
    background: '#eee',
    display: 'inline-block',
    verticalAlign: 'middle',
};

stories.add('Badge default', () => (
    <div>
        <Badge count={5}>
            <a style={style}></a>
        </Badge>
        <Badge dot>
            <a style={style}></a>
        </Badge>
        <Badge count={5} />
        <Badge dot />
    </div>
));

stories.add('Badge maxCount', () => (
    <div>
        <Badge count={99} >
            <a style={style}></a>
        </Badge>
        <Badge count={100} >
            <a style={style}></a>
        </Badge>
        <Badge count={99} overflowCount={10} >
            <a style={style}></a>
        </Badge>
        <Badge count={1000} overflowCount={999} >
            <a style={style}></a>
        </Badge>
    </div>
));

stories.add('Badge type', () => (
    <div>
        <Badge count={5} type='primary' >
            <a style={style}></a>
        </Badge>
        <Badge count={5} type='secondary' >
            <a style={style}></a>
        </Badge>
        <Badge count={5} type='tertiary' >
            <a style={style}></a>
        </Badge>
        <Badge count={5} type='warning' >
            <a style={style}></a>
        </Badge>
        <Badge count={5} type='danger' >
            <a style={style}></a>
        </Badge>
        <Badge dot type='primary' >
            <a style={style}></a>
        </Badge>
    </div>
));

stories.add('Badge theme', () => (
    <div>
        <Badge count={5} theme='solid' >
            <a style={style}></a>
        </Badge>
        <Badge count={5} theme='light' >
            <a style={style}></a>
        </Badge>
        <Badge count={5} theme='inverted' >
            <a style={style}></a>
        </Badge>
        <Badge dot theme='solid' >
            <a style={style}></a>
        </Badge>
        <Badge dot theme='light' >
            <a style={style}></a>
        </Badge>
        <Badge dot theme='inverted' >
            <a style={style}></a>
        </Badge>
    </div>
));
