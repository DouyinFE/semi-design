import React, { useState } from 'react';
import { Icon, Tag, Table, Slider } from '../../index';
import OverflowList from '..';
import {
  IconAlarm,
  IconCamera,
  IconBookmark,
  IconDuration,
  IconEdit,
  IconFolder,
  IconFolderOpen,
  IconBolt,
} from '@douyinfe/semi-icons';

export default {
  title: 'OverflowList'
}

const ITEMS = [
  { icon: <IconFolderOpen />, key: 'All' },
  { icon: <IconFolderOpen />, key: 'Users' },
  { icon: <IconFolderOpen />, key: 'Janet' },
  { href: '#', icon: <IconFolderOpen />, key: 'Photos' },
  { href: '#', icon: <IconFolderOpen />, key: 'Wednesday' },
  { icon: <IconBolt />, key: 'image', current: true },
];

class Demo extends React.Component {
  renderOverflow = items => {
    // console.log('overflow items: ', items);
    return <Tag>{items.length}</Tag>;
  };
  renderItem = (item, ind) => {
    // console.log('visible item: ', item);
    return (
      <span key={item.key} style={{ marginRight: 8 }}>
        {item.key}
      </span>
    );
  };
  render() {
    return (
      <div style={{ width: '30%' }}>
        <OverflowList
          items={ITEMS}
          overflowRenderer={this.renderOverflow}
          visibleItemRenderer={this.renderItem}
        />
      </div>
    );
  }
}

export const ASimpleOverflowList = () => <Demo />;

ASimpleOverflowList.story = {
  name: 'a simple semi overflow list',
};

class StartCollapse extends React.Component {
  renderOverflow = items => {
    // console.log('overflow items: ', items);
    return <Tag>{items.length}</Tag>;
  };
  renderItem = (item, ind) => {
    // console.log('visible item: ', item);
    return (
      <span key={item.key} style={{ marginRight: 8 }}>
        {item.key}
      </span>
    );
  };
  render() {
    return (
      <div style={{ width: '30%' }}>
        <OverflowList
          items={ITEMS}
          collapseFrom="start"
          overflowRenderer={this.renderOverflow}
          visibleItemRenderer={this.renderItem}
        />
      </div>
    );
  }
}

export const CollapseFromStart = () => <StartCollapse />;

CollapseFromStart.story = {
  name: 'collapse from start',
};

class MinCollapse extends React.Component {
  renderOverflow = items => {
    // console.log('overflow items: ', items);
    return <Tag>{items.length}</Tag>;
  };
  renderItem = (item, ind) => {
    // console.log('visible item: ', item);
    return (
      <span key={item.key} style={{ marginRight: 8 }}>
        {item.key}
      </span>
    );
  };
  render() {
    return (
      <div style={{ width: '30%' }}>
        <OverflowList
          items={ITEMS}
          minVisibleItems={3}
          overflowRenderer={this.renderOverflow}
          visibleItemRenderer={this.renderItem}
          onOverflow={item => console.log(item)}
        />
      </div>
    );
  }
}

export const MinVisibleItems = () => <MinCollapse />;

MinVisibleItems.story = {
  name: 'minVisibleItems',
};

class OverlapDemo extends React.Component {
  renderOverflow = items => {
    return items.map(item => <Tag>{item.length}</Tag>);
  };
  renderItem = (item, ind) => {
    return (
      <div key={item.key} style={{ marginRight: 8 }}>
        {item.key}
      </div>
    );
  };
  render() {
    return (
      <div style={{ width: '40%' }}>
        <OverflowList
          items={ITEMS}
          overflowRenderer={this.renderOverflow}
          visibleItemRenderer={this.renderItem}
          renderMode="scroll"
        />
      </div>
    );
  }
}

export const OverlapOverflowList = () => <OverlapDemo />;

OverlapOverflowList.story = {
  name: 'overlap overflow list',
};

class OverlapDemo2 extends React.Component {
  renderOverflow = items => {
    return items.map(item => <Tag>{item.length}</Tag>);
  };
  renderItem = (item, ind) => {
    return (
      <div key={item.key} style={{ marginRight: 8 }}>
        {item.key}
      </div>
    );
  };
  render() {
    return (
      <div style={{ width: '40%' }}>
        <OverflowList
          items={ITEMS}
          threshold={0.2}
          onIntersect={item => console.log(item)}
          overflowRenderer={this.renderOverflow}
          visibleItemRenderer={this.renderItem}
          renderMode="scroll"
        />
      </div>
    );
  }
}

