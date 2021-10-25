import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
// import { withKnobs, text, boolean } from '@storybook/addon-knobs';
import withPropsCombinations from 'react-storybook-addon-props-combinations';

import Popconfirm from '../index';
import Button from '../../button';
import Input from '../../input';
import Table from '../../table';

import TypesConfrimDemo from './TypesConfirm';
import DynamicDisableDemo from './DynamicDisable';
import TitleConfirmDemo from './TitlePopconfirm';
import InTableDemo from './InTable';
import ShowArrow from './ShowArrow';

const stories = storiesOf('popconfirm', module);

// stories.addDecorator(withKnobs);;

let style = {
    display: 'inline-block',
    padding: '20px',
};

stories.add('simple', () => (
    <div>
        <div style={style}>
            <Popconfirm
                title="确定是否要保存此修改？确定是否要保存此修改？确定是否要保存此修改？确定是否要保存此修改？确定是否要保存此修改？确定是否要保存此修改？确定是否要保存此修改？确定是否要保存此修改？"
                content="此修改将不可逆"
            >
                <a>Delete</a>
            </Popconfirm>
        </div>
    </div>
));

stories.add('button', () => (
    <div>
        <div style={style}>
            <Popconfirm position="bottomLeft" title="确定是否要保存此修改？" content="此修改将不可逆">
                <Button>Save</Button>
            </Popconfirm>
        </div>
    </div>
));

const dataSource = [
    {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park, New York No. 1 Lake Park',
    },
    {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
    },
    {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
    },
    {
        key: '4',
        name: 'Disabled User',
        age: 99,
        address: 'Sidney No. 1 Lake Park',
    },
];
const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        render: text => (
            <Popconfirm position="bottomLeft" title="确定是否要保存此修改？" content="此修改将不可逆">
                <Button>{text}</Button>
            </Popconfirm>
        ),
    },
    {
        title: 'Age',
        dataIndex: 'age',
    },
    {
        title: 'Address',
        dataIndex: 'address',
    },
];

stories.add('table', () => (
    <div>
        <Table dataSource={dataSource} columns={columns} />
    </div>
));

stories.add('types-confirm', () => <TypesConfrimDemo />);

stories.add('dynamic disable', () => <DynamicDisableDemo />);

stories.add('title popconfirm', () => <TitleConfirmDemo />);

stories.add('in table', () => <InTableDemo />);
stories.add(`show arrow`, () => <ShowArrow />);
