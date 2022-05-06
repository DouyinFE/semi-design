---
localeCode: en-US
order: 38
category: Navigation
title:  Navigation
subTitle: Navigation
icon: doc-navigation
width: 650px
dir: column
brief: A menu list that provides navigation for pages and features.
---

## Demos

### How to import

```jsx
import { Nav } from '@douyinfe/semi-ui';
```
### Basic Usage

By passing `items` Parameters, you can quickly get a navigation bar.

Each navigation item includes:

-   `itemKey`: The unique identity of the navigation project (must)
-   `text`: Navigation copywriting
-   `icon`: Navigation icon

For the meaning of the parameters, see [Nav.Item](#Nav.Item) Or [Nav.Sub](#Nav.Sub)

```jsx live=true dir="column"
import React from 'react';
import { Nav } from '@douyinfe/semi-ui';
import { IconUser, IconStar, IconSetting } from '@douyinfe/semi-icons';

class NavApp extends React.Component {
    render() {
        return (
            <Nav
                Body Style={{ height: 320 }}
                items={[
                    { itemKey: 'user', text: 'User Management', icon: <IconUser /> },
                    { itemKey: 'union', text: 'Union Center', icon: <IconStar /> },
                    {
                        text: 'Task Platform',
                        icon: <IconSetting />,
                        itemKey: 'job',
                        items: ['Task Management', 'User Task Query'],
                    },
                ]}
                onSelect={data => console.log('trigger onSelect: ', data)}
                onClick={data => console.log('trigger onClick: ', data)}
            />
        );
    }
}
```

### Navigation Indentation

**Version: >= 0.16.0**

> Navigation indentation is currently effective only for first-level navigation.

#### Pure Copywriting Navigation

If the navigation project doesn't come in, `icon` field, then the copy will be automatically filled to the left.

```jsx live=true dir="column"
import React from 'react';
import { Nav } from '@douyinfe/semi-ui';

class NavApp extends React.Component {
    render() {
        return (
            <Nav
                bodyStyle={{ height: 320 }}
                defaultOpenKeys={[ 'task' ]}
                items={[
                    { itemKey: 'user', text: 'User Management' },
                    { itemKey: 'union', text: 'User Center' },
                    {
                        itemKey: 'union-management',
                        text: 'Union Management',
                        items: ['Announcement Settings', 'Union Inquiries', 'Entry information']
                    },
                    {
                        text: 'Task Platform',
                        itemKey: 'task',
                        items: ['Task Management', 'User Task Inquiries'],
                    },
                ]}
                onSelect={data => console.log('trigger onSelect: ', data)}
                onClick={data => console.log('trigger onClick: ', data)}
            />
        );
    }
}
```

### Define The Head And Bottom

Developers may often define the Logo area and the put away button area, while Navigation provides such a container for developers to quickly define the navigation head and bottom, and you only need to pass in the header or Footer as required.

For `footer`, semi-ui extra encapsulates a pull-up feature button that developers can pass through `collapseButton = true` to turn on the function, but the parameter takes effect only with `mode = "vertical"` (Vertical navigation).

For the parameters, see [Nav.Header](#Nav.Header) and [Nav.Footer](#Nav.Footer).

```jsx live=true dir="column"
import React from 'react';
import { Nav } from '@douyinfe/semi-ui';
import { IconUser, IconStar, IconSetting } from '@douyinfe/semi-icons';

class NavApp extends React.Component {
    render() {
        return (
            <Nav
                defaultOpenKeys={['task']}
                bodyStyle={{ height: 320 }}
                items={[
                    { itemKey: 'user', text: 'User Management', icon: <IconUser /> },
                    { itemKey: 'union', text: 'Union Center', icon: <IconStar /> },
                    {
                        text: 'Task Platform',
                        icon: <IconSetting />,
                        itemKey: 'task',
                        items: ['Task Management', 'User Task Query'],
                    },
                ]}
                onSelect={key => console.log(key)}
                header={{
                    logo: <img src="https://sf6-cdn-tos.douyinstatic.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/webcast_logo.svg" />,
                    text: 'Live Platform'
                }}
                footer={{
                    collapseButton: true,
                }}
            />
        );
    }
}
```

### Navigation Style Definition

Navigation currently provides two parameters to define navigation styles:`style` and `bodyStyle`, in which `style` The style used to define the outermost layer of the navigation component, while `bodyStyle` The style used to define the navigation list. (Both the navigation head and the bottom of the navigation accept their respective `style` Parameters).

For example, you need a navigation list to scroll, navigate the head and bottom fixed navigation components, which can be used this way:

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
                    { itemKey: 'user', text: 'User Management', icon: <IconUser /> },
                    { itemKey: 'union', text: 'Union Center', icon: <IconStar /> },
                    {
                        text: 'Task Platform',
                        icon: <IconSetting />,
                        itemKey: 'job',
                        items: ['Task Management', 'User Task Query'],
                    },
                    {
                        text: 'Resource Management',
                        icon: <IconFolder />,
                        itemKey: 'resource',
                        items: ['Turntable Configuration', 'Turntable Review'],
                    },
                ]}
                onSelect={key => console.log(key)}
                header={{
                    logo: <img src="https://sf6-cdn-tos.douyinstatic.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/webcast_logo.svg" />,
                    text: 'Live Platform'
                }}
                footer={{
                    collapseButton: true,
                }}
            />
        );
    }
}
```

### JSX Writing

Users can use JSX to define navigation headers, navigation items, and navigation bottoms.

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
                <Nav.Header logo={<img src="https://sf6-cdn-tos.douyinstatic.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/webcast_logo.svg" />} text={'Live Platform'} />
                <Nav.Item itemKey={'union'} text={'Union Center'} icon={<IconStar />} />
                <Nav.Sub itemKey={'user'} text="User Management" icon={<IconUser />}>
                    <Nav.Item itemKey={'golder'} text={'Gold Master Management'} />
                    <Nav.Item itemKey={'ban'} text={'User Ban'} />
                </Nav.Sub>
                <Nav.Sub itemKey={'union-management'} text="Union Management" icon={<IconUserGroup />}>
                    <Nav.Item itemKey={'notice'} text={'Announcement Settings'} />
                    <Nav.Item itemKey={'query'} text={'Union Query'} />
                    <Nav.Item itemKey={'info'} text={'Entry Information'} />
                </Nav.Sub>
                <Nav.Footer collapseButton={true} />
            </Nav>
        );
    }
}

```

