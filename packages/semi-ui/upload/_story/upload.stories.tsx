
/* argus-disable unPkgSensitiveInfo */
import React, { useRef } from 'react';
import { storiesOf } from '@storybook/react';
import Upload from '../index';

const stories = storiesOf('Upload', module);

stories.add('Upload', () => {
    const ref = useRef();
    return (
        <>
            <Upload action='//semi.design' ref={ref} />
        </>
    );
});