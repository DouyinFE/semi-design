---
localeCode: en-US
order: 64
category: Show
title: Tooltip
subTitle: Tooltip
icon: doc-tooltip
width: 65%
brief: Tooltip is used to identify an element or attach a small amount of auxiliary information. The most typical scenario is to explain the meaning of the icon to the user, display the truncated text, display the description of the picture, and so on.
---

## Demos

### How to import

```jsx import
import { Tooltip } from '@douyinfe/semi-ui';
```

### Cautions

In order to calculate the positioning, ToolTip needs to obtain the real DOM elements of the children, so the ToolTip type currently supports the following two types of children

1. The Jsx type of the real dom node, such as span, div, p...
2. Use the FunctionComponent wrapped by forwardRef to pass props and ref to the real dom node

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

### Basic Usage

You can use Tooltip to wrap any support `onClick`/`onMouseEnter`/`onMouseLeave` The components.

Of course, the components of the package may be bound to their own. `onClick`/`onMouseEnter`/`onMouseLeave` Wait for the event, in which case you need to choose the right Trigger time for Tooltip.

For example:

-   The component has been bound to the `onClick` event, so Tooltip's `trigger`parameter value is best passed to `hover`.
-   The component has been bound to the `onMouseEnter`/`onMouseLeave` event, and the `trigger` parameter value of Tooltip is best transmitted to `click`.

```jsx live=true hideInDSM
import React from 'react';
import { Tooltip, Tag } from '@douyinfe/semi-ui';

function Demo() {
    return (
        <Tooltip content={'hi bytedance'}>
            <Tag>Hover here</Tag>
        </Tooltip>
    );
}
```

### Trigger Timing

-   Configure the timing of the trigger display, the default is `hover`, optional `hover` / `focus` / `click` / `custom`
-   When set to `custom`, it needs to be used in conjunction with the `visible`attribute, at which point the display is completely controlled

```jsx live=true hideInDSM
import React, { useState } from 'react';
import { Tooltip, Button, ButtonGroup, Input } from '@douyinfe/semi-ui';

function Demo() {
    const [visible, setVisible] = useState(false);
    // Container needs to set position: relative
    const getPopupContainer = () => document.querySelector('#tooltip-container');

    return (
        <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }} id="tooltip-container">
            <div style={{ width: '150%', height: '150%', paddingLeft: 50, paddingTop: 50 }}>
                <Tooltip content={'hi bytedance'} getPopupContainer={getPopupContainer}>
                    <Button style={{ marginBottom: 20 }}>Hover to show</Button>
                </Tooltip>
                <br />
                <Tooltip content={'hi bytedance'} trigger="click" getPopupContainer={getPopupContainer}>
                    <Button style={{ marginBottom: 20 }}>Click to show</Button>
                </Tooltip>
                <br />
                <Tooltip content={'hi bytedance'} trigger="focus" getPopupContainer={getPopupContainer}>
                    <Input style={{ width: 150, marginBottom: 20 }} placeholder="Focus to show" />
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
                            <Button onClick={() => setVisible(true)}>Controlled show</Button>
                            <Button onClick={() => setVisible(false)}>Controlled hide</Button>
                        </ButtonGroup>
                    </span>
                </Tooltip>
            </div>
        </div>
    );
}
```

### Override Style

Configure specific styles for the pop-up layer through the `className` and `style` API, such as overriding the default maxWidth (280px)

```jsx live=true
import React from 'react';
import { Tooltip, Tag } from '@douyinfe/semi-ui';

() => {
    return (
        <Tooltip
            style={{
                maxWidth: 320,
            }}
            className="another-classname"
            content={'hi semi semi semi semi semi semi semi'}
        >
            <Tag style={{ marginRight: '8px' }}>Custom Style And ClassName</Tag>
        </Tooltip>
    );
};
```

### Position

Support pop-up layers are displayed in different directions in 12 directions

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

### Render to Specified DOM

With `getPopupContainer` the bullet layer will be rendered to the DOM returned by the function.

**It should be noted that:** The returned container, if not `document.body`,**`position` Will be set by default `"relative"`**(Version > = 0.18.0).

```jsx live=true hideInDSM
import React from 'react';
import { Tooltip, Tag } from '@douyinfe/semi-ui';

function Demo() {
    return (
        <div id="tooltip-wrapper" style={{ position: 'relative' }}>
            <Tooltip
                position="right"
                content="Popup will be rendered in element#tooltip-wrapper"
                trigger="click"
                getPopupContainer={() => document.querySelector('#tooltip-wrapper')}
            >
                <Tag>Click here</Tag>
            </Tooltip>
        </div>
    );
}
```

### Arrow Point at Center

**Version:** >= 0.34.0

Under the condition of **showArrow=true**, you can pass in `arrowPointAtCenter=true` so that the small triangle always points to the center of the element.

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

### Use with Popver or Popconfirm

Tooltip, Popconfirm, and Popover all need to hijack related events of children (onMouseEnter / onMouseLeave / onClick ....) to configure `trigger`. If used directly, it will invalidate the outer trigger.  
Need to add a layer of elements (div or span) in the middle to prevent trigger event hijack failure.

```jsx live=true hideInDSM
import React from 'react';
import { Popconfirm, Tooltip, Button } from '@douyinfe/semi-ui';

() => (
    <Popconfirm content="Confirm Delete">
        <span style={{ display: 'inline-block' }}>
            <Tooltip content={'Delete Comment'}>
                <Button type="danger">Delete</Button>
            </Tooltip>
        </span>
    </Popconfirm>
);
```

