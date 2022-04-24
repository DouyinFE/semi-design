---
localeCode: zh-CN
order: 61
category: 展示类
title: Tooltip 工具提示
icon: doc-tooltip
width: 65%
brief: 工具提示用于对一个元素进行标识或者附上少量辅助信息，最典型的场景是向用户解释图标的含义、展示被截断的文本、显示图片的描述等。
---

## 代码演示

### 如何引入

```jsx import
import { Tooltip } from '@douyinfe/semi-ui';
```

### 注意事项

ToolTip 为了计算定位，需要获取到 children 的真实 DOM 元素，因此 ToolTip 类型目前支持如下两种类型的 children

1. 真实 dom 节点的 jsx 类型，如 span，div，p...
2. 使用 forwardRef 包裹后的函数式组件，将 props 与 ref 透传到真实的 dom 节点上

```jsx live=true hideInDSM
import React, { forwardRef } from 'react';
import { Tooltip } from '@douyinfe/semi-ui';

function Demo() {
    const Test = forwardRef((props, ref) => (
        <span {...props} ref={ref}>
            Test
        </span>
    ));
    return (
        <Tooltip content={'hi bytedance'}>
            <Test />
        </Tooltip>
    );
}
```

### 基本用法

你可以使用 Tooltip 包裹任何支持 `onClick`/`onMouseEnter`/`onMouseLeave` 的组件。

当然包裹的组件可能会绑定了自己的 `onClick`/`onMouseEnter`/`onMouseLeave` 等事件，这种情况下你需要为 Tooltip 选择合适的触发时机。

例如：

-   组件已经绑定了 `onClick` 事件，那么 Tooltip 的 `trigger` 参数值最好传 `hover`。
-   组件已经绑定了 `onMouseEnter`/`onMouseLeave` 事件，Tooltip 的 `trigger` 参数值最好传 `click` 。

```jsx live=true hideInDSM
import React from 'react';
import { Tooltip, Tag } from '@douyinfe/semi-ui';

function Demo() {
    return (
        <Tooltip content={'hi bytedance'}>
            <Tag>悬停此处</Tag>
        </Tooltip>
    );
}
```

### 触发时机

-   配置触发展示的时机，默认为 `hover`，可选 `hover`/`focus`/`click`/`custom`
-   设为 `custom` 时，需要配合 `visible` 属性使用，此时显示与否完全受控

```jsx live=true hideInDSM
import React, { useState } from 'react';
import { Tooltip, Button, ButtonGroup, Input } from '@douyinfe/semi-ui';

function Demo() {
    const [visible, setVisible] = useState(false);
    // container 需要设置 position: relative
    const getPopupContainer = () => document.querySelector('#tooltip-container');

    return (
        <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }} id="tooltip-container">
            <div style={{ width: '150%', height: '150%', paddingLeft: 50, paddingTop: 50 }}>
                <Tooltip content={'hi bytedance'} getPopupContainer={getPopupContainer}>
                    <Button style={{ marginBottom: 20 }}>悬停显示</Button>
                </Tooltip>
                <br />
                <Tooltip content={'hi bytedance'} trigger="click" getPopupContainer={getPopupContainer}>
                    <Button style={{ marginBottom: 20 }}>点击显示</Button>
                </Tooltip>
                <br />
                <Tooltip content={'hi bytedance'} trigger="focus" getPopupContainer={getPopupContainer}>
                    <Input style={{ width: 100, marginBottom: 20 }} placeholder="聚焦显示" />
                </Tooltip>
                <br />
                <Tooltip
                    content={'hi bytedance'}
                    trigger="custom"
                    visible={visible}
                    getPopupContainer={getPopupContainer}
                >
                    <span style={{ display: 'inline-block' }}>
                        <ButtonGroup>
                            <Button onClick={() => setVisible(true)}>受控显示</Button>
                            <Button onClick={() => setVisible(false)}>受控隐藏</Button>
                        </ButtonGroup>
                    </span>
                </Tooltip>
            </div>
        </div>
    );
}
```

### 覆盖特定样式

你可以通过 className、style 为弹出层配置特定样式，例如覆盖默认的 maxWidth （280px）
```jsx live=true
import React from 'react';
import { Tooltip, Tag } from '@douyinfe/semi-ui';

() => {
    return (
        <Tooltip
            style={{
                maxWidth: 320
            }}
            className='another-classname'
            content={'hi semi semi semi semi semi semi semi'}
        >
            <Tag style={{ marginRight: '8px' }}>Custom Style And ClassName</Tag>
        </Tooltip>
    );
};
```

