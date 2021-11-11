import React from 'react';
import { storiesOf } from '@storybook/react';
// import { withKnobs, text, boolean } from '@storybook/addon-knobs';

import Empty from '../index';
import Button from '../../button';
import { IllustrationSuccess } from '@douyinfe/semi-illustrations';

const stories = storiesOf('Empty', module);

stories.add('empty simple', () => (
    <div>
        <Empty image={<IllustrationSuccess />} description={'功能建设中'} />
        <br />
        <Empty image={<IllustrationSuccess />} description={'功能建设中'}>
            该模块功能建设中，敬请期待。该模块功能建设中，敬请期待。
        </Empty>
        <br />
        <Empty image={<IllustrationSuccess />}>该模块功能建设中，敬请期待。该模块功能建设中，敬请期待。</Empty>
        <br />
        <Empty description={'功能建设中'}>该模块功能建设中，敬请期待。该模块功能建设中，敬请期待。</Empty>
    </div>
));

stories.add('empty cta', () => (
    <div>
        <Empty description={'功能建设中'} image={<IllustrationSuccess />}>
            <div style={{ textAlign: 'center' }}>
                <p>该模块功能建设中，敬请期待。该模块功能建设中，敬请期待。</p>
                <Button type="primary" style={{ marginTop: 24 }}>
                    建设中
                </Button>
            </div>
        </Empty>
    </div>
));

stories.add('empty layout', () => (
    <div>
        <Empty description={'功能建设中'} image={<IllustrationSuccess />} layout="horizontal">
            <div>
                <p>该模块功能建设中，敬请期待。该模块功能建设中，敬请期待。</p>
                <Button type="primary" style={{ marginTop: 24 }}>
                    建设中
                </Button>
            </div>
        </Empty>
    </div>
));