## API Reference

---

| Properties | Instructions | Type | Default | Version |
| --- | --- | --- | --- | --- |
| autoAdjustOverflow | Whether the floating layer automatically adjusts its direction when it is blocked | boolean | true |  |
| arrowPointAtCenter | Whether the "small triangle" points to the center of the element, you need to pass in "showArrow = true" at the same time | boolean | true | **0.34.0** |
| className | Pop-up layer classname | string |  |  |
| content | Pop-up layer content | string | ReactNode |  |
| clickToHide | Whether to automatically close the elastic layer when clicking on the floating layer and any element inside | boolean | false | **0.24.0** |
| disableFocusListener | When trigger is `hover`, does not respond to the keyboard focus popup event, see details at [issue#977](https://github.com/DouyinFE/semi-design/issues/977) | boolean | false | **2.17.0** |
| getPopupContainer | Specifies the parent DOM, and the bullet layer will be rendered to the DOM | () => HTMLElement | () => document.body |
| margin | Calculate the added redundancy value when overflowing, see [issue#549](https://github.com/DouyinFE/semi-design/issues/549) | number ｜ { marginLeft: number; marginTop: number; marginRight: number; marginBottom: number } | 0 |  **2.23.0**|
| mouseEnterDelay | After the mouse is moved in, the display delay time, in milliseconds (only effective when the trigger is hover/focus) | number | 50 |  |
| mouseLeaveDelay | The time for the delay to disappear after the mouse is moved out, in milliseconds (only effective when the trigger is hover/focus), and is not less than mouseEnterDelay | number | 50 |  |
| motion | Whether to show the pop-up motion | boolean | true |  |
| position | Pop-up layer display position, optional value: `top`, `topLeft`, `topRight`, `left`, `leftTop`, `leftBottom`, `right`, `rightTop`, `rightBottom`, `bottom`, `bottomLeft`, `bottomRight` | string | 'top' |  |
| prefixCls | The `className` prefix of the pop-up layer wrapper div. When this item is set, the pop-up layer will no longer have the style of Tooltip. | string | 'semi-tooltip ' |  |
| preventScroll | Indicates whether the browser should scroll the document to display the newly focused element, acting on the focus method inside the component, excluding the component passed in by the user | boolean |  |  |
| rePosKey | This value can be updated to manually trigger the repositioning of the pop-up layer. | string | number |  |
| style | Pop-up layer inline style | object |  |  |
| spacing | The distance between the pop-up layer and the `children` element | number |  |  |
| showArrow | Does it show an arrow triangle? | boolean | true |  |
| stopPropagation | Whether to prevent click events on the bomb layer from bubbling | boolean | false | **0.34.0** |
| transformFromCenter | Whether to transform from the horizontal or vertical center of the element of the package, this parameter affects only the `tansform-origin 'of the dynamic effect transformation and generally does not need to be changed | boolean | true |
| trigger | Timing of triggering display, optional value: `hover`/`focus`/`click`/`custom` | string | 'hover' |  |
| visible | Whether to show the pop-up layer | boolean |  |  |
| wrapperClassName | When children are disabled or children are multiple elements, the outer layer will wrap a layer of span elements, and the api is used to set the style class name of this span | string |  | 1.32.0 |
| wrapperId | The id of the wrapper node of the popup layer. The aria attribute of the trigger points to this id. | string |  | 2.11.0  |
| zIndex              | Bullet levels.                                                                                                                                                                                                                               | number                      | 1060                |            |
| onVisibleChange     | A callback triggered when the pop-up layer is displayed/hidden                                                                                                                                                                               | (isVisible: boolean) => void |                     |            |
| onClickOutSide      | Callback when the pop-up layer is in the display state and the non-Children, non-floating layer inner area is clicked (only valid when trigger is custom, click)                                                                             | (e:event) => void           |                     | **2.1.0** |


## Accessibility

### ARIA

- Tooltip has a tooltip role, following the definition of Tooltip in the [WAI-ARIA](https://www.w3.org/TR/wai-aria-practices/#tooltip) specification
- Tooltip's content and children
  - about content
      - The wrapper of content will be automatically added with id attribute to match the `aria-describedby` of children and associate content with children
  - about children
       - There should be an explicit connection between the content of the Tooltip and its children. Tooltip will automatically add the `aria-describedby` attribute to the children element, the value is the id of the content wraper. 
       - If the children of your Tooltip are Icon and do not contain visible text, we recommend that you add the `aria-label` attribute to the children to describe accordingly 

```js
// Good practices, add aria-label to description tooltip children
/* eslint-disable */
<Tooltip content={<p id='description'>Edit your setting</p>}>
    <IconSetting aria-label='Settings'> 
    </IconSetting>
</Tooltip>
```

## Content Guidelines

- Only display information description and guidance, do not display error information
- Only extra links and buttons not in tooltip
- Try to simplify the description to one sentence without showing punctuation marks

## Design Tokens

<DesignToken/>

## FAQ

-   **Why Tooltip does not set style word-break to all or word?**  
    Content in difference languages (e.g. English, Chinese, combination of English and Chinese) may require different styles in terms of word-break, so Semi does not use a default setting. You could use corresponding CSS styles to your own needs.

<!-- ## Related Material

```material
41
``` -->
