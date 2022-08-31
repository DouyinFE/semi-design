---
localeCode: en-US
order: 66
category: Feedback
title:  Popconfirm
subTitle: Popconfirm
icon: doc-popconfirm
brief: Used when the operation of the target element requires further confirmation from the user. Compared with Popover, it has a built-in series of configurable action buttons. Compared with Modal, it does not force full-screen centering, and the interaction is lighter.
---


## Demos

### How to import

```jsx import
import { Popconfirm } from '@douyinfe/semi-ui';
```
### Basic Usage

```jsx live=true
import React from 'react';
import { Popconfirm, Button, Toast } from '@douyinfe/semi-ui';

() => {
    const onConfirm = () => {
        Toast.success('Confirm save!');
    };

    const onCancel = () => {
        Toast.warning('Cancel save!');
    };
    return (
        <Popconfirm
            title="Are you sure you want to save this modification?"
            content="This modification will be irreversible"
            onConfirm={onConfirm}
            onCancel={onCancel}
        >
            <Button>Save</Button>
        </Popconfirm>
    );
};
```

### Type collocation

Developers can use scenario-based `OK Type`/`Cancel Type`/`icon` Equal parameters are matched with different styles of bubble confirmation boxes.

```jsx live=true
import React, { useState } from 'react';
import { Popconfirm, Radio, RadioGroup, Button } from '@douyinfe/semi-ui/';
import { IconAlertTriangle } from '@douyinfe/semi-icons';

function TypesConfirmDemo(props = {}) {
    const typeMap = {
        default: {
            icon: <IconAlertTriangle size="extra-large" />,
        },
        warning: {
            icon: <IconAlertTriangle style={{ color: 'var(--semi-color-warning)' }} size="extra-large" />,
        },
        danger: {
            okType: 'danger',
            icon: <IconAlertTriangle style={{ color: 'var(--semi-color-danger)' }} size="extra-large" />,
        },
        tertiary: {
            icon: <IconAlertTriangle style={{ color: 'var(--semi-color-tertiary)' }} size="extra-large" />,
        },
    };

    const keys = Object.keys(typeMap);
    const [type, setType] = useState('default');
    const [visible, _setVisible] = useState(true);

    const changeType = e => {
        const type = e && e.target && e.target.value;
        if (type && keys.includes(type)) {
            setType(type);
        }
    };

    const setVisible = visible => _setVisible(visible);
    const toggleVisible = () => setVisible(!visible);

    return (
        <div>
            <RadioGroup onChange={changeType} value={type} style={{ marginTop: 14, marginBottom: 14 }}>
                {keys.map(key => (
                    <Radio key={key} value={key}>
                        <strong style={{ color: `var(--semi-color-${key === 'default' ? 'primary' : key})` }}>{key}</strong>
                    </Radio>
                ))}
            </RadioGroup>
            <div>
                <Popconfirm
                    {...typeMap[type]}
                    visible={visible}
                    onVisibleChange={setVisible}
                    trigger="custom"
                    title="Are you sure to save this modification?"
                    content="This modification will be irreversible"
                >
                    <Button onClick={toggleVisible}>Click here</Button>
                </Popconfirm>
            </div>
        </div>
    );
}
```

### Use with Tooltip or Popover

Please refer to [Use with Tooltip/Popover](/en-US/show/tooltip#Use-with-Popver-or-Popconfirm)

## API Reference

| Properties         | Instructions                                                                                                                                                          | Type                       | Default             | Version           |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- | ------------------- | ----------------- |
| arrowPointAtCenter | Whether the "small triangle" points to the center of the element, you need to pass in "showArrow = true" at the same time                                             | boolean                    | false               | **0.34.0** |
| cancelText         | Cancel button text                                                                                                                                                    | string                     | "Cancel"            |
| cancelButtonProps  | Properties for cancel button                                                                                                                                          | object                     |                     | **0.29.0**        |
| cancelType         | Cancel button type                                                                                                                                                    | string                     | "tertiary"          |
| content            | Content displayed                                                                                                                                                     | string \| ReactNode        |                     |
| defaultVisible     | Bubble box is displayed by default                                                                                                                                    | boolean                    |                     | **0.19.0**        |
| disabled           | Click on the Pop confirmation box to see if the bubbles pop up.                                                                                                       | boolean                    | false               |
| getPopupContainer  | Specify the parent DOM, and the pop-up layer will be rendered into the DOM. Customization needs to set `position: relative`                                                                                                       | Function():HTMLElement           | () => document.body |
| icon               | Custom pop bubble Icon icon                                                                                                                                           |  ReactNode        | <IconAlertTriangle size="extra-large" />    |
| motion             | Whether there is animation when the drop-down list appears/hidden. You can customize animation by passing in an object that conforms to the structure | boolean\|object | true |
| position           | Directions, optional values: `top`, `topLeft`, `topRight`, `leftTop`, `leftBottom`, `rightTop`, `rightTop`, `rightBottom`, `bottomLeft`, `bottomRight`, `bottomRight` | string                     | "bottomLeft"        |
| okText             | Confirm button text                                                                                                                                | string                           | "Confirm"              |
| okType             | Confirm button type                                                                                                                                | string                           | "primary"           |
| okButtonProps      | Confirm button props                                                                                                                            | object                           |                     | **0.29.0**        |
| showArrow          | Whether to show arrow triangle                                                                                                                         | boolean                          | false               |                   |
| stopPropagation    | Whether to prevent the click event on the bomb layer from bubbling                                                                                                                | boolean                          | true                | **0.34.0** |
| position           | Popup layer position，Optional value：`top`,`topLeft`,`topRight`,`left`,`leftTop`,`leftBottom`,<br/>`right`,`rightTop`,`rightBottom`,`bottom`,`bottomLeft`,`bottomRight` | string                           | "bottomLeft"        |
| title              | Displayed title                                                                                                                                  | string\|ReactNode                |                     |
| trigger            | Timing to trigger the display, optional value：hover / focus / click / custom                                                                                         | string                |   'click'                  |
| visible            | Whether the bubble box displays controlled attributes                                                                                                                   | boolean                          |                     | **0.19.0**        |
| zIndex             | Floating layer z-index value                                                                                                                                          | number                     | 1030                |
| onConfirm          | Click the confirmation button to call back.                                                                                                                           | (e) => void                |                     |
| onCancel           | Click the Cancel button to call back.                                                                                                                                 | (e) => void                |                     |
| onVisibleChange    | Bubble box toggle shows hidden callbacks                                                                                                                              | (visible: boolean) => void | () => {}            | **0.19.0**        |
| onClickOutSide     | Callback when the pop-up layer is in the display state and the non-Children, non-floating layer inner area is clicked                                                 | (e: event) => void         |                     | **2.1.0**        |
## Design Tokens
<DesignToken/>

## FAQ

- **Why does the Popconfirm floating layer lose its width and wrap unexpectedly when the width is not enough near the screen border?**

    After Chromium 104, the wrapping rendering strategy when the width of the screen border text is not enough has changed. For details, see [issue #1022](https://github.com/DouyinFE/semi-design/issues/1022), the semi-side has been This problem was fixed in v2.17.0.