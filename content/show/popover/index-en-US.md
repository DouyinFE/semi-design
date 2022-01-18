---
localeCode: en-US
order: 54
category: Show
title: Popover
subTitle: Popover
icon: doc-popover
brief: Click / mouse to move into the element and pop up the bubble card floating layer.
---

## When to Use

When the target element has further description and related operations, it can be included in the card and displayed according to the user's operational behavior.

The difference with Tooltip is that users can operate on elements on the floating layer, so it can carry more complex content, such as links or buttons.

## Demos

### How to import

```jsx import
import { Popover } from '@douyinfe/semi-ui';
```

### Basic Usage

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
            <Tag>Hover here</Tag>
        </Popover>
    );
}
```

### Pop-up Position

Support twelve directions.

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

### Controlled Display

In this scenario, Popover's display is completely at the control of parameter `visible`.

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
                        <Button onClick={this.toggleShow}>Click me</Button>
                    </Popover>
                </div>
            </div>
        );
    }
}
```

### Show Small Triangle

**Version: >= 0.19.0**

Popover also supports the display of a small triangle.

> The floating layer in this mode has a default style that you can overwrite by passing the style parameters.

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

### Arrow Point at Center

**Version: >= 0.34.0**

Under the condition of **showArrow=true**, you can pass in `arrowPointAtCenter=true` so that the small triangle always points to the center of the element.

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

### Set Floating Layer Background Color

If you need to customize the background color or border color of the floating layer, please **Be sure to set `backgroundColor` and `borderColor` properties in `style` separately.** This enables the "small triangle" to apply the same background color and border color.

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
            trigger="custom"
            position='right'
            visible
            showArrow
            style={{
                backgroundColor: 'rgba(var(--semi-blue-4),1)',
                borderColor: 'rgba(var(--semi-blue-4),1)',
                color: 'var(--semi-color-white)',
                borderWidth: 1,
                borderStyle: 'solid',
            }}
        >
            <Tag>Click here</Tag>
        </Popover>
    );
}
```

### Use with Tooltip or Popconfirm

Please refer to [Use with Tooltip/Popconfirm](/en-US/show/tooltip#%E6%90%AD%E9%85%8D%20Popover%20%E6%88%96%20Popconfirm%20%E4%BD%BF%E7%94%A8)

## API Reference

| Properties | Instructions | Type | Default | Version |
| --- | --- | --- | --- | --- |
| autoAdjustOverflow | Whether to automatically adjust the expansion direction of the floating layer for automatic adjustment of the expansion direction during edge occlusion | boolean | true |
| arrowPointAtCenter | Whether the "small triangle" points to the center of the element, you need to pass in "showArrow = true" at the same time | boolean | true | **0.34.0** |
| content | Content displayed | string \| ReactNode |  |
| clickToHide | Whether to automatically close the elastic layer when clicking on the floating layer and any element inside | boolean | false | **0.24.0** |
| getPopupContainer | Specifies the parent DOM, and the bullet layer will be rendered to the DOM, you need to set 'position: relative` | () => HTMLElement | () => document.body |
| mouseEnterDelay | After the mouse is moved in, the display delay time, in milliseconds (only effective when the trigger is hover/focus) | number | 50 |  |
| mouseLeaveDelay | The time for the delay to disappear after the mouse is moved out, in milliseconds (only effective when the trigger is hover/focus) | number | 50 |  |
| rePosKey | You can update the value of this item to manually trigger the repositioning of the pop-up layer | string\|number |  |  |
| visible | Display popup or not | boolean |  |
| position | Directions, optional values: `top`, `topLeft`, `topRight`, `leftTop`, `leftBottom`, `rightTop`, `rightTop`, `rightBottom`, `bottomLeft`, `bottomRight`, `bottomRight` | string | "bottom" |
| spacing | The distance between the out layer and the children element, in px | number | 4(while showArrow=false) 10(while showArrow=true) |  |
| showArrow | Display little arrow or not | boolean |  |
| trigger | Trigger mode, optional value: `hover`, `focus`, `click`, `custom` | string | 'hover' |
| stopPropagation | Whether to prevent click events on the bomb layer from bubbling | boolean | false | **0.34.0** |
| zIndex | Floating layer z-index value | number | 1030 |
| onVisibleChange | A callback triggered when the pop-up layer is displayed / hidden | (isVisble: boolean) => void |  |
| onClickOutSide  | Callback when the pop-up layer is in the display state and the non-Children, non-floating layer inner area is clicked (only valid when trigger is custom, click) | (e:event) => void | | **2.1.0** |

## Accessibility

### ARIA

-  About role
   - If the trigger is set to `click`、`custom`, the PopoverContent element has role set to `dialog`.
   - If the trigger is set to hover, it has role set to `tooltip`.
- Popover's content
   - The content wrapper will be automatically added with the id attribute
- Popover's children 
  - Will be automatically added [aria-expanded](https://www.w3.org/TR/wai-aria-1.1/#aria-expanded) attribute, when Popover is visible, the attribute value is `true`, when invisible Is `false`
  - Will be automatically added [aria-haspopup](https://www.w3.org/TR/wai-aria-1.1/#aria-haspopup) attribute, which is `dialog`
  - Will be automatically added [aria-controls](https://www.w3.org/TR/wai-aria-1.1/#aria-controls) attribute, which is the id of the content wrapper

## Design Tokens

<DesignToken/>