export const OverlapOverflowThreshold = () => <OverlapDemo2 />;

OverlapOverflowThreshold.story = {
  name: 'overlap overflow threshold',
};

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    age1: 23,
    age2: 11,
    address: [1, 2, 3, 4, 5],
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    age1: 23,
    age2: 11,
    address: [1, 2, 3, 4, 5],
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    age1: 23,
    age2: 11,
    address: [1, 2, 3, 4, 5],
  },
  {
    key: '4',
    name: 'Disabled User',
    age: 99,
    age1: 23,
    age2: 11,
    address: [1, 2, 3, 4, 5],
  },
];

class TableDemo extends React.Component {
  renderOverflow = items => {
    return <Tag>{items.length}</Tag>;
  };
  renderItem = (item, ind) => {
    return (
      <div key={`${ind}-item`} style={{ marginRight: 8 }}>
        {item}
      </div>
    );
  };
  renderColumn(items) {
    return (
      <div
      // style={{ width: '99%' }}
      >
        <OverflowList
          items={items.concat(items)}
          // observeAll={true}
          style={{ width: 88 }}
          overflowRenderer={items => <Tag>{items.length}</Tag>}
          visibleItemRenderer={(item, ind) => (
            <div key={`${ind}-item`} style={{ marginRight: 8 }}>
              {item}
            </div>
          )}
        />
      </div>
    );
    // return (
    //     <div>
    //         <OverflowList
    //             items={items.concat(items)}
    //             style={{ width: 88 }}
    //             overflowRenderer={this.renderOverflow}
    //             visibleItemRenderer={this.renderItem}
    //         />
    //     </div>
    // );
  }
  render() {
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        width: '30%',
      },
      {
        title: 'combine',
        dataIndex: 'test',
        children: [
          {
            title: 'Age',
            children: [
              {
                title: 'Age1',
                dataIndex: 'age1',
              },
              {
                title: 'Age2',
                dataIndex: 'age2',
              },
            ],
          },
          {
            title: 'Key',
            dataIndex: 'key',
          },
        ],
      },
      {
        title: 'Address',
        width: '20%',
        dataIndex: 'address',
        render: item => this.renderColumn(item),
        className: 'table-width-test',
      },
    ];
    return <Table columns={columns} dataSource={data} />;
  }
}

export const OverflowInTable = () => <TableDemo />;

OverflowInTable.story = {
  name: 'overflow in table',
};

const LargeData = () => {
  const [width, setWidth] = useState(100);
  const renderOverflow = items => {
    // console.log('overflow items: ', items);
    return items.length ? <Tag style={{ flex: '0 0 auto' }}>+{items.length}</Tag> : null;
  };
  const renderItem = (item, ind) => {
    // console.log('visible item: ', item);
    return (
      <Tag color="blue" key={item.key} style={{ marginRight: 8, flex: '0 0 auto' }}>
        {item.icon}
        {item.key}
      </Tag>
    );
  };
  const items = [
    { icon: <IconAlarm style={{ marginRight: 4 }} />, key: 'alarm' },
    { icon: <IconBookmark style={{ marginRight: 4 }} />, key: 'bookmark' },
    { icon: <IconCamera style={{ marginRight: 4 }} />, key: 'camera' },
    { icon: <IconDuration style={{ marginRight: 4 }} />, key: 'duration' },
    { icon: <IconEdit style={{ marginRight: 4 }} />, key: 'edit' },
    { icon: <IconFolder style={{ marginRight: 4 }} />, key: 'folder' },
  ];

  return (
    <div>
      <Slider step={1} value={width} onChange={value => setWidth(value)} />
      <br />
      <br />
      <div style={{ width: `${width}%` }}>
        <OverflowList
          items={items}
          minVisibleItems={3}
          overflowRenderer={renderOverflow}
          visibleItemRenderer={renderItem}
        />
      </div>
    </div>
  );
};

// TODO large data will cause memory heap
// stories.add('large amount of data', () => <LargeData />);
