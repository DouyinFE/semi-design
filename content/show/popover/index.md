---
localeCode: zh-CN
order: 53
category: 展示类
title: Popover 气泡卡片
icon: doc-popover
brief: 点击/鼠标移入元素，弹出气泡式的卡片浮层。
---

## 何时使用

当目标元素有进一步的描述和相关操作时，可以收纳到卡片中，根据用户的操作行为进行展现。

和 Tooltip 的区别是，用户可以对浮层上的元素进行操作，因此它可以承载更复杂的内容，比如链接或按钮等。

## 代码演示

### 如何引入

```jsx import
import { Popover } from '@douyinfe/semi-ui';
```
### 基本使用

将浮层的触发器 Trigger 作为`children`，使用 Popover 包裹（如下的例子中触发器为 Tag 元素）。浮层内容通过`content`传入

```jsx live=true
import React from 'react';
import { Popover, Tag } from '@douyinfe/semi-ui';

function Demo() {
    return (
        <Popover
            content={
                <article style={{ padding: 12 }}>
                    Hi ByteDancer, this is a popover.
                    <br /> We have 2 lines.
                </article>
            }
        >
            <Tag>悬停此处</Tag>
        </Popover>
    );
}
```

### 弹出位置

支持通过`position`设置浮层弹出方向，共支持十二个方向。

```jsx live=true
import React from 'react';
import { Popover, Tag } from '@douyinfe/semi-ui';

function Demo() {
    const tops = [
        ['topLeft', 'TL'],
        ['top', 'Top'],
        ['topRight', 'TR'],
    ];
    const lefts = [
        ['leftTop', 'LT'],
        ['left', 'Left'],
        ['leftBottom', 'LB'],
    ];
    const rights = [
        ['rightTop', 'RT'],
        ['right', 'Right'],
        ['rightBottom', 'RB'],
    ];
    const bottoms = [
        ['bottomLeft', 'BL'],
        ['bottom', 'Bottom'],
        ['bottomRight', 'BR'],
    ];

    return (
        <div style={{ paddingLeft: 40 }} className="tag-margin-right">
            <div style={{ marginLeft: 40, whiteSpace: 'nowrap' }}>
                {tops.map((pos, index) => (
                    <Popover
                        content={
                            <article style={{ padding: 12 }}>
                                Hi ByteDancer, this is a popover.
                                <br /> We have 2 lines.
                            </article>
                        }
                        position={Array.isArray(pos) ? pos[0] : pos}
                        key={index}
                    >
                        <Tag>{Array.isArray(pos) ? pos[1] : pos}</Tag>
                    </Popover>
                ))}
            </div>
            <div style={{ width: 40, float: 'left' }}>
                {lefts.map((pos, index) => (
                    <Popover
                        content={
                            <article style={{ padding: 12 }}>
                                Hi ByteDancer, this is a popover.
                                <br /> We have 2 lines.
                            </article>
                        }
                        position={Array.isArray(pos) ? pos[0] : pos}
                        key={index}
                    >
                        <Tag>{Array.isArray(pos) ? pos[1] : pos}</Tag>
                    </Popover>
                ))}
            </div>
            <div style={{ width: 40, marginLeft: 180 }}>
                {rights.map((pos, index) => (
                    <Popover
                        content={
                            <article style={{ padding: 12 }}>
                                Hi ByteDancer, this is a popover.
                                <br /> We have 2 lines.
                            </article>
                        }
                        position={Array.isArray(pos) ? pos[0] : pos}
                        key={index}
                    >
                        <Tag>{Array.isArray(pos) ? pos[1] : pos}</Tag>
                    </Popover>
                ))}
            </div>
            <div style={{ marginLeft: 40, clear: 'both', whiteSpace: 'nowrap' }}>
                {bottoms.map((pos, index) => (
                    <Popover
                        content={
                            <article style={{ padding: 12 }}>
                                Hi ByteDancer, this is a popover.
                                <br /> We have 2 lines.
                            </article>
                        }
                        position={Array.isArray(pos) ? pos[0] : pos}
                        key={index}
                    >
                        <Tag>{Array.isArray(pos) ? pos[1] : pos}</Tag>
                    </Popover>
                ))}
            </div>
        </div>
    );
}
```

### 受控显示

设置`trigger='custom'`，此场景下，Popover 的显示与否完全受到参数 `visible` 的控制。

```jsx live=true
import React from 'react';
import { Popover, Button } from '@douyinfe/semi-ui';

class App extends React.Component {
    constructor(props = {}) {
        super(props);

        this.state = {
            visible: false,
        };

        this.content = (
            <article style={{ padding: 12 }}>
                Hi ByteDancer, this is a popover.
                <br /> We have 2 lines.
            </article>
        );

        this.toggleShow = this.toggleShow.bind(this);
    }

    toggleShow() {
        this.setState({
            visible: !this.state.visible,
        });
    }

    render() {
        const content = this.content;

        const { visible } = this.state;

        return (
            <div>
                <div>
                    <Popover visible={visible} content={content} trigger="custom">
                        <Button onClick={this.toggleShow}>点我</Button>
                    </Popover>
                </div>
            </div>
        );
    }
}
```

