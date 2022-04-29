---
localeCode: zh-CN
order: 38
category: 导航类
title:  Navigation 导航
icon: doc-navigation
width: 650px
dir: column
brief: 为页面和功能提供导航的菜单列表。
---


## 代码演示

### 如何引入

```jsx import
import { Nav } from '@douyinfe/semi-ui';
```

### 基本使用

通过传递 `items` 参数，你能够快速得到一个导航栏。

每个导航项目包括：

-   `itemKey`：导航项目的唯一标识（必须）
-   `text`：导航文案
-   `icon`：导航图标

参数含义详见 [Nav.Item](#Nav.Item) 或 [Nav.Sub](#Nav.Sub)

```jsx live=true dir="column"
import React from 'react';
import { Nav } from '@douyinfe/semi-ui';
import { IconUser, IconStar, IconSetting } from '@douyinfe/semi-icons';

class NavApp extends React.Component {
    render() {
        return (
            <Nav
                bodyStyle={{ height: 320 }}
                items={[
                    { itemKey: 'user', text: '用户管理', icon: <IconUser /> },
                    { itemKey: 'union', text: '公会中心', icon: <IconStar /> },
                    {
                        text: '任务平台',
                        icon: <IconSetting />,
                        itemKey: 'job',
                        items: ['任务管理', '用户任务查询'],
                    },
                ]}
                onSelect={data => console.log('trigger onSelect: ', data)}
                onClick={data => console.log('trigger onClick: ', data)}
            />
        );
    }
}

```


### 导航缩进

版本：>= 0.16.0

> 导航缩进目前仅对第一级导航有效果。

#### 纯文案导航

如果导航项目没有传入 `icon` 字段，那么文案会自动向左填充。

```jsx live=true dir="column"
import React from 'react';
import { Nav } from '@douyinfe/semi-ui';

class NavApp extends React.Component {
    render() {
        return (
            <Nav
                bodyStyle={{ height: 320 }}
                defaultOpenKeys={[ 'job' ]}
                items={[
                    { itemKey: 'user', text: '用户管理' },
                    { itemKey: 'union', text: '公会中心' },
                    {
                        itemKey: 'union-management',
                        text: '公会管理',
                        items: ['公告设置', '公会查询', '信息录入']
                    },
                    {
                        text: '任务平台',
                        itemKey: 'job',
                        items: ['任务管理', '用户任务查询'],
                    },
                ]}
                onSelect={data => console.log('trigger onSelect: ', data)}
                onClick={data => console.log('trigger onClick: ', data)}
            />
        );
    }
}
```

### 定义头部和底部

开发者可能会经常定义 Logo 区域和收起按钮区域，Navigation 则提供了这样的容器方便开发者快速定义导航头部和底部，你仅需按要求传入 header 或 footer 即可。

对于 `footer`，semi-ui 额外封装了一个收起功能按钮，开发者可以通过传递 `collapseButton = true` 开启此功能，不过该参数仅在 `mode = "vertical"` （垂直导航）生效。

参数详见[Nav.Header](#Nav.Header)和[Nav.Footer](#Nav.Footer)。

```jsx live=true dir="column"
import React from 'react';
import { Nav } from '@douyinfe/semi-ui';
import { IconUser, IconStar, IconSetting } from '@douyinfe/semi-icons';

class NavApp extends React.Component {
    render() {
        return (
            <Nav
                defaultOpenKeys={['job']}
                bodyStyle={{ height: 320 }}
                items={[
                    { itemKey: 'user', text: '用户管理', icon: <IconUser /> },
                    { itemKey: 'union', text: '公会中心', icon: <IconStar /> },
                    {
                        text: '任务平台',
                        icon: <IconSetting />,
                        itemKey: 'job',
                        items: ['任务管理', '用户任务查询'],
                    },
                ]}
                onSelect={key => console.log(key)}
                header={{
                    logo: <img src="https://sf6-cdn-tos.douyinstatic.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/webcast_logo.svg" />,
                    text: 'Semi 运营后台'
                }}
                footer={{
                    collapseButton: true,
                }}
            />
        );
    }
}
```

### 导航样式定义

Navigation 目前提供了个两个参数用于定义导航样式：`style` 和 `bodyStyle`，其中 `style` 用于定义导航组件最外层的样式，而 `bodyStyle` 用于定义导航列表的样式。（导航头部和导航底部则都接受各自的 `style` 参数）。

例如你需要一个导航列表可以滚动，导航头部和底部固定的导航组件，可以这么使用：

```jsx live=true dir="column"
import React from 'react';
import { Nav } from '@douyinfe/semi-ui';
import { IconUser, IconStar, IconSetting, IconFolder } from '@douyinfe/semi-icons';

class NavApp extends React.Component {
    render() {
        return (
            <Nav
                style={{ height: 520 }}
                bodyStyle={{ height: 320 }}
                defaultOpenKeys={['job', 'resource']}
                items={[
                    { itemKey: 'user', text: '用户管理', icon: <IconUser /> },
                    { itemKey: 'union', text: '公会中心', icon: <IconStar /> },
                    {
                        text: '任务平台',
                        icon: <IconSetting />,
                        itemKey: 'job',
                        items: ['任务管理', '用户任务查询'],
                    },
                    {
                        text: '资源管理',
                        icon: <IconFolder />,
                        itemKey: 'resource',
                        items: ['转盘配置', '转盘审核'],
                    },
                ]}
                onSelect={key => console.log(key)}
                header={{
                    logo: <img src="https://sf6-cdn-tos.douyinstatic.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/webcast_logo.svg" />,
                    text: 'Semi 运营后台'
                }}
                footer={{
                    collapseButton: true,
                }}
            />
        );
    }
}
```

### JSX 写法

用户可以使用 JSX 写法定义导航头部、导航项以及导航底部。

```jsx live=true dir="column"
import React from 'react';
import { Nav } from '@douyinfe/semi-ui';
import { IconStar, IconUser, IconUserGroup } from '@douyinfe/semi-icons';

class NavApp extends React.Component {
    render() {
        return (
            <Nav
                bodyStyle={{ height: 320 }}
                defaultOpenKeys={['user', 'union']}
                onSelect={data => console.log('trigger onSelect: ', data)}
                onClick={data => console.log('trigger onClick: ', data)}
            >
                <Nav.Header logo={<img src="https://sf6-cdn-tos.douyinstatic.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/webcast_logo.svg" />} text={'Semi 运营后台'} />
                <Nav.Item itemKey={'union'} text={'公会中心'} icon={<IconStar />} />
                <Nav.Sub itemKey={'user'} text="用户管理" icon={<IconUser />}>
                    <Nav.Item itemKey={'golder'} text={'金主管理'} />
                    <Nav.Item itemKey={'ban'} text={'用户封禁'} />
                </Nav.Sub>
                <Nav.Sub itemKey={'union-management'} text="公会管理" icon={<IconUserGroup />}>
                    <Nav.Item itemKey={'notice'} text={'公告设置'} />
                    <Nav.Item itemKey={'query'} text={'公会查询'} />
                    <Nav.Item itemKey={'info'} text={'信息录入'} />
                </Nav.Sub>
                <Nav.Footer collapseButton={true} />
            </Nav>
        );
    }
}

```

### 导航方向

Navigation 目前提供两种方向的导航：

-   垂直方向（默认）
-   水平方向

你可以通过 `mode = "vertical"` （默认）或者 `mode = "horizontal"` 来控制。

特别注意的是，有一些功能（参数）仅在 `mode = "vertical"` 时有效：

-   `isCollapsed` （导航收起到侧边）
-   `defaultOpenKeys` | `openKeys` （指定默认的以及受控的展开子导航项 key 数组，这个参数仅在 `mode = "vertical"` 且 `isCollapsed = false` 有效）
-   `Footer` 组件的 `collapseButton` 收起侧边栏功能按钮

#### 竖直方向

```jsx live=true dir="column"
import React from 'react';
import { Nav } from '@douyinfe/semi-ui';
import { IconStar, IconUser, IconUserGroup, IconSetting } from '@douyinfe/semi-icons';

class NavApp extends React.Component {
    render() {
        return (
            <div style={{ width: '100%' }}>
                <Nav
                    bodyStyle={{ height: 320 }}
                    items={[
                        { itemKey: 'user', text: '用户管理', icon: <IconUser /> },
                        { itemKey: 'union', text: '公会中心', icon: <IconStar /> },
                        {
                            itemKey: 'union-management',
                            text: '公会管理',
                            icon: <IconUserGroup />,
                            items: ['公告设置', '公会查询', '信息录入']
                        },
                        {
                            text: '任务平台',
                            icon: <IconSetting />,
                            itemKey: 'job',
                            items: ['任务管理', '用户任务查询'],
                        },
                    ]}
                    onSelect={key => console.log(key)}
                    header={{
                        logo: <img src="https://sf6-cdn-tos.douyinstatic.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/webcast_logo.svg" />,
                        text: 'Semi 运营后台'
                    }}
                    footer={{
                        collapseButton: true,
                    }}
                />
            </div>
        );
    }
}
```

#### 水平方向

```jsx live=true dir="column"
import React from 'react';
import { Nav, Avatar, Dropdown } from '@douyinfe/semi-ui';
import { IconStar, IconUser, IconUserGroup, IconSetting, IconEdit } from '@douyinfe/semi-icons';

class NavApp extends React.Component {
    render() {
        return (
            <div style={{ width: '100%' }}>
                <Nav
                    mode={'horizontal'}
                    items={[
                        { itemKey: 'user', text: '用户管理', icon: <IconUser /> },
                        { itemKey: 'union', text: '公会中心', icon: <IconStar /> },
                        {
                            itemKey: 'approve-management',
                            text: '审批管理',
                            icon: <IconEdit />,
                            items: [
                                '入驻审核',
                                {
                                    itemKey: 'operation-management',
                                    text: '运营管理',
                                    items: [
                                        '人员管理',
                                        '人员变更'
                                    ]
                                }
                            ]
                        },
                        {
                            text: '任务平台',
                            icon: <IconSetting />,
                            itemKey: 'job',
                            items: ['任务管理', '用户任务查询'],
                        },
                    ]}
                    onSelect={key => console.log(key)}
                    header={{
                        logo: <img src="https://sf6-cdn-tos.douyinstatic.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/webcast_logo.svg" />,
                        text: 'Semi 运营后台'
                    }}
                    footer={
                        <Dropdown
                            position="bottomRight"
                            render={
                                <Dropdown.Menu>
                                    <Dropdown.Item>详情</Dropdown.Item>
                                    <Dropdown.Item>退出</Dropdown.Item>
                                </Dropdown.Menu>
                            }
                        >
                            <Avatar size="small" color='light-blue' style={{margin: 4}}>BD</Avatar>
                            <span>Bytedancer</span>
                        </Dropdown>
                    }
                />
            </div>
        );
    }
}
```

#### 水平加垂直

一般的平台设计会采取水平加垂直导航的模式，这里有一个比较常见的例子。

```jsx live=true dir="column"
import React from 'react';
import { Nav, Avatar, Dropdown, Select, Button } from '@douyinfe/semi-ui';
import { IconStar, IconUser, IconUserGroup, IconSetting, IconEdit, IconLanguage } from '@douyinfe/semi-icons';

class NavApp extends React.Component {
    constructor() {
        this.items = [
            { itemKey: 'user', text: '用户管理', icon: <IconUser /> },
            { itemKey: 'union', text: '公会中心', icon: <IconStar /> },
            {
                itemKey: 'union-management',
                text: '公会管理',
                icon: <IconUserGroup />,
                items: ['公告设置', '公会查询', '信息录入']
            },
            {
                itemKey: 'approve-management',
                text: '审批管理',
                icon: <IconEdit />,
                items: [
                    '入驻审核',
                    {
                        itemKey: 'operation-management',
                        text: '运营管理',
                        items: [
                            '人员管理',
                            '人员变更'
                        ]
                    }
                ]
            },
            {
                text: '任务平台',
                icon: <IconSetting />,
                itemKey: 'job',
                items: ['任务管理', '用户任务查询'],
            },
        ];

        this.renderHorizontal = this.renderHorizontal.bind(this);
        this.renderVertical = this.renderVertical.bind(this);
    }

    renderHorizontal() {
        return (
            <Nav
                mode={'horizontal'}
                onSelect={key => console.log(key)}
                header={{
                    logo: <img src="https://sf6-cdn-tos.douyinstatic.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/webcast_logo.svg" />,
                    text: 'Semi 运营后台'
                }}
                footer={
                    <>
                        <Select defaultValue='Chinese' style={{ width: 120, marginRight: 10 }} insetLabel={<IconLanguage />}>
                            <Select.Option value='Chinese'>中文</Select.Option>
                            <Select.Option value='English'>English</Select.Option>
                            <Select.Option value='Korean'>한국어</Select.Option>
                            <Select.Option value='Japanese'>日本語</Select.Option>
                        </Select>
                        <Button style={{ marginRight: 10 }}>切换至海外版</Button>
                        <Dropdown
                            position="bottomRight"
                            render={
                                <Dropdown.Menu>
                                    <Dropdown.Item>详情</Dropdown.Item>
                                    <Dropdown.Item>退出</Dropdown.Item>
                                </Dropdown.Menu>
                            }
                        >
                            <Avatar size="small" color='light-blue' style={{margin: 4}}>BD</Avatar>
                            <span>Bytedancer</span>
                        </Dropdown>
                    </>
                }
            />
        );
    }

    renderVertical() {
        return (
            <Nav
                bodyStyle={{ height: 320 }}
                items={this.items}
                onSelect={key => console.log(key)}
                footer={{
                    collapseButton: true,
                }}
            />
        );
    }

    render() {
        return (
            <>
                {this.renderHorizontal()}
                {this.renderVertical()}
            </>
        );
    }
}
```

### 展开收起箭头位置

`toggleIconPosition` 设置 'left' 或 'right', 默认 right

```jsx live=true dir=column
import React from 'react';
import { Nav } from '@douyinfe/semi-ui';
import { IconUser, IconStar, IconSetting } from '@douyinfe/semi-icons';

class NavApp extends React.Component {
    render() {
        return (
            <Nav
                toggleIconPosition={'left'}
                defaultOpenKeys={['job']}
                bodyStyle={{ height: 320 }}
                items={[
                    { itemKey: 'user', text: '用户管理', icon: <IconUser /> },
                    { itemKey: 'union', text: '公会中心', icon: <IconStar /> },
                    {
                        text: '任务平台',
                        icon: <IconSetting />,
                        itemKey: 'job',
                        items: ['任务管理', '用户任务查询'],
                    },
                ]}
                onSelect={key => console.log(key)}
                header={{
                    logo: <img src="https://sf6-cdn-tos.douyinstatic.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/webcast_logo.svg" />,
                    text: 'Semi 运营后台'
                }}
                footer={{
                    collapseButton: true,
                }}
            />
        );
    }
}
```

### 缩进限制
默认无缩进，需要导航项依据层级缩进请将 limitIndent 设置为 false

React Jsx 方式用 Nav.Item 传入导航项时 请手动给 Nav.Item 传入 `level` props。

Object 方式 传入导航项时 无需关心 level

limitIndent 只在 竖直方向生效

```jsx live=true dir=column
import React from 'react';
import { Nav } from '@douyinfe/semi-ui';
import { IconUser, IconStar, IconSetting } from '@douyinfe/semi-icons';

class NavApp extends React.Component {
    render() {
        return (
            <Nav
                limitIndent={false}
                defaultOpenKeys={['job']}
                bodyStyle={{ height: 320 }}
                items={[
                    { itemKey: 'user', text: '用户管理', icon: <IconUser /> },
                    {
                        text: '任务平台',
                        icon: <IconSetting />,
                        itemKey: 'job',
                        items: ['任务管理', {
                            text: '任务1',
                            icon: <IconSetting />,
                            itemKey: 'mission1',
                            items: ['任务2',{
                                text: '任务3拆解',
                                icon: <IconSetting />,
                                itemKey: 'mission3',
                                items: ['子任务1', '子任务2'],
                            }, ],
                        },],
                    },
                ]}
                onSelect={key => console.log(key)}
                header={{
                    logo: <img src="https://sf6-cdn-tos.douyinstatic.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/webcast_logo.svg" />,
                    text: 'Semi 运营后台'
                }}
                footer={{
                    collapseButton: true,
                }}
            />
        );
    }
}
```


### 非受控属性

包括：

-   `defaultSelectedKeys`（默认被选中的导航项 `key` 数组）
-   `defaultOpenKeys`（默认展开的导航项 `key` 数组，仅 `mode = "vertical"` 且 `isCollapsed` | `defaultIsCollapsed = false` 的情况下有效）
-   `defaultIsCollapsed`（侧边栏默认是否收起，仅 `mode = "vertical"` 时有效）

```jsx live=true dir="column"
import React from 'react';
import { Nav } from '@douyinfe/semi-ui';
import { IconUser, IconStar, IconUserGroup, IconSetting } from '@douyinfe/semi-icons';

class NavApp extends React.Component {
    render() {
        return (
            <Nav
                defaultOpenKeys={['job']}
                defaultSelectedKeys={['信息录入']}
                defaultIsCollapsed={true}
                bodyStyle={{ height: 320 }}
                items={[
                    { itemKey: 'user', text: '用户管理', icon: <IconUser /> },
                    { itemKey: 'union', text: '公会中心', icon: <IconStar /> },
                    {
                        itemKey: 'union-management',
                        text: '公会管理',
                        icon: <IconUserGroup />,
                        items: ['公告设置', '公会查询', '信息录入']
                    },
                    {
                        text: '任务平台',
                        icon: <IconSetting />,
                        itemKey: 'job',
                        items: ['任务管理', '用户任务查询'],
                    },
                ]}
                header={{
                    logo: <img src="https://sf6-cdn-tos.douyinstatic.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/webcast_logo.svg" />,
                    text: 'Semi 运营后台'
                }}
                footer={{
                    collapseButton: true
                }}
            />
        );
    }
}

```

### 受控属性

Navigation 组件提供了几个受控属性，配合各种回调，可以很轻松地控制导航。

目前受控的属性为：

-   `isCollapsed`（侧边栏是否收起，仅 `mode =" vertical"` 时生效）
-   `selectedKeys`（当前选中的导航项 `key` 数组）
-   `openKeys` （当前展开的导航项数组，仅 `mode = "vertical"` 且 `isCollapsed = false` 有效）

对应的回调为：

-   `onCollapseChange(isCollapsed: boolean): void`
-   `onSelect({ itemKey: string, selectedKeys: string[], domEvent: MouseEvent, isOpen: boolean }): void`
-   `onOpenChange({ itemKey: string, openKeys: string[], domEvent: MouseEvent, isOpen: boolean }): void`

```jsx live=true dir="column"
import React, { useMemo, useState } from 'react';
import { Nav } from '@douyinfe/semi-ui';
import { IconUser, IconStar, IconUserGroup, IconSetting } from '@douyinfe/semi-icons';

function NavApp (props = {}) {
    const [openKeys, setOpenKeys] = useState(['union-management', 'job']);
    const [selectedKeys, setSelectedKeys] = useState(['用户任务查询']);
    const [isCollapsed, setIsCollapsed] = useState(true);

    const onSelect = data => {
        console.log('trigger onSelect: ', data);
        setSelectedKeys([...data.selectedKeys]);
    };
    const onOpenChange = data => {
        console.log('trigger onOpenChange: ', data);
        setOpenKeys([...data.openKeys]);
    };

    const onCollapseChange = isCollapsed => {
        setIsCollapsed(isCollapsed);
    };

    const items = useMemo(() => [
        { itemKey: 'user', text: '用户管理', icon: <IconUser /> },
        { itemKey: 'union', text: '公会中心', icon: <IconStar /> },
        {
            itemKey: 'union-management',
            text: '公会管理',
            icon: <IconUserGroup />,
            items: ['公告设置', '公会查询', '信息录入']
        },
        {
            text: '任务平台',
            icon: <IconSetting />,
            itemKey: 'job',
            items: ['任务管理', '用户任务查询'],
        },
    ], []);

    return (
        <Nav
            isCollapsed={isCollapsed}
            openKeys={openKeys}
            selectedKeys={selectedKeys}
            bodyStyle={{ height: 360 }}
            items={items}
            header={{
                logo: <img src="https://sf6-cdn-tos.douyinstatic.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/webcast_logo.svg" />,
                text: 'Semi 运营后台'
            }}
            footer={{
                collapseButton: true
            }}
            onCollapseChange={onCollapseChange}
            onOpenChange={onOpenChange}
            onSelect={onSelect}
        />
    );
}
```

## API 参考

### Nav

| 属性                | 类型                                                                                                                             | 描述                                                                                                                           | 默认值     |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ---------- |
| bodyStyle           | 导航项列表的自定义样式                                                                             | object                                                                                                                           |           |
| className           | 最外层元素的样式名                                                                               | boolean                                                                                                                          |           |
| defaultIsCollapsed  | 默认是否处于收起状态，仅 `mode = "vertical"` 时有效                                                    | boolean                                                                                                                          | false     |
| defaultOpenKeys     | 初始打开的子导航 `itemKey` 数组，仅 `mode = "vertical"` 且侧边栏处于展开状态时有效                               | string[]                                                                                                                         | []        |
| defaultSelectedKeys | 初始选中的导航项 `itemKey` 数组                                                                   | string[]                                                                                                                         | []        |
| footer              | 底部区域配置对象或元素，详见 [Nav.Footer](#Nav.Footer)                                                | object\| ReactNode |                      |
| header              | 头部区域配置对象或元素，详见 [Nav.Header](#Nav.Header)                                                | object\| ReactNode |                      |
| isCollapsed         | 是否处于收起状态的受控属性，仅 `mode = "vertical"` 时有效                                                 | boolean                                                                                                                          |           |
| items               | 导航项目列表，每一项可以继续带有 items 属性。如果为 string 数组，则会取每一项作为 text 和 itemKey                         | object\| string[] \| [Item](#Nav.Item)[] \| [Sub](#Nav.Sub)[] |  |
| limitIndent         | 解除缩进限制，可使用 level 自定义导航项缩进，水平模式只能为true >=1.27.0                                          | boolean                                                                                                                          | true      |
| mode                | 导航类型，目前支持横向与竖直，可选值：`vertical`\                                                          | `horizontal`                                                                                                                     | string    | `vertical`           |
| openKeys            | 受控的打开的子导航 `itemKey` 数组，配合 `onOpenChange` 回调控制子导航项展开，仅 `mode = "vertical"` 且侧边栏处于展开状态时有效 | string[]                                                                                                                         |           |
| prefixCls           | 类名前缀                                                                                    | string                                                                                                                           | `semi`    |
| selectedKeys        | 受控的导航项 `itemKey` 数组，配合 `onSelect` 回调控制导航项选择                                             | string[]                                                                                                                         |           |
| style               | 最外层元素的自定义样式                                                                             |         CSSProperties                                                                                                                         |           |
| subNavCloseDelay    | 子导航浮层关闭的延迟。collapse 为 true 或 mode 为 "horizontal" 时有效，单位为 ms                             | number                                                                                                                           | 100       |
| subNavMotion        | 子导航折叠动画                                                                                 | boolean                                                                                                                          | true      |
| subNavOpenDelay     | 子导航浮层显示的延迟。collapse 为 true 或 mode 为 "horizontal" 时有效，单位为 ms                             | number                                                                                                                           | 0         |
| toggleIconPosition  | 带有子导航项的的父级导航项箭头位置 >=1.27.0                                                              | 'left' \| 'right'   | 'right'              |
| tooltipHideDelay    | tooltip 隐藏的延迟，collapse 为 true 时有效，单位为 ms                                                | number                                                                                                                           | 100       |
| tooltipShowDelay    | tooltip 显示的延迟，collapse 为 true 时有效，单位为 ms                                                | number                                                                                                                           | 0         |
| onClick             | 点击任意导航项时触发                                                                              | ({ itemKey: string, domEvent: MouseEvent, isOpen: boolean }) => {}                                                               | () => {}  |
| onCollapseChange    | 收起状态变化时的回调                                                                              | (isCollapsed: boolean) => {}                                                                                                     | () => {}  |
| onOpenChange        | 切换某个子导航项目显隐状态时触发                                                                        | ({ itemKey: string, openKeys: string[], domEvent: MouseEvent, isOpen: boolean }) => {}                                           | () => {}  |
| onSelect            | 第一次选中某个可选中导航项目时触发，其中 selectedItems 这个字段版本 >= 0.17.0 后才支持 | ({ itemKey: string, selectedKeys: string[], selectedItems: [Item](#Nav.Item)[], domEvent: MouseEvent, isOpen: boolean }) => {} | () => {}  |

### Nav.Item

| 属性        | 描述                                               | 类型              | 默认值 | 版本          |
|-------------|--------------------------------------------------|-------------------|--------|---------------|
| disabled    | 是否禁用                                           | boolean | false     | 1.17.0              |
| icon        | 导航项目图标                             | ReactNode |      |               |
| indent      | 如果 icon 为空，是否保留其占位，仅对一级导航生效       | boolean           | false  |               |
| itemKey     | 导航项目唯一 key                                   | string            | ""     |               |
| level       | 当前项所在嵌套层级，limitIndent 为 true时，用于自定义缩进位置| number | | 1.27.0 | 
| link        | 导航项 href 链接，传入时导航项整体会包裹一个 a 标签 | string            | -      | 1.0.0 |
| linkOptions | 透传给 a 标签的参数                                | object            | -      | 1.0.0 |
| text        | 导航项目文案或元素                                 | string\|ReactNode | ""     |               |
| onClick     | 点击任意导航项时触发 |function({ itemKey: string, domEvent: MouseEvent, isOpen: boolean }) |  () => {}   | 
| onMouseEnter| mouse enter 时触发 |function(e) => {} | () => {}   | 
| onMouseLeave| mouse leave 时触发 |function(e) => {} | () => {}   | 

### Nav.Sub

| 属性    | 描述                           | 类型              | 默认值 |
| ------- | ------------------------------ | ----------------- | ------ |
| disabled    | 是否禁用                                           | boolean | false     | 1.17.0             |
| dropdownStyle | 弹出层的 style                                           | CSSProperties |     |              |
| icon    | 导航项目图标       | ReactNode |      |
| indent  | 如果 icon 为空，是否保留其占位，仅对一级导航生效 | boolean           | false  |
| isCollapsed         |  是否处于收起状态的受控属性，仅 `mode = "vertical"`      | boolean  |    false        |
| isOpen         |  是否打开      | boolean  |    false        |
| itemKey | 导航项目唯一 key               | string            | ""     |
| level       | 当前项所在嵌套层级，limitIndent 为 true时，用于自定义缩进位置| number | 0 | 1.27.0 |
| maxHeight       | 最大高度 | number | 999 |
| text    | 导航项目文案或组件             | string\|ReactNode | ""     |
| onMouseEnter| mouse enter 时触发 |function(e) => {} | () => {}   | 
| onMouseLeave| mouse leave 时触发 |function(e) => {} | () => {}   | 

### Nav.Header

| 属性        | 描述                                               | 类型              | 默认值 | 版本          |
|-------------|--------------------------------------------------|-------------------|--------|---------------|
| children    | 子元素                                             | ReactNode         |        |               |
| className   | 最外层样式名                                       | string            |        |               |
| link        | 导航项 href 链接，传入时导航项整体会包裹一个 a 标签 | string            | -      | 1.0.0 |
| linkOptions | 透传给 a 标签的参数                                | object            | -      | 1.0.0 |
| logo        | Logo                         | ReactNode |        |               |
| style       | 最外层样式                                         | CSSProperties            |        |               |
| text        | Logo 文案                       | ReactNode |        |               |

### Nav.Footer

| 属性           | 描述                                                                                     | 类型                                      | 默认值 | 版本           |
| -------------- | ---------------------------------------------------------------------------------------- | ----------------------------------------- | ------ | -------------- |
| children       | 子元素                                                                                   | ReactNode                                 |        |                |
| className      | 最外层样式名                                                                             | string                                    |        |                |
| collapseButton | 是否展示底部“收起侧边栏”按钮，mode="vertical" 且 Footer 组件的 children 参数为空才有效果 | boolean\|ReactNode                        | false  |                |
| collapseText   | “收起”按钮的文案                                                                         | (collapsed:boolean) => string\|ReactNode |        | 0.35.0 |
| style          | 最外层样式                                                                               | CSSProperties                                    |        |                |

## 设计变量
<DesignToken/>

<!-- ## 相关物料
```material
2, 43, 312
``` -->

## FAQ

-   **导航动画丢失？**  
    在使用函数式组件时，应该用 useState 或者 useMemo 包裹一下 items，原因是 items 直接传一个数组会触发组件重新渲染。

-   **当子菜单高度超过999px，部分导航消失？**
    请查看 [此 issue](https://github.com/DouyinFE/semi-design/issues/563)
