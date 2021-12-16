---
localeCode: zh-CN
order: 48
category: 展示类
title: Dropdown 下拉框
icon: doc-dropdown
brief: 向下弹出的菜单。
---

## 代码演示

### 如何引入

```jsx import
import { Dropdown } from '@douyinfe/semi-ui';
```

### 基本用法

```jsx live=true
import React from 'react';
import { Dropdown, Tag } from '@douyinfe/semi-ui';

function Demo() {
    return (
        <Dropdown
            render={
                <Dropdown.Menu>
                    <Dropdown.Item>Menu Item 1</Dropdown.Item>
                    <Dropdown.Item>Menu Item 2</Dropdown.Item>
                    <Dropdown.Item>Menu Item 3</Dropdown.Item>
                </Dropdown.Menu>
            }
        >
            <Tag>Hover Me</Tag>
        </Dropdown>
    );
}
```

### 嵌套使用

用户可以对 `Dropdown` 进行嵌套使用，此类情况适合具有多个子级选项的情况。

```jsx live=true
import React, { useMemo } from 'react';
import { Dropdown, Tag } from '@douyinfe/semi-ui';

function Demo() {
    const subDropdown = useMemo(
        () => (
            <Dropdown.Menu>
                <Dropdown.Item>Menu Item 1</Dropdown.Item>
                <Dropdown.Item>Menu Item 2</Dropdown.Item>
                <Dropdown.Item>Menu Item 3</Dropdown.Item>
            </Dropdown.Menu>
        ),
        []
    );

    return (
        <div style={{ margin: 100 }}>
            <Dropdown
                render={
                    <Dropdown.Menu>
                        <Dropdown position={'rightTop'} render={subDropdown}>
                            <Dropdown.Item>Menu Item 1</Dropdown.Item>
                        </Dropdown>
                        <Dropdown position={'leftTop'} render={subDropdown}>
                            <Dropdown.Item>Menu Item 2</Dropdown.Item>
                        </Dropdown>
                        <Dropdown.Item>Menu Item 3</Dropdown.Item>
                    </Dropdown.Menu>
                }
            >
                <Tag>Hover Me</Tag>
            </Dropdown>
        </div>
    );
}
```

### 元素属性

通过设置 `disabled` 可以禁用某个选项  
通过给 `Dropdown.Item` 配置 `type`，可以展示不同颜色的文本  
通过在 `Dropdown.Item` 上设置 `icon` 可以快速配置图标

```jsx live=true
import React from 'react';
import { Dropdown, Button } from '@douyinfe/semi-ui';
import {
    IconBox,
    IconSimilarity,
    IconSetting,
    IconForward,
    IconColorPalette,
    IconRefresh,
    IconSearch,
    IconBranch,
} from '@douyinfe/semi-icons';

function Demo() {
    return (
        <div>
            <Dropdown
                trigger="custom"
                position="bottomLeft"
                visible
                render={
                    <Dropdown.Menu>
                        <Dropdown.Item icon={<IconBox />}>Menu Item 1</Dropdown.Item>
                        <Dropdown.Item icon={<IconSetting />}>Menu Item 2</Dropdown.Item>
                        <Dropdown.Item disabled icon={<IconForward />}>
                            Menu Item 3
                        </Dropdown.Item>
                        <Dropdown.Item icon={<IconBranch />} type="primary">
                            primary
                        </Dropdown.Item>
                        <Dropdown.Item icon={<IconColorPalette />} type="secondary">
                            secondary
                        </Dropdown.Item>
                        <Dropdown.Item icon={<IconRefresh />} type="tertiary">
                            tertiary
                        </Dropdown.Item>
                        <Dropdown.Item icon={<IconSearch />} type="warning">
                            warning
                        </Dropdown.Item>
                        <Dropdown.Item
                            icon={<IconSimilarity style={{ color: 'var(--semi-color-tertiary)' }} />}
                            type="danger"
                        >
                            danger
                        </Dropdown.Item>
                    </Dropdown.Menu>
                }
            >
                <Button>始终展示</Button>
            </Dropdown>
            <Dropdown
                trigger="custom"
                position="bottomLeft"
                showTick
                visible
                render={
                    <Dropdown.Menu>
                        <Dropdown.Item icon={<IconBox />} active>
                            Menu Item 1
                        </Dropdown.Item>
                        <Dropdown.Item icon={<IconSetting />}>Menu Item 2</Dropdown.Item>
                        <Dropdown.Item disabled icon={<IconForward />}>
                            Menu Item 3
                        </Dropdown.Item>
                        <Dropdown.Item icon={<IconBranch />} type="primary">
                            primary
                        </Dropdown.Item>
                        <Dropdown.Item icon={<IconColorPalette />} type="secondary">
                            secondary
                        </Dropdown.Item>
                        <Dropdown.Item icon={<IconRefresh />} type="tertiary">
                            tertiary
                        </Dropdown.Item>
                        <Dropdown.Item icon={<IconSearch />} type="warning">
                            warning
                        </Dropdown.Item>
                        <Dropdown.Item
                            icon={<IconSimilarity style={{ color: 'var(--semi-color-tertiary)' }} />}
                            type="danger"
                        >
                            danger
                        </Dropdown.Item>
                    </Dropdown.Menu>
                }
            >
                <Button style={{ marginLeft: 90 }}>ShowTick+始终展示</Button>
            </Dropdown>
        </div>
    );
}
```