### 显示小三角

**版本：**>= 0.19.0

通过设置`showArrow`, Popover 同样也支持展示一个小三角。

> 这种模式下浮层会拥有一个默认的样式，你可以通过传递 style 参数来覆盖掉。

```jsx live=true
import React from 'react';
import { Popover, Tag } from '@douyinfe/semi-ui';

function Demo() {
    const tops = [
        ['topLeft', 'TL'],
        ['top', 'Top'],
        ['topRight', 'TR'],
    ];
    const lefts = [
        ['leftTop', 'LT'],
        ['left', 'Left'],
        ['leftBottom', 'LB'],
    ];
    const rights = [
        ['rightTop', 'RT'],
        ['right', 'Right'],
        ['rightBottom', 'RB'],
    ];
    const bottoms = [
        ['bottomLeft', 'BL'],
        ['bottom', 'Bottom'],
        ['bottomRight', 'BR'],
    ];

    return (
        <div style={{ paddingLeft: 40 }} className="tag-margin-right">
            <div style={{ marginLeft: 40, whiteSpace: 'nowrap' }}>
                {tops.map((pos, index) => (
                    <Popover
                        showArrow
                        content={
                            <article>
                                Hi ByteDancer, this is a popover.
                                <br /> We have 2 lines.
                            </article>
                        }
                        position={Array.isArray(pos) ? pos[0] : pos}
                        key={index}
                    >
                        <Tag>{Array.isArray(pos) ? pos[1] : pos}</Tag>
                    </Popover>
                ))}
            </div>
            <div style={{ width: 40, float: 'left' }}>
                {lefts.map((pos, index) => (
                    <Popover
                        showArrow
                        content={
                            <article>
                                Hi ByteDancer, this is a popover.
                                <br /> We have 2 lines.
                            </article>
                        }
                        position={Array.isArray(pos) ? pos[0] : pos}
                        key={index}
                    >
                        <Tag>{Array.isArray(pos) ? pos[1] : pos}</Tag>
                    </Popover>
                ))}
            </div>
            <div style={{ width: 40, marginLeft: 180 }}>
                {rights.map((pos, index) => (
                    <Popover
                        showArrow
                        content={
                            <article>
                                Hi ByteDancer, this is a popover.
                                <br /> We have 2 lines.
                            </article>
                        }
                        position={Array.isArray(pos) ? pos[0] : pos}
                        key={index}
                    >
                        <Tag>{Array.isArray(pos) ? pos[1] : pos}</Tag>
                    </Popover>
                ))}
            </div>
            <div style={{ marginLeft: 40, clear: 'both', whiteSpace: 'nowrap' }}>
                {bottoms.map((pos, index) => (
                    <Popover
                        showArrow
                        content={
                            <article>
                                Hi ByteDancer, this is a popover.
                                <br /> We have 2 lines.
                            </article>
                        }
                        position={Array.isArray(pos) ? pos[0] : pos}
                        key={index}
                    >
                        <Tag>{Array.isArray(pos) ? pos[1] : pos}</Tag>
                    </Popover>
                ))}
            </div>
        </div>
    );
}
```

### 指向元素中心

**版本：**>= 0.34.0

在**显示小三角**的条件（`showArrow=true`）下，可以传入 `arrowPointAtCenter=true` 使得小三角始终指向元素中心位置。

```jsx live=true
import React from 'react';
import { Popover, Tag } from '@douyinfe/semi-ui';

function Demo() {
    const tops = [
        ['topLeft', 'TL'],
        ['top', 'Top'],
        ['topRight', 'TR'],
    ];
    const lefts = [
        ['leftTop', 'LT'],
        ['left', 'Left'],
        ['leftBottom', 'LB'],
    ];
    const rights = [
        ['rightTop', 'RT'],
        ['right', 'Right'],
        ['rightBottom', 'RB'],
    ];
    const bottoms = [
        ['bottomLeft', 'BL'],
        ['bottom', 'Bottom'],
        ['bottomRight', 'BR'],
    ];

    return (
        <div style={{ paddingLeft: 40 }} className="tag-margin-right">
            <div style={{ marginLeft: 40, whiteSpace: 'nowrap' }}>
                {tops.map((pos, index) => (
                    <Popover
                        showArrow
                        arrowPointAtCenter
                        content={
                            <article>
                                Hi ByteDancer, this is a popover.
                                <br /> We have 2 lines.
                            </article>
                        }
                        position={Array.isArray(pos) ? pos[0] : pos}
                        key={index}
                    >
                        <Tag>{Array.isArray(pos) ? pos[1] : pos}</Tag>
                    </Popover>
                ))}
            </div>
            <div style={{ width: 40, float: 'left' }}>
                {lefts.map((pos, index) => (
                    <Popover
                        showArrow
                        arrowPointAtCenter
                        content={
                            <article>
                                Hi ByteDancer, this is a popover.
                                <br /> We have 2 lines.
                            </article>
                        }
                        position={Array.isArray(pos) ? pos[0] : pos}
                        key={index}
                    >
                        <Tag>{Array.isArray(pos) ? pos[1] : pos}</Tag>
                    </Popover>
                ))}
            </div>
            <div style={{ width: 40, marginLeft: 180 }}>
                {rights.map((pos, index) => (
                    <Popover
                        showArrow
                        arrowPointAtCenter
                        content={
                            <article>
                                Hi ByteDancer, this is a popover.
                                <br /> We have 2 lines.
                            </article>
                        }
                        position={Array.isArray(pos) ? pos[0] : pos}
                        key={index}
                    >
                        <Tag>{Array.isArray(pos) ? pos[1] : pos}</Tag>
                    </Popover>
                ))}
            </div>
            <div style={{ marginLeft: 40, clear: 'both', whiteSpace: 'nowrap' }}>
                {bottoms.map((pos, index) => (
                    <Popover
                        showArrow
                        arrowPointAtCenter
                        content={
                            <article>
                                Hi ByteDancer, this is a popover.
                                <br /> We have 2 lines.
                            </article>
                        }
                        position={Array.isArray(pos) ? pos[0] : pos}
                        key={index}
                    >
                        <Tag>{Array.isArray(pos) ? pos[1] : pos}</Tag>
                    </Popover>
                ))}
            </div>
        </div>
    );
}
```