### 位置

支持弹出层在不同方向展示，共有 12 个方向

```jsx live=true hideInDSM
import React from 'react';
import { Tooltip, Tag } from '@douyinfe/semi-ui';

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
        <div style={{ paddingLeft: 40 }}>
            <div style={{ marginLeft: 40, whiteSpace: 'nowrap' }}>
                {tops.map((pos, index) => (
                    <Tooltip
                        content={
                            <article>
                                <p>hi bytedance</p>
                                <p>hi bytedance</p>
                            </article>
                        }
                        position={Array.isArray(pos) ? pos[0] : pos}
                        key={index}
                    >
                        <Tag style={{ marginRight: '8px' }}>{Array.isArray(pos) ? pos[1] : pos}</Tag>
                    </Tooltip>
                ))}
            </div>
            <div style={{ width: 40, float: 'left' }}>
                {lefts.map((pos, index) => (
                    <Tooltip
                        content={
                            <article>
                                <p>hi bytedance</p>
                                <p>hi bytedance</p>
                            </article>
                        }
                        position={Array.isArray(pos) ? pos[0] : pos}
                        key={index}
                    >
                        <Tag style={{ marginBottom: '8px' }}>{Array.isArray(pos) ? pos[1] : pos}</Tag>
                    </Tooltip>
                ))}
            </div>
            <div style={{ width: 40, marginLeft: 180 }}>
                {rights.map((pos, index) => (
                    <Tooltip
                        content={
                            <article>
                                <p>hi bytedance</p>
                                <p>hi bytedance</p>
                            </article>
                        }
                        position={Array.isArray(pos) ? pos[0] : pos}
                        key={index}
                    >
                        <Tag style={{ marginBottom: '8px' }}>{Array.isArray(pos) ? pos[1] : pos}</Tag>
                    </Tooltip>
                ))}
            </div>
            <div style={{ marginLeft: 40, clear: 'both', whiteSpace: 'nowrap' }}>
                {bottoms.map((pos, index) => (
                    <Tooltip
                        content={
                            <article>
                                <p>hi bytedance</p>
                                <p>hi bytedance</p>
                            </article>
                        }
                        position={Array.isArray(pos) ? pos[0] : pos}
                        key={index}
                    >
                        <Tag style={{ marginRight: '8px' }}>{Array.isArray(pos) ? pos[1] : pos}</Tag>
                    </Tooltip>
                ))}
            </div>
        </div>
    );
}
```

### 渲染至指定 DOM

传入 `getPopupContainer`，弹层将会渲染至该函数返回的 DOM 中。

**需要注意的是：** 返回的容器如果不是 `document.body`，**`position` 需要设为 `"relative"`**（版本 >= 0.18.0）。

```jsx live=true hideInDSM
import React from 'react';
import { Tooltip, Tag } from '@douyinfe/semi-ui';

function Demo() {
    return (
        <div id="tooltip-wrapper" style={{ position: 'relative' }}>
            <Tooltip
                position="right"
                content="浮层被渲染至#tooltip-wrapper元素中"
                trigger="click"
                getPopupContainer={() => document.querySelector('#tooltip-wrapper')}
            >
                <Tag>点击此处</Tag>
            </Tooltip>
        </div>
    );
}
```

### 指向元素中心

**版本：**>= 0.34.0

在**显示小三角**的条件（`showArrow=true`）下，可以传入 `arrowPointAtCenter=true` 使得小三角始终指向元素中心位置。