### 弹出位置

支持的位置同 [Tooltip](https://semi.design/zh-CN/show/tooltip#%E4%BD%8D%E7%BD%AE)，常用的是："bottom", "bottomLeft", "bottomRight" 这三种。

```jsx live=true
import React from 'react';
import { Dropdown, Tag } from '@douyinfe/semi-ui';

function Demo() {
    return (
        <div>
            <Dropdown
                position={'bottom'}
                render={
                    <Dropdown.Menu>
                        <Dropdown.Item>Menu Item 1</Dropdown.Item>
                        <Dropdown.Item>Menu Item 2</Dropdown.Item>
                        <Dropdown.Item>Menu Item 3</Dropdown.Item>
                    </Dropdown.Menu>
                }
            >
                <Tag>Bottom</Tag>
            </Dropdown>
            <br />
            <br />
            <Dropdown
                position={'bottomLeft'}
                render={
                    <Dropdown.Menu>
                        <Dropdown.Item>Menu Item 1</Dropdown.Item>
                        <Dropdown.Item>Menu Item 2</Dropdown.Item>
                        <Dropdown.Item>Menu Item 3</Dropdown.Item>
                    </Dropdown.Menu>
                }
            >
                <Tag>bottomLeft</Tag>
            </Dropdown>
            <br />
            <br />
            <Dropdown
                position={'bottomRight'}
                render={
                    <Dropdown.Menu>
                        <Dropdown.Item>Menu Item 1</Dropdown.Item>
                        <Dropdown.Item>Menu Item 2</Dropdown.Item>
                        <Dropdown.Item>Menu Item 3</Dropdown.Item>
                    </Dropdown.Menu>
                }
            >
                <Tag>bottomRight</Tag>
            </Dropdown>
        </div>
    );
}
```

### 触发方式

默认是移入触发，可通过获取焦点，点击或自定义事件触发菜单展开。

```jsx live=true
import React from 'react';
import { Dropdown, Tag, Input, Button } from '@douyinfe/semi-ui';

function Demo() {
    return (
        <div>
            <Dropdown
                trigger={'hover'}
                position={'bottomLeft'}
                render={
                    <Dropdown.Menu>
                        <Dropdown.Item>Menu Item 1</Dropdown.Item>
                        <Dropdown.Item>Menu Item 2</Dropdown.Item>
                        <Dropdown.Item>Menu Item 3</Dropdown.Item>
                    </Dropdown.Menu>
                }
            >
                <Tag>Hover me</Tag>
            </Dropdown>
            <br />
            <br />
            <Dropdown
                trigger={'focus'}
                position={'bottomLeft'}
                render={
                    <Dropdown.Menu tabIndex={-1}>
                        <Dropdown.Item>Menu Item 1</Dropdown.Item>
                        <Dropdown.Item>Menu Item 2</Dropdown.Item>
                        <Dropdown.Item>Menu Item 3</Dropdown.Item>
                    </Dropdown.Menu>
                }
            >
                <Input style={{ width: 120 }} placeholder="点击此处" />
            </Dropdown>
            <br />
            <br />
            <Dropdown
                trigger={'click'}
                position={'bottomLeft'}
                render={
                    <Dropdown.Menu>
                        <Dropdown.Item>Menu Item 1</Dropdown.Item>
                        <Dropdown.Item>Menu Item 2</Dropdown.Item>
                        <Dropdown.Item>Menu Item 3</Dropdown.Item>
                    </Dropdown.Menu>
                }
            >
                <Button>Click me</Button>
            </Dropdown>
        </div>
    );
}
```

### 触发事件

点击菜单项后可触发不同鼠标事件，支持 `onClick`，`onMouseEnter`， `onMouseLeave` 和 `onContextMenu`。

```jsx live=true
import React from 'react';
import { Dropdown, Button, Toast } from '@douyinfe/semi-ui';

class DropdownEvents extends React.Component {
    constructor() {
        super();
        this.click = this.click.bind(this);
        this.mouseEnter = this.mouseEnter.bind(this);
        this.mouseLeave = this.mouseLeave.bind(this);
        this.rightClick = this.rightClick.bind(this);
    }

    click(value) {
        Toast.info({ content: 'You clicked me!' });
    }

    mouseEnter(value) {
        Toast.info({ content: 'Nice to meet you!' });
    }

    mouseLeave(value) {
        Toast.info({ content: 'See ya!' });
    }

    rightClick(value) {
        Toast.info({ content: 'Right clicked!' });
    }

    render() {
        return (
            <Dropdown
                trigger={'click'}
                position={'bottomLeft'}
                render={
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={this.click}>1: click me!</Dropdown.Item>
                        <Dropdown.Item onMouseEnter={this.mouseEnter}>2: mouse enter</Dropdown.Item>
                        <Dropdown.Item onMouseLeave={this.mouseLeave}>3: mouse leave</Dropdown.Item>
                        <Dropdown.Item onContextMenu={this.rightClick}>4: right click</Dropdown.Item>
                    </Dropdown.Menu>
                }
            >
                <Button>Click me</Button>
            </Dropdown>
        );
    }
}
```

### 分组组合

使用 `Dropdown.Divider` 可以插入分割线使用 `Dropdown.Title` 可以插入分组名组合使用 `Dropdown.Title`、`Dropdown.Divider`、`Dropdown.Item`。

```jsx live=true
import React from 'react';
import { Dropdown, Button, Toast } from '@douyinfe/semi-ui';

class DropdownEvents extends React.Component {
    constructor() {
        super();
        this.click = this.click.bind(this);
    }

    click(value) {
        Toast.info({ content: 'You clicked me!' });
    }

    render() {
        return (
            <Dropdown
                trigger={'click'}
                showTick
                position={'bottomLeft'}
                render={
                    <Dropdown.Menu>
                        <Dropdown.Title>分组1</Dropdown.Title>
                        <Dropdown.Item type="primary">primary</Dropdown.Item>
                        <Dropdown.Item type="secondary">secondary</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Title>分组2</Dropdown.Title>
                        <Dropdown.Item type="tertiary">tertiary</Dropdown.Item>
                        <Dropdown.Item type="warning" active>
                            warning
                        </Dropdown.Item>
                        <Dropdown.Item type="danger">danger</Dropdown.Item>
                    </Dropdown.Menu>
                }
            >
                <Button>Click me</Button>
            </Dropdown>
        );
    }
}
```

### Json 用法

可以通过 menu 属性，传入 JSON Array 快速配置出下拉框菜单

```jsx live=true
import React from 'react';
import { Dropdown, Button } from '@douyinfe/semi-ui';

function DropdownEvents() {
    const menu = [
        { node: 'title', name: '分组1' },
        { node: 'item', name: 'primary1', type: 'primary', onClick: () => console.log('click primary') },
        { node: 'item', name: 'secondary', type: 'secondary' },
        { node: 'divider' },
        { node: 'title', name: '分组2' },
        { node: 'item', name: 'tertiary', type: 'tertiary' },
        { node: 'item', name: 'warning', type: 'warning', active: true },
        { node: 'item', name: 'danger', type: 'danger' },
    ];
    return (
        <Dropdown trigger={'click'} showTick position={'bottomLeft'} menu={menu}>
            <Button>Click me</Button>
        </Dropdown>
    );
}
```

## API 参考

### Dropdown

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| autoAdjustOverflow | 弹出层被遮挡时是否自动调整方向 | boolean | true |  |
| className | 下拉弹层外层样式类名 | string |  |  |
| children | 触发弹出层的 Trigger 元素 | ReactNode |  |  |
| clickToHide | 在弹出层内点击时是否自动关闭弹出层 | boolean |  | **0.24.0** |
| contentClassName | 下拉菜单根元素类名 | string |  |  |
| getPopupContainer | 指定父级 DOM，弹层将会渲染至该 DOM 中，自定义需要设置 `position: relative` | function():HTMLElement | () => document.body |  |
| mouseEnterDelay | 鼠标移入 Trigger 后，延迟显示的时间，单位毫秒（仅当 trigger 为 hover/focus 时生效） | number | 50 |  |
| mouseLeaveDelay | 鼠标移出弹出层后，延迟消失的时间，单位毫秒（仅当 trigger 为 hover/focus 时生效） | number | 50 |  |
| menu | 通过传入 JSON Array 来快速配置 Dropdown 内容 | Array<DropdownMenuItem\> | [] | **1.12.0** |
| position | 弹出菜单的位置，常用："bottom", "bottomLeft", "bottomRight"，更多详见[Tooltip 位置](https://semi.design/zh-CN/show/tooltip#%E4%BD%8D%E7%BD%AE) | string | "bottom" |  |
| render | 弹出层的内容，由 `Dropdown.Menu` 及 `Dropdown.Item`、`Dropdown.Title` 构成 | ReactNode |  |  |
| rePosKey | 可以更新该项值手动触发弹出层的重新定位 | string \| number |  |  |
| spacing | 弹出层与 Trigger 元素（即 Dropdown children）的距离，单位 px | number | 4 |  |
| style | 弹出层内联样式 | object |  |  |
| showTick | 是否自动在 active 的 Dropdown.Item 项左侧展示表示选中的勾 | boolean | false | **0.26.0** |
| stopPropagation | 是否阻止弹出层上的点击事件冒泡 | boolean | false | **0.34.0** |
| trigger | 触发下拉的行为，可选 "hover", "focus", "click", "custom" | string | "hover" |  |
| visible | 是否显示菜单，需配合 trigger custom 使用 | boolean | 无 |  |
| zIndex | 弹出层 z-index 值 | number | 1050 |  |
| onClickOutSide | 当弹出层处于展示状态，点击非Children、非弹出层内部区域时的回调（仅trigger为custom、click时有效）| function(e:event) |  | **2.1.0** |
| onVisibleChange | 弹出层显示状态改变时的回调 | function(visible: boolean) |  |  |

### Dropdown.Menu

| 属性      | 说明                                                                 | 类型      | 默认值 | 版本       |
| --------- | -------------------------------------------------------------------- | --------- | ------ | ---------- |
| className | 下拉弹层菜单样式类名                                                 | string    |        | **0.28.0** |
| children  | 下拉弹层菜单包裹的子元素，一般为 `Dropdown.Item` 或 `Dropdown.Title` | ReactNode |        |            |
| style     | 下拉弹层菜单样式                                                     | object    |        | **0.28.0** |

### Dropdown.Item

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| active | 当前项是否处于激活态，激活态时左侧有 √，字体加粗，颜色加深。当 Dropdown 的 showTick 为 false 时，即使 Dropdown.Item 的 active 为 true，√ 也不会展示 | bool | false |  |
| className | 样式类名 | string |  |  |
| disabled | 是否禁用菜单 | boolean | false |  |
| icon | 图标 | ReactNode |  | **1.16.0** |
| style | 内联样式 | object |  |  |
| type | 类型，可选值："primary"、"secondary"、"tertiary"、"warning"、"danger" | string | "tertiary" |  |
| onClick | 单击触发的回调事件 | function | 无 |  |
| onMouseEnter | MouseEnter 触发的回调事件 | function | 无 |  |
| onMouseLeave | MouseLeave 触发的回调事件 | function | 无 |  |
| onContextMenu | 点击鼠标右键触发的回调事件 | function | 无 | **1.6.0** |

### Dropdown.Title

| 属性      | 说明     | 类型   | 默认值 |
| --------- | -------- | ------ | ------ |
| className | 样式类名 | string | ""     |
| style     | 内联样式 | object | {}     |

### DropdownMenuItem

| 属性                                     | 说明                                       | 类型   | 默认值 |
| ---------------------------------------- | ------------------------------------------ | ------ | ------ |
| node                                     | 按钮类型，可选：`title`，`item`，`divider` | string |        |
| name                                     | 菜单文本，标题或 Item 的内容               | string |        |
| 其他属性与 Title、Item、Divider 属性对应 |                                            |        |        |

## 设计变量

<DesignToken/>

<!--
## 相关物料

```material
5
``` -->