### Navigation Direction

Navigation currently offers navigation in two directions:

-   Vertical (default)
-   Horizontal

You can pass `mode = "vertical"` (default) or `mode = "horizontal"` to control.

In particular, there are some functions (parameters) only in `mode = "vertical"` effective:

-   `isCollapsed` (Navigation put away to the side)
-   `defaultOpenKeys` | `openKeys` (Specifies the default and controlled array of expanded subnavigation items key, which is valid only in `mode = "vertical"`and `isCollapsed = false`)
-   `collapseButton` of `Footer`

#### Vertical Direction

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
                        { itemKey: 'user', text: 'User Management', icon: <IconUser /> },
                        { itemKey: 'union', text: 'Union Center', icon: <IconStar /> },
                        {
                            itemKey: 'union-management',
                            text: 'Union Management',
                            icon: <IconUserGroup />,
                            items: ['Announcement Settings', 'Union Query', 'Entry Information']
                        },
                        {
                            text: 'Task Platform',
                            icon: <IconSetting />,
                            itemKey: 'job',
                            items: ['Task Management', 'User Task Query'],
                        },
                    ]}
                    onSelect={key => console.log(key)}
                    header={{
                        logo: <img src="https://sf6-cdn-tos.douyinstatic.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/webcast_logo.svg" />,
                        text: 'Live Platform'
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

#### Horizontal Direction

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
                        { itemKey: 'user', text: 'User Management', icon: <IconUser /> },
                        { itemKey: 'union', text: 'Union Center', icon: <IconStar /> },
                        {
                            itemKey: 'approve-management',
                            text: 'Approval Management',
                            icon: <IconEdit />,
                            items: [
                                'Check-in Review',
                                {
                                    itemKey: 'operation-management',
                                    text: 'Operations Management',
                                    items: [
                                        'Personnel Management',
                                        'Personnel Change'
                                    ]
                                }
                            ]
                        },
                        {
                            text: 'Task Platform',
                            icon: <IconSetting />,
                            itemKey: 'job',
                            items: ['Task Management', 'User Task Query'],
                        },
                    ]}
                    onSelect={key => console.log(key)}
                    header={{
                        logo: <img src="https://sf6-cdn-tos.douyinstatic.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/webcast_logo.svg" />,
                        text: 'Live Platform'
                    }}
                    footer={
                        <Dropdown
                            position="bottomRight"
                            render={
                                <Dropdown.Menu>
                                    <Dropdown.Item>Detail</Dropdown.Item>
                                    <Dropdown.Item>Quit</Dropdown.Item>
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

#### Horizontal Plus Vertical

The general platform design will adopt the mode of horizontal and vertical navigation. Here is a common example.

```jsx live=true dir="column"
import React from 'react';
import { Nav, Avatar, Dropdown, Select, Button } from '@douyinfe/semi-ui';
import { IconStar, IconUser, IconUserGroup, IconSetting, IconEdit, IconLanguage } from '@douyinfe/semi-icons';

class NavApp extends React.Component {
    constructor() {
        this.items = [
            { itemKey: 'user', text: 'User Management', icon: <IconUser /> },
            { itemKey: 'union', text: 'Union Center', icon: <IconStar /> },
            {
                itemKey: 'union-management',
                text: 'Union Management',
                icon: <IconUserGroup />,
                items: ['Announcement Settings', 'Union Query', 'Entry Information']
            },
            {
                itemKey: 'approve-management',
                text: 'Approval Management',
                icon: <IconEdit />,
                items: [
                    'Check-in Review',
                    {
                        itemKey: 'operation-management',
                        text: 'Operations Management',
                        items: [
                            'Personnel Management',
                            'Personnel Change'
                        ]
                    }
                ]
            },
            {
                text: 'Task Platform',
                icon: <IconSetting />,
                itemKey: 'job',
                items: ['Task Management', 'User Task Query'],
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
                    text: 'Live Platform'
                }}
                footer={
                    <>
                        <Select defaultValue='English' style={{ width: 120, marginRight: 10 }} insetLabel={<IconLanguage />}>
                            <Select.Option value='Chinese'>中文</Select.Option>
                            <Select.Option value='English'>English</Select.Option>
                            <Select.Option value='Korean'>한국어</Select.Option>
                            <Select.Option value='Japanese'>日本語</Select.Option>
                        </Select>
                        <Button style={{ marginRight: 10 }}>Switch to Overseas Version</Button>
                        <Dropdown
                            position="bottomRight"
                            render={
                                <Dropdown.Menu>
                                    <Dropdown.Item>Detail</Dropdown.Item>
                                    <Dropdown.Item>Quit</Dropdown.Item>
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

### Expand and collapse arrow position

`toggleIconPosition` set 'left' or 'right', default right

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
                    {itemKey:'user', text:'User Management', icon: <IconUser /> },
                    {itemKey:'union', text:'guild center', icon: <IconStar /> },
                    {
                        text:'Task platform',
                        icon: <IconSetting />,
                        itemKey:'job',
                        items: ['task management','user task query'],
                    },
                ]}
                onSelect={key => console.log(key)}
                header={{
                    logo: <img src="https://sf6-cdn-tos.douyinstatic.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/webcast_logo.svg" />,
                    text:'Live broadcast operation background'
                }}
                footer={{
                    collapseButton: true,
                }}
            />
        );
    }
}
```

### Indentation limit
No indentation by default. If you need to indent the navigation items according to the level, please set limitIndent to false

When using Nav.Item to pass navigation items in React Jsx mode, please pass level props to Nav.Item manually.

Object method No need to care about level when passing in navigation items.

limitIndent only takes effect in the vertical direction.

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
                    {itemKey:'user', text:'User Management', icon: <IconUser /> },
                    {
                        text:'Task platform',
                        icon: <IconSetting />,
                        itemKey:'job',
                        items: ['Task Management', {
                            text:'Task 1',
                            icon: <IconSetting />,
                            itemKey:'mission1',
                            items: ['Task 2',{
                                text:'Task 3 disassembly',
                                icon: <IconSetting />,
                                itemKey:'mission3',
                                items: ['Subtask 1','Subtask 2'],
                            }, ],
                        },],
                    },
                ]}
                onSelect={key => console.log(key)}
                header={{
                    logo: <img src="https://sf6-cdn-tos.douyinstatic.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/webcast_logo.svg" />,
                    text:'Live broadcast operation background'
                }}
                footer={{
                    collapseButton: true,
                }}
            />
        );
    }
}
```


### Uncontrolled Properties

Including:

-   `defaultSelectedKeys` (default selected navigation item `key` array)
-   `defaultOpenKeys` (default expanded navigation item `key` array, valid only with `mode = "vertical"` and `isCollapsed = false` | `defaultIsCollapsed = false`)
-   `defaultIsCollapsed` (whether the sidebar is closed by default, valid only when `mode = "vertical"`)

```jsx live=true dir="column"
import React from 'react';
import { Nav } from '@douyinfe/semi-ui';
import { IconUser, IconStar, IconUserGroup, IconSetting } from '@douyinfe/semi-icons';

