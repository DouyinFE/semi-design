import React, { useState } from 'react';

import Popconfirm from '../index';
import Button from '../../button';
import Input from '../../input';
import Table from '../../table';
import Toast from '../../toast';

import TypesConfrimDemo from './TypesConfirm';
import DynamicDisableDemo from './DynamicDisable';
import TitleConfirmDemo from './TitlePopconfirm';
import InTableDemo from './InTable';
import ShowArrow from './ShowArrow';

export default {
  title: 'Popconfirm',
  parameters: {
    chromatic: { disableSnapshot: true },
  },
}

let style = {
  display: 'inline-block',
  padding: '20px',
};

export const Simple = () => (
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
);

Simple.story = {
  name: 'simple',
};

export const _Button = () => (
  <div>
    <div style={style}>
      <Popconfirm position="bottomLeft" title="确定是否要保存此修改？" content="此修改将不可逆此修改将不可逆此修改将不可逆此修">
        <Button>Save</Button>
      </Popconfirm>
    </div>
  </div>
);

_Button.story = {
  name: 'button',
};

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

export const _Table = () => (
  <div>
    <Table dataSource={dataSource} columns={columns} />
  </div>
);

_Table.story = {
  name: 'table',
};

export const TypesConfirm = () => <TypesConfrimDemo />;

TypesConfirm.story = {
  name: 'types-confirm',
};

export const DynamicDisable = () => <DynamicDisableDemo />;

DynamicDisable.story = {
  name: 'dynamic disable',
};

export const TitlePopconfirm = () => <TitleConfirmDemo />;

TitlePopconfirm.story = {
  name: 'title popconfirm',
};

export const InTable = () => <InTableDemo />;

InTable.story = {
  name: 'in table',
};


export const ShowArrowDemo = () => <ShowArrow />;
ShowArrowDemo.style = {
  name: 'show arrow'
}

export const ClickOutSideDemo = () => {
    const [v, setV] = useState(false)
    const onConfirm = () => {
      Toast.success('确认保存！');
    };

    const onCancel = () => {
      Toast.warning('取消保存！');
    }
    return (
      <Popconfirm
          title="确定是否要保存此修改？"
          content="此修改将不可逆"
          visible={v}
          onClickOutSide={onCancel}
          onConfirm={onConfirm}
          onCancel={onCancel}
      >
          <Button onClick={() => setV(true)}>保存</Button>
      </Popconfirm>
    )
}


ClickOutSideDemo.story = {
  name: 'ClickOutSideDemo',
};