```jsx live=true hideInDSM
import React from 'react';
import { Tooltip, Tag } from '@douyinfe/semi-ui';

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
        <div style={{ paddingLeft: 40 }}>
            <div style={{ marginLeft: 40, whiteSpace: 'nowrap' }}>
                {tops.map((pos, index) => (
                    <Tooltip
                        showArrow
                        arrowPointAtCenter
                        content={
                            <article>
                                Hi ByteDancer, this is a tooltip.
                                <br /> We have 2 lines.
                            </article>
                        }
                        position={Array.isArray(pos) ? pos[0] : pos}
                        key={index}
                    >
                        <Tag style={{ marginRight: '8px' }}>{Array.isArray(pos) ? pos[1] : pos}</Tag>
                    </Tooltip>
                ))}
            </div>
            <div style={{ width: 40, float: 'left' }}>
                {lefts.map((pos, index) => (
                    <Tooltip
                        showArrow
                        arrowPointAtCenter
                        content={
                            <article>
                                Hi ByteDancer, this is a tooltip.
                                <br /> We have 2 lines.
                            </article>
                        }
                        position={Array.isArray(pos) ? pos[0] : pos}
                        key={index}
                    >
                        <Tag style={{ marginBottom: '8px' }}>{Array.isArray(pos) ? pos[1] : pos}</Tag>
                    </Tooltip>
                ))}
            </div>
            <div style={{ width: 40, marginLeft: 180 }}>
                {rights.map((pos, index) => (
                    <Tooltip
                        showArrow
                        arrowPointAtCenter
                        content={
                            <article>
                                Hi ByteDancer, this is a tooltip.
                                <br /> We have 2 lines.
                            </article>
                        }
                        position={Array.isArray(pos) ? pos[0] : pos}
                        key={index}
                    >
                        <Tag style={{ marginBottom: '8px' }}>{Array.isArray(pos) ? pos[1] : pos}</Tag>
                    </Tooltip>
                ))}
            </div>
            <div style={{ marginLeft: 40, clear: 'both', whiteSpace: 'nowrap' }}>
                {bottoms.map((pos, index) => (
                    <Tooltip
                        showArrow
                        arrowPointAtCenter
                        content={
                            <article>
                                Hi ByteDancer, this is a tooltip.
                                <br /> We have 2 lines.
                            </article>
                        }
                        position={Array.isArray(pos) ? pos[0] : pos}
                        key={index}
                    >
                        <Tag style={{ marginRight: '8px' }}>{Array.isArray(pos) ? pos[1] : pos}</Tag>
                    </Tooltip>
                ))}
            </div>
        </div>
    );
}
```

### 搭配 Popover 或 Popconfirm 使用

Tooltip、Popconfirm、Popover 都需要劫持 children 的相关事件（onMouseEnter/onMouseLeave/onClick....），用于配置 trigger。  
如果直接嵌套使用的话，会使外层 trigger 失效。  
需要在中间加一层元素（div 或 span）以防止 trigger 的事件劫持失效。

```jsx live=true hideInDSM
import React from 'react';
import { Tooltip, Popconfirm, Button } from '@douyinfe/semi-ui';

() => (
    <Popconfirm content="是否确认删除">
        <span style={{ display: 'inline-block' }}>
            <Tooltip content={'删除评价'}>
                <Button type="danger">删除</Button>
            </Tooltip>
        </span>
    </Popconfirm>
);
```

### 仅当内容宽度超出时展示 Tooltip

