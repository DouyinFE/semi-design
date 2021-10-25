import React from 'react';
import { storiesOf } from '@storybook/react';
// import { withKnobs, text, boolean } from '@storybook/addon-knobs';
import withPropsCombinations from 'react-storybook-addon-props-combinations';

import Banner from '../index';

import Button from '@douyinfe/semi-ui/button/index';

const stories = storiesOf('Banner', module);

// stories.addDecorator(withKnobs);;

stories.add('basic banner', () => (
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
));

stories.add('in container', () => (
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
));

stories.add('in container and bordered', () => (
    <Banner title="标题" bordered description="A pre-released version is available">
        <Button onClick={e => e.stopPropagation()}>test</Button>
    </Banner>
));