class NavApp extends React.Component {
    render() {
        return (
            <Nav
                defaultOpenKeys={['job']}
                defaultSelectedKeys={['Entry Information']}
                defaultIsCollapsed={true}
                bodyStyle={{ height: 320 }}
                items={[
                    { itemKey: 'user', text: 'User Management', icon: <IconUser /> },
                    { itemKey: 'union', text: 'Union Center', icon: <IconStar /> },
                    {
                        itemKey: 'union-management',
                        text: 'Union Management',
                        icon: <IconUserGroup />,
                        items: ['Announcement Settings', 'Union Query', 'Entry Information']
                    },
                    {
                        text: 'Task Platform',
                        icon: <IconSetting />,
                        itemKey: 'job',
                        items: ['Task Management', 'User Task Query'],
                    },
                ]}
                header={{
                    logo: <img src="https://sf6-cdn-tos.douyinstatic.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/webcast_logo.svg" />,
                    text: 'Live Platform'
                }}
                footer={{
                    collapseButton: true
                }}
            />
        );
    }
}

```

### Controlled Properties

The Navigation component provides several controlled properties that, combined with a variety of callbacks, can easily control navigation.

The properties currently controlled are:

-   `isCollapsed`(whether the sidebar is closed, effective only when `mode="vertical"`)
-   `selectedKeys` (currently selected navigation item `key` array)
-   `openKeys` (currently expanded array of navigation items, only `mode="vertical"` and `isCollapsed=false` valid)

The corresponding callback is:

-   `onCollapseChange(isCollapsed: boolean) => void`
-   `onSelect ({ itemKey: string, selectedKeys: string[], domEvent: MouseEvent, isOpen: boolean }) => void`
-   `onOpenChange ({ itemKey: string, openKeys: string[], domEvent: MouseEvent, isOpen: boolean }) => void`

```jsx live=true dir="column"
import React, { useMemo } from 'react';
import { Nav } from '@douyinfe/semi-ui';
import { IconUser, IconStar, IconUserGroup, IconSetting } from '@douyinfe/semi-icons';

