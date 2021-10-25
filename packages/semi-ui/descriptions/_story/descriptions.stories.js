import React from 'react';
import { storiesOf } from '@storybook/react';
// import { withKnobs, text, boolean } from '@storybook/addon-knobs';

import Descriptions from '../index';

const stories = storiesOf('Descriptions', module);

let data = [
    // ShortId: '火山号',
    // UID: 'UID',
    { key: '火山号', value: 12000 },
    { key: <span>1232</span>, value: 12000 },
    { key: '粉丝', value: 3112 },
    { key: '火力', value: 3000 },
    { key: '剩余钻石', value: 3000 },
    { key: '消费', value: 3000 },
    { key: '关注', value: 3000 },
];

let data2 = [
    // ShortId: '火山号',
    // UID: 'UID',
    { key: '主播类型(签约)', value: '自由（普通）主播' },
    { key: '安全等级', value: '3级' },
    { key: '垂类标签', value: undefined },
    { key: '认证状态', value: '未认证' },
    { key: '作者来源', value: '' },
    { key: '经纪人', value: '' }
];

let data3 = [
    // ShortId: '火山号',
    // UID: 'UID',
    { key: '主播类型(签约)', value: '自由（普通）主播' },
    { key: '安全等级', value: '3级' },
    { key: '垂类标签', value: undefined },
    { key: '认证状态', value: '这是一个很长很长很长很长很长很长很长很长很长的值，需要自动换行显示' },
];

let data4 = [
    // ShortId: '火山号',
    // UID: 'UID',
    { key: '实际用户数量', value: '1,480,000' },
    { key: '7天留存', value: '98%' },
    { key: '7天留存', value: '103.4M' },
];

stories.add('Descriptions default', () => (
    <div>
        <Descriptions data={data} />
        <Descriptions align='justify' data={data2} />
        <Descriptions align='left' data={data3} />
        <Descriptions align='plain' data={data2} />
    </div>
));

stories.add('Descriptions double row', () => (
    <div>
        <Descriptions data={data4} row size='small' />
        <Descriptions data={data4} row />
        <Descriptions data={data4} row size='large' />
    </div>
));

stories.add('Descriptions.Item', () => (
    <div>
        <Descriptions>
            <Descriptions.Item itemKey='实际用户数量'>1,480,000</Descriptions.Item>
            <Descriptions.Item itemKey='7天留存'>98%</Descriptions.Item>
            <Descriptions.Item itemKey='安全等级'>3级</Descriptions.Item>
            <Descriptions.Item itemKey='垂类标签'>电商</Descriptions.Item>
            <Descriptions.Item itemKey='认证状态'>未认证</Descriptions.Item>
        </Descriptions>
        <br />
        <Descriptions row size='small'>
            <Descriptions.Item itemKey='实际用户数量'>1,480,000</Descriptions.Item>
            <Descriptions.Item itemKey='7天留存'>98%</Descriptions.Item>
            <Descriptions.Item itemKey='安全等级'>3级</Descriptions.Item>
            <Descriptions.Item itemKey='垂类标签'>电商</Descriptions.Item>
            <Descriptions.Item itemKey='认证状态'>未认证</Descriptions.Item>
        </Descriptions>
        <br />
        <Descriptions align='justify'>
            <Descriptions.Item >1,480,000</Descriptions.Item>
            <Descriptions.Item itemKey='7天留存'>98%</Descriptions.Item>
            <Descriptions.Item itemKey='安全等级'>3级</Descriptions.Item>
            <Descriptions.Item itemKey='垂类标签'>电商</Descriptions.Item>
            <Descriptions.Item itemKey='认证状态'>未认证</Descriptions.Item>
        </Descriptions>
        <br />
    </div>
));