Semi 为这种场景提供了 Typography 组件，可以更简单快捷地满足需求。不需要自己再对 Tooltip 的出现做条件判断，详细的使用请参考[Typography 组件文档](/zh-CN/basic/typography#%E7%9C%81%E7%95%A5%E6%96%87%E6%9C%AC)

```jsx live=true hideInDSM
import React from 'react';
import { Typography } from '@douyinfe/semi-ui';

function Demo() {
    const { Paragraph, Title, Text } = Typography;

    return (
        <div>
            <Title heading={5} ellipsis={{ showTooltip: true }} style={{ width: 250 }}>
                是一个很长很长很长很长5号标题
            </Title>
            <br />
            <Text link ellipsis={{ showTooltip: true, pos: 'middle' }} style={{ width: 150 }}>
                是一个很长很长很长很长的链接
            </Text>
            <br />
            <Paragraph
                ellipsis={{ rows: 3, showTooltip: { type: 'popover', opts: { style: { width: 300 } } } }}
                style={{ width: 300 }}
            >
                多行截断，展示 Popover：Semi Design 是由互娱社区前端团队与 UED
                团队共同设计开发并维护的设计系统。设计系统包含设计语言以及一整套可复用的前端组件，帮助设计师与开发者更容易地打造高质量的、用户体验一致的、符合设计规范的
                Web 应用。
            </Paragraph>
        </div>
    );
}
```

## API 参考

---

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| autoAdjustOverflow | 弹出层被遮挡时是否自动调整方向 | boolean | true |  |
| arrowPointAtCenter | “小三角”是否指向元素中心，需要同时传入"showArrow=true" | boolean | true | **0.34.0** |
| content | 弹出层内容 | string\|ReactNode |  |  |
| className | 弹出层的样式名 | string |  |  |
| clickToHide | 点击弹出层及内部任一元素时是否自动关闭弹层 | boolean | false | **0.24.0** |
| getPopupContainer | 指定父级 DOM，弹层将会渲染至该 DOM 中，自定义需要设置 `position: relative` | function():HTMLElement | () => document.body |  |
| mouseEnterDelay | 鼠标移入后，延迟显示的时间，单位毫秒（仅当 trigger 为 hover/focus 时生效） | number | 50 |  |
| mouseLeaveDelay | 鼠标移出后，延迟消失的时间，单位毫秒（仅当 trigger 为 hove/focus 时生效），不小于 mouseEnterDelay | number | 50 |  |
| motion | 是否展示弹出层动画 | boolean\|object | true |  |
| position | 弹出层展示位置，可选值：`top`, `topLeft`, `topRight`, `left`, `leftTop`, `leftBottom`, `right`, `rightTop`, `rightBottom`, `bottom`, `bottomLeft`, `bottomRight` | string | 'top' |  |
| prefixCls | 弹出层 wrapper div 的 `className` 前缀，设置该项时，弹出层将不再带 Tooltip 的样式 | string | 'semi-tooltip' |  |
| rePosKey | 可以更新该项值手动触发弹出层的重新定位 | string\|number |  |  |
| style    | 弹出层的内联样式 | object |  |  |
| spacing | 弹出层与 `children` 元素的距离，单位 px | number | 8 |  |
| showArrow | 是否显示箭头三角形 | boolean | true |  |
| stopPropagation | 是否阻止弹层上的点击事件冒泡 | boolean | false | **0.34.0** |
| transformFromCenter | 是否从包裹的元素水平或垂直中心处变换，该参数仅影响动效变换的 `transform-origin`，一般无需改动 | boolean | true |  |
| trigger | 触发展示的时机，可选值：`hover` / `focus` / `click` / `custom` | string | 'hover' |  |
| visible | 是否展示弹出层 | boolean |  |  |
| wrapperClassName | 当 children 为 disabled ，或者 children 为多个元素时，外层将会包裹一层 span 元素，该 api 用于设置此 span 的样式类名 | string |  | **1.32.0** |
| wrapperId | 弹出层 wrapper 节点的 id，trigger 的 aria 属性指向此 id，若不设置组件会随机生成一个 id | string |  | 2.11.0  |
| zIndex | 弹层层级 | number | 1060 |  |
| onVisibleChange | 弹出层展示/隐藏时触发的回调 | function(isVisible:boolean) |  |  |
| onClickOutSide | 当弹出层处于展示状态，点击非Children、非浮层内部区域时的回调（仅trigger为custom、click时有效）| function(e:event) |  | **2.1.0** |

## Accessibility

### ARIA

- Tooltip 具有 `tooltip` role，遵循 [WAI-ARIA](https://www.w3.org/TR/wai-aria-practices/#tooltip) 规范中对于 Tooltip 的定义
- Tooltip 的 content 与 children
  - 关于 content
      - content 的 wrapper 会被自动添加 id 属性，用于与 children 的 `aria-describedby` 匹配，关联 content 与 children
  - 关于 children
       - Tooltip 的内容（content）与其触发器（children）之间应当具有显式联系。Tooltip 会自动为 children 元素添加 `aria-describedby` 属性，值为 content wraper的 id
       - 若你 Tooltip的children 是Icon，不包含可见文本，我们推荐你在 children 上添加 `aria-label` 属性进行相应描述

```js
// Good practices, add aria-label to description tooltip children
/* eslint-disable */
<Tooltip content={<p id='description'>Edit your setting</p>}>
    <IconSetting aria-label='Settings'> 
    </IconSetting>
</Tooltip>
```

## 设计变量

<DesignToken/>

## FAQ

-   **为什么 Tooltip content 配置很长很长的内容时，会超出显示 / 不默认配置 word-break 样式?**  
    不同语言内容（纯英文、中文、中英文混合）对 word-break 的需求不太一致，所以组件层没有做这个预设。否则效果往往会适得其反，使用方可以根据自己当前语言需求，使用 CSS 进行设置。

<!-- ## 相关物料

```material
41
``` -->