function NavApp (props = {}) {
    const [openKeys, setOpenKeys] = useState(['union-management', 'job']);
    const [selectedKeys, setSelectedKeys] = useState(['User Task Query']);
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
        { itemKey: 'user', text: 'User Management', icon: <IconUser /> },
        { itemKey: 'union', text: 'Union Center', icon: <IconStar /> },
        {
            itemKey: 'union-management',
            text: 'Union Management',
            icon: <IconUserGroup />,
            items: ['Announcement Settings', 'Union Query', 'Entry Information']
        },
        {
            text: 'Task Platform',
            icon: <IconSetting />,
            itemKey: 'job',
            items: ['Task Management', 'User Task Query'],
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
                text: 'Live Platform'
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

## API Reference

### Nav

| Properties          | Type                                                                                                                                                                                       | Description                                                                                                                      | Default    |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| bodyStyle           | Custom style for navigation item list                                                                                                                                                      | object                                                                                                                           |            |
| className           | Style name of outermost element                                                                                                                                                            | boolean                                                                                                                          |            |
| defaultIsCollapsed  | Whether the default is put away, valid only when `mode = "vertical"`                                                                                                                       | boolean                                                                                                                          | false      |
| defaultOpenKeys     | Initially open sub navigation `itemKey` array, valid only `mode = "vertical"`and the sidebar is in an expanded state                                                                       | string[]                                                                                                                         | []         |
| defaultSelectedKeys | Originally selected navigation item `itemKey` array                                                                                                                                        | string[]                                                                                                                         | []         |
| footer              | The bottom area configure objects or elements, see [Nav.Footer](#Nav.Footer)                                                                                                               | object\|ReactNode                                                                                                                |            |
| header              | Head area configuration objects or elements, see [Nav.Header](#Nav.Header)                                                                                                                 | object\|ReactNode                                                                                                                |            |
| isCollapsed         | A controlled attribute of whether it is in a put-away state, valid only when `mode = "vertical"`                                                                                           | boolean                                                                                                                          |            |
| items               | Navigate the list of items, each item can continue with the items property. If it is a string array, each item is taken as text and itemKey                                                | object\|string[]\|[Item](#Nav.Item)[]\|[Sub](#Nav.Sub)[]                                                                         |            |
| mode                | Navigation type, currently supports horizontal and vertical, optional value: `vertical`\|`horizontal`                                                                                      | string                                                                                                                           | `vertical` |
| onClick             | Trigger when clicking on any navigation item                                                                                                                                               | ({ itemKey: string, domEvent: MouseEvent, isOpen: boolean }) => void                                                             | () = > {}  |
| onCollapseChange    | The callback when the state changes.                                                                                                                                                       | (is Collapsed: boolean) => void                                                                                                  | () = > {}  |
| onOpenChange        | Triggers when switching the hidden state of a sub navigation project                                                                                                                       | ({ itemKey: string, openKeys: string[], domEvent: MouseEvent, isOpen: boolean }) => void                                         | () = > {}  |
| onSelect            | Triggers the first time you select an optional navigation project, where the selected Items field version > = 0.17.0 is supported                                                          | ({ itemKey: string, selectedKeys: string[], selectedItems: [Item](#Nav.Item)[], domEvent: MouseEvent, isOpen: boolean }) => void | () = > {}  |
| openKeys            | Controlled open sub navigation `itemKey` array, expanded with `onOpenChange` callback control sub navigation items, valid only `mode = "vertical"`and the sidebar is in an unfolding state | string[]                                                                                                                         |            |
| selectedKeys        | Controlled navigation item `itemKey` array, with `onSelect` callback control navigation item selection                                                                                     | string[]                                                                                                                         |            |
| style               | Custom styles for outermost elements                                                                                                                                                       | object                                                                                                                           |            |
| subNavCloseDelay    | Delay of sub navigation floating layer closure. Effective when the limit is true or mode is "limit" in MS                                                                                  | number                                                                                                                           | 100        |
| subNavOpenDelay     | The delay displayed by the sub navigation floating layer. Effective when the input is true or mode is "selected" in MS                                                                     | number                                                                                                                           | 0          |
| tooltipHideDelay    | The latency hidden by tooltip is valid when it is true in MS                                                                                                                               | number                                                                                                                           | 100        |
| tooltipShowDelay    | The delay displayed by tooltip is valid when it is true in MS                                                                                                                              | number                                                                                                                           | 0          |
| limitIndent         | To lift the indentation limit, you can use level to customize the indentation of navigation items. The horizontal mode can only be true >=1.27.0                                           | boolean                                                                                                                          | true       |
| toggleIconPosition  | Parent navigation item arrow position with child navigation items >=1.27.0                                                                                                                 | 'left' \| 'right'                                                                                                                | 'right'    |

### Nav.Item

| Properties   | Description                                                                                                       | Type                                                                 | Default  | Version |
| ------------ | ----------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- | -------- | ------- |
| disabled     | Disabled state                                                                                                    | boolean                                                              | false    | 1.17.0  |
| icon         | Navigation project icon name or component                                                                         | ReactNode                                                            |          |         |
| indent       | If the icon is empty, keep its space or not. Only effective for first level navigation                            | boolean                                                              | false    |         |
| itemKey      | Navigation project only key                                                                                       | string                                                               | ""       |         |
| level        | The nesting level of the current item. When limitIndent is true, it is used to customize the indentation position | number                                                               |          | 1.27.0  |
| link         | Navigation item href link, when imported, the navigation item will be wrapped with an a tag                       | string                                                               | -        | 1.0.0   |
| linkOptions  | Parameters transparently passed to the a tag                                                                      | object                                                               | -        | 1.0.0   |
| text         | Navigation project copy or element                                                                                | string \| ReactNode                                                  | ""       |         |
| onClick      | Callback of click                                                                                                 | function({ itemKey: string, domEvent: MouseEvent, isOpen: boolean }) | () => {} |
| onMouseEnter | Callback of mouse enter event                                                                                     | function(e) => {}                                                    | () => {} |
| onMouseLeave | Callback of mouse leave event                                                                                     | function(e) => {}                                                    | () => {} |

### Nav.Sub

| Properties    | Description                                                                                                       | Type                | Default  |
| ------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------- | -------- |
| disabled      | Disabled state                                                                                                    | boolean             | false    | 1.17.0 |
| dropdownStyle | Style of dropdown layer                                                                                           | CSSProperties       |          |        |
| icon          | Navigation project icon name or component                                                                         | ReactNode           |          |
| indent        | If the icon is empty, keep its space or not. Only effective for first level navigation                            | boolean             | false    |
| isCollapsed   | Whether it is a controlled attribute in the collapsed state, only `mode = "vertical"`                             | boolean             | false    |
| isOpen        | Control open state                                                                                                | boolean             | false    |
| itemKey       | Navigation project only key                                                                                       | string              | ""       |
| level         | The nesting level of the current item. When limitIndent is true, it is used to customize the indentation position | number              | 1.27.0   |
| maxHeight     | max height                                                                                                        | number              | 999      |
| text          | Navigation project copy or component                                                                              | string \| ReactNode | ""       |
| onMouseEnter  | Callback of mouse enter event                                                                                     | function(e) => {}   | () => {} |
| onMouseLeave  | Callback of mouse leave event                                                                                     | function(e) => {}   | () => {} |

### Nav.Header

| Properties  | Description                                                                                 | Type                | Default | Version |
| ----------- | ------------------------------------------------------------------------------------------- | ------------------- | ------- | ------- |
| children    | Sub element                                                                                 | ReactNode           |         |         |
| className   | Outermost style name                                                                        | string              |         |         |
| link        | Navigation item href link, when imported, the navigation item will be wrapped with an a tag | string              | -       | 1.0.0   |
| linkOptions | Parameters transparently passed to the a tag                                                | object              | -       | 1.0.0   |
| logo        | Logo, can be a string or component                                                          | string \| ReactNode |         |         |
| style       | Outermost style                                                                             | object              |         |         |
| text        | Logo copy, which can be a string or component                                               | string \| ReactNode |         |         |

### Nav.Footer

| Properties     | Description                                                                                                                       | Type                                      | Default | Version |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- | ------- | ------- |
| children       | Sub element                                                                                                                       | ReactNode                                 |         |         |
| className      | Outermost style name                                                                                                              | string                                    |         |         |
| collapseButton | Do you show the bottom "put away the sidebar" button, mode = "vertical" and the child parameter of the Footer component is empty? | boolean\|ReactNode                        | false   |         |
| collapseText   | Title of the collapse button                                                                                                      | (collapsed:boolean) => string\|ReactNode |         | 0.35.0  |
| style          | Outermost style                                                                                                                   | object                                    |         |         |

## Design Tokens
<DesignToken/>

<!-- ## Related Material
```material
2, 43, 312
``` -->

## FAQ
- **Lost animation in navigation bar?**

    When using functional components, you should give items with useState or useMemo, because passing an array directly to items will trigger component rerendering.

- **Lost item when subNav is too height >=999px ?**
    Please refer to [this issue](https://github.com/DouyinFE/semi-design/issues/563)
