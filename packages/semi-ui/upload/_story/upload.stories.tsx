
/* argus-disable unPkgSensitiveInfo */
import React from 'react';
import { storiesOf } from '@storybook/react';
import Upload from '../index';

const stories = storiesOf('Upload', module);

stories.add('Upload', () => (
    <>
        <Upload action='//semi.design' />
    </>
));