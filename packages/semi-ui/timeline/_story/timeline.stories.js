import React, { useState } from 'react';
import { storiesOf } from '@storybook/react'; // import { withKnobs, text, boolean } from '@storybook/addon-knobs';

import Timeline from '../index';
import { Icon } from '../../index';
import { IconAlertTriangle } from '@douyinfe/semi-icons';
const stories = storiesOf('Timeline', module); // stories.addDecorator(withKnobs);;

stories.add('default Timeline', () => (
    <div>
        <Timeline>
            <Timeline.Item time="2015-09-01">创建服务现场</Timeline.Item>
            <Timeline.Item time="2015-09-01">初步排除网络异常</Timeline.Item>
            <Timeline.Item time="2015-09-01">技术测试异常</Timeline.Item>
            <Timeline.Item time="2015-09-01">网络异常正在修复</Timeline.Item>
        </Timeline>
    </div>
));
stories.add('color', () => (
    <div>
        <Timeline>
            <Timeline.Item time="2015-09-01" type="success">
                创建服务现场
            </Timeline.Item>
            <Timeline.Item time="2015-09-01">初步排除网络异常</Timeline.Item>
            <Timeline.Item time="2015-09-01" type="warning">
                技术测试异常
            </Timeline.Item>
            <Timeline.Item time="2015-09-01" type="error">
                网络异常正在修复
            </Timeline.Item>
        </Timeline>
    </div>
));
stories.add('custom', () => (
    <div>
        <Timeline>
            <Timeline.Item time="2015-09-01" color="pink">
                创建服务现场
            </Timeline.Item>
            <Timeline.Item time="2015-09-01" color="pink">
                <span
                    style={{
                        fontSize: '18px',
                    }}
                >
                    初步排除网络异常
                </span>
            </Timeline.Item>
            <Timeline.Item time="2015-09-01" dot={<IconAlertTriangle />} type="warning">
                技术测试异常
            </Timeline.Item>
            <Timeline.Item time="2015-09-01" extra="节点辅助说明信息">
                初步排除网络异常
            </Timeline.Item>
        </Timeline>
    </div>
));
stories.add('mode', () => (
    <div>
        <div
            style={{
                width: '300px',
            }}
        >
            <Timeline mode="alternate">
                <Timeline.Item time="2015-09-01">创建服务现场</Timeline.Item>
                <Timeline.Item time="2015-09-01">初步排除网络异常</Timeline.Item>
                <Timeline.Item time="2015-09-01">技术测试异常</Timeline.Item>
                <Timeline.Item time="2015-09-01">网络异常正在修复</Timeline.Item>
            </Timeline>
        </div>
        <br />
        <div
            style={{
                width: '300px',
            }}
        >
            <Timeline mode="right">
                <Timeline.Item time="2015-09-01">创建服务现场</Timeline.Item>
                <Timeline.Item time="2015-09-01">初步排除网络异常</Timeline.Item>
                <Timeline.Item time="2015-09-01">技术测试异常</Timeline.Item>
                <Timeline.Item time="2015-09-01">网络异常正在修复</Timeline.Item>
            </Timeline>
        </div>
        <br />
        <div
            style={{
                width: '300px',
            }}
        >
            <Timeline mode="center">
                <Timeline.Item time="2015-09-01">创建服务现场</Timeline.Item>
                <Timeline.Item time="2015-09-01">初步排除网络异常</Timeline.Item>
                <Timeline.Item time="2015-09-01">技术测试异常</Timeline.Item>
                <Timeline.Item time="2015-09-01">网络异常正在修复</Timeline.Item>
            </Timeline>
        </div>
    </div>
));
const data = [
    {
        time: '2019-07-14 10:35',
        extra: '节点辅助说明信息',
        content: '创建服务现场',
        type: 'ongoing',
    },
    {
        time: '2019-06-13 16:17',
        extra: '节点辅助说明信息',
        content: (
            <span
                style={{
                    fontSize: '18px',
                }}
            >
                初步排除网络异常
            </span>
        ),
        color: 'pink',
    },
    {
        time: '2019-05-14 18:34',
        extra: '节点辅助说明信息',
        dot: <IconAlertTriangle />,
        content: '技术测试异常',
        type: 'warning',
    },
    {
        time: '2019-05-09 09:12',
        extra: '节点辅助说明信息',
        content: '网络异常正在修复',
        type: 'success',
    },
];
stories.add('dataSource', () => (
    <div
        style={{
            width: '400px',
        }}
    >
        <Timeline mode="alternate" dataSource={data} />
    </div>
));
