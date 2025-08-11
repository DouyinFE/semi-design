---
localeCode: en-US
order: 87
category: Basic
title:  Feedback
icon: doc-divider
brief: Quick feedback component
---

## Demos

### How to import

Feedback Supported since 2.85.0.

```jsx import
import { Feedback } from '@douyinfe/semi-ui';
```

### Basic usage

Use `visible` to set whether to display or not. The default feedback display content is in emoji form. The currently selected content can be obtained through `onValueChange`.

```jsx live=true
import React, { useState, useCallback } from 'react';
import { Feedback, Button } from '@douyinfe/semi-ui';

() => {
    const [visible, setVisible] = useState(false);
    const handleOk = useCallback(() => setVisible(false), []);
    const handleCancel = useCallback(() => setVisible(false), []);
    const onValueChange = useCallback((value) => {
        console.log('emoji value', value);
    });

    return (<>
        <Button onClick={() => setVisible(!visible)} >
            Show feedback: Popup, emoji
        </Button>
        <Feedback
            title="What is your rating of this product?"
            visible={visible}
            onOk={handleOk}
            onCancel={handleCancel}
            onValueChange={onValueChange}
        />
    </>);
};
```

### Text type

Set `type` to `text` to get feedback in the form of a multi-line input box, and set the parameters of the multi-line input box through `textAreaProps`.

```jsx live=true
import React, { useState, useCallback } from 'react';
import { Feedback, Button } from '@douyinfe/semi-ui';

() => {
    const [visible, setVisible] = useState(false);
    const handleOk = useCallback(() => setVisible(false), []);
    const handleCancel = useCallback(() => setVisible(false), []);

    return (<>
        <Button onClick={() => setVisible(!visible)} >
            Show feedback: Popup, text
        </Button>
        <Feedback
            type="text"
            textAreaProps={{ maxCount: 200 }}
            title="What is your suggestion of this product?"
            visible={visible}
            onOk={handleOk}
            onCancel={handleCancel}
        />
    </>);
};
```

### Single choice feedback

Set `type` to `radio` to get feedback in the form of a single selection, and set the parameters of the multi-line input box through `radioProps`.

```jsx live=true
import React, { useState, useCallback } from 'react';
import { Feedback, Button } from '@douyinfe/semi-ui';

() => {
    const [visible, setVisible] = useState(false);
    const handleOk = useCallback(() => setVisible(false), []);
    const handleCancel = useCallback(() => setVisible(false), []);

    return (<>
        <Button onClick={() => setVisible(!visible)} >
            Show feedback: Popup, radio
        </Button>
        <Feedback
            type="radio"
            radioProps={{
                options: ['Guest', 'Developer', 'Maintainer'],
            }}
            title="What is your role?"
            visible={visible}
            onOk={handleOk}
            onCancel={handleCancel}
        />
    </>);
};
```

### Multiple choice feedback

Set `type` to `checkbox` to obtain feedback in the form of multiple selections, and set the parameters of the multi-line input box through `checkboxProps`.

```jsx live=true
import React, { useState, useCallback } from 'react';
import { Feedback, Button } from '@douyinfe/semi-ui';

() => {
    const [visible, setVisible] = useState(false);
    const handleOk = useCallback(() => setVisible(false), []);
    const handleCancel = useCallback(() => setVisible(false), []);

    return (<>
        <Button onClick={() => setVisible(!visible)} >
            Show feedback: Popup, checkbox
        </Button>
        <Feedback
            type="checkbox"
            checkboxProps={{
                options: ['Douyin', ' Huoshan', 'doubao']
            }}
            title="Which products you choose?"
            visible={visible}
            onOk={handleOk}
            onCancel={handleCancel}
        />
    </>);
};
```

### Customized feedback content

Set `type` to `custom` to obtain feedback in the form of multiple selections, and set the parameters of the multi-line input box through `renderContent`.

```jsx live=true
import React, { useState, useCallback } from 'react';
import { Feedback, Button, TextArea } from '@douyinfe/semi-ui';

() => {
    const [visible, setVisible] = useState(false);
    const [value, setValue] = useState(value);
    const handleOk = useCallback(() => setVisible(false), []);
    const handleCancel = useCallback(() => setVisible(false), []);
    const onTextAreaChange = useCallback((value) => {
        setValue(value);
    }, []);
    const renderContent = useCallback(() => {
        return <>
            <span>This is a custom content</span>
            <TextArea
                value={value}
                onChange={onTextAreaChange}
            />
        </>;
    }, [onTextAreaChange]);

    return (<>
        <Button onClick={() => setVisible(!visible)} >
            Show Feedback: Popup, custom
        </Button>
        <Feedback
            type="custom"
            title="What is your suggestion?"
            visible={visible}
            onOk={handleOk}
            onCancel={handleCancel}
            renderContent={renderContent}
        />
    </>);
};
```

### Modal

The form of feedback can be passed through `mode`, the default is `popup`, set to `modal` to get the display in the form of modal dialog box.

```jsx live=true
import React, { useState, useCallback } from 'react';
import { Feedback, Button } from '@douyinfe/semi-ui';

() => {
    const [visible, setVisible] = useState(false);
    const handleOk = useCallback(() => setVisible(false), []);
    const handleCancel = useCallback(() => setVisible(false), []);
    const onValueChange = useCallback((value) => {
        console.log('emoji value', value);
    });

    return (<>
        <Button onClick={() => setVisible(!visible)} >
            Show: Modal, emoji
        </Button>
        <Feedback
            mode="modal"
            title="Why did you choose this rating?"
            visible={visible}
            onOk={handleOk}
            onCancel={handleCancel}
            onValueChange={onValueChange}
        />
    </>);
};
```

## API reference

| Properties | Instructions | type | Default |
|-----|-----|------|-------|
| checkboxProps | Set parameters for multiple selections | TextAreaProps | - |
| radioProps | Set radio parameters | TextAreaProps | - |
| renderContent | Customized feedback content display | (content: ReactNode) => ReactNode | - |
| ModalProps | When mode is modal, it is used to set modal parameters. | ModalProps | - |
| mode | Display mode, supports popup and modal | boolean | popup |
| onValueChange | Callback when feedback content changes |function  | (value: string \| string[] \| Object) |
| showThankText | Whether to display text thanking you for feedback | boolean | true |
| SideSheetProps | When modal is popup, it is used to set the parameters of the internal SideSheet | SideSheetProps | - |
| type | Type of feedback content, supports text, emoji, radio, checkbox, custom | boolean | emoji |
| textareaProps | Set parameters of multi-line input box | TextAreaProps | - |