### 设置浮层背景色

如果你需要定制浮层的背景色或边框颜色，请**务必单独声明 `style` 中的 `backgroundColor` 和 `borderColor` 属性**，这样能够使得“小三角”也能应用相同的背景色和边框颜色。

```jsx live=true
import React from 'react';
import { Popover, Tag } from '@douyinfe/semi-ui';

function Demo() {
    return (
        <Popover
            content={
                <article style={{ padding: 4 }}>
                    Hi ByteDancer, this is a popover.
                    <br /> We have 2 lines.
                </article>
            }
            trigger="click"
            showArrow
            style={{
                backgroundColor: 'rgb(0,119,250)',
                borderColor: 'rgb(0,98,214)',
                color: 'rgb(255,255,255)',
                borderWidth: 1,
                borderStyle: 'solid',
            }}
        >
            <Tag>点击此处</Tag>
        </Popover>
    );
}
```

### 搭配 Tooltip 或 Popconfirm 使用

请参考[搭配使用](/zh-CN/show/tooltip#%E6%90%AD%E9%85%8D%20Popover%20%E6%88%96%20Popconfirm%20%E4%BD%BF%E7%94%A8)

## API 参考

| 属性               | 说明                                                                                                                                        | 类型                       | 默认值                                      | 版本       |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- | ------------------------------------------- | ---------- |
| autoAdjustOverflow | 是否自动调整弹出层展开方向，用于边缘遮挡时自动调整展开方向                                                                                  | boolean                    | true                                        |            |
| arrowPointAtCenter | “小三角”是否指向元素中心，需要同时传入"showArrow=true"                                                                                      | boolean                    | true                                        | **0.34.0** |
| content            | 显示的内容                                                                                                                                  | string\|ReactNode          |                                             |            |
| clickToHide        | 点击弹出层及内部任一元素时是否自动关闭弹层                                                                                                  | boolean                    | false                                       | **0.24.0** |
| getPopupContainer  | 指定父级 DOM，弹层将会渲染至该 DOM 中，自定义需要设置 `position: relative`                                                                  | function():HTMLElement     | () => document.body                         |            |
| mouseEnterDelay    | 鼠标移入后，延迟显示的时间，单位毫秒（仅当 trigger 为 hover/focus 时生效）                                                                  | number                     | 50                                          |            |
| mouseLeaveDelay    | 鼠标移出后，延迟消失的时间，单位毫秒（仅当 trigger 为 hover/focus 时生效）                                                                  | number                     | 50                                          |            |
| onVisibleChange    | 弹出层展示/隐藏时触发的回调                                                                                                                 | function(isVisble:boolean) |                                             |            |
| rePosKey           | 可以更新该项值手动触发弹出层的重新定位                                                                                                         | string\|number             |                                            |             |
| position           | 方向，可选值：`top`,`topLeft`,`topRight`,`left`,`leftTop`,`leftBottom`,`right`,`rightTop`,`rightBottom`,`bottom`,`bottomLeft`,`bottomRight` | string                     | "bottom"                                    |            |
| spacing            | 弹出层与 children 元素的距离，单位 px                                                                                                       | number                     | 4(showArrow=false 时) 10(showArrow=true 时) |            |
| showArrow          | 是否显示“小三角”                                                                                                                            | boolean                    |                                             |            |
| stopPropagation    | 是否阻止弹出层上的点击事件冒泡                                                                                                              | boolean                    | false                                       | **0.34.0** |
| trigger            | 触发方式，可选值：`hover`, `focus`, `click`, `custom`                                                                                       | string                     | 'hover'                                     |            |
| visible            | 是否显示，配合trigger='custom'可实现完全受控                                                                                                                                    | boolean                    |                                             |            |
| zIndex             | 弹出层 z-index 值                                                                                                                             | number                     | 1030                                        |            |

## 设计变量
<DesignToken/>