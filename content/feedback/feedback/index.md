---
localeCode: zh-CN
order: 87
category: 基础 
title: Feedback 反馈
icon: doc-divider 
brief: 快速定义各类型反馈
---

## 代码演示

### 如何引入

Feedback 自 2.85.0 支持。

```jsx import
import { Feedback } from '@douyinfe/semi-ui';
```

### 基本使用

通过 `visible` 设置是否显示。默认反馈展示内容是 emoji 形式。 可通过 `onValueChange` 获取当前选择的内容。

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
            展示反馈: Popup, emoji
        </Button>
        <Feedback
            title="您对本产品的评分是？"
            visible={visible}
            onOk={handleOk}
            onCancel={handleCancel}
            onValueChange={onValueChange}
        />
    </>);
};
```

### 文字类型

设置 `type` 为 `text` 可获得多行输入框形式的 feedback，可通过 `textAreaProps` 设置多行输入框的参数。

```jsx live=true
import React, { useState, useCallback } from 'react';
import { Feedback, Button } from '@douyinfe/semi-ui';

() => {
    const [visible, setVisible] = useState(false);
    const handleOk = useCallback(() => setVisible(false), []);
    const handleCancel = useCallback(() => setVisible(false), []);

    return (<>
        <Button onClick={() => setVisible(!visible)} >
            展示反馈: Popup, text
        </Button>
        <Feedback
            type="text"
            textAreaProps={{ maxCount: 200 }}
            title="您对本产品的建议是？"
            visible={visible}
            onOk={handleOk}
            onCancel={handleCancel}
        />
    </>);
};
```

### 单选反馈

设置 `type` 为 `radio` 可获得单选形式的 feedback，可通过 `radioGroupProps` 设置单选的参数。

```jsx live=true
import React, { useState, useCallback } from 'react';
import { Feedback, Button } from '@douyinfe/semi-ui';

() => {
    const [visible, setVisible] = useState(false);
    const handleOk = useCallback(() => setVisible(false), []);
    const handleCancel = useCallback(() => setVisible(false), []);

    return (<>
        <Button onClick={() => setVisible(!visible)} >
            展示反馈: Popup, radio
        </Button>
        <Feedback
            type="radio"
            radioGroupProps={{
                options: ['访客', '开发者', '维护者'],
            }}
            title="您的身份是"
            visible={visible}
            onOk={handleOk}
            onCancel={handleCancel}
        />
    </>);
};
```

### 多选反馈

设置 `type` 为 `checkbox` 可获得多选形式的 feedback，可通过 `checkboxGroupProps` 设置多选的参数。

```jsx live=true
import React, { useState, useCallback } from 'react';
import { Feedback, Button } from '@douyinfe/semi-ui';

() => {
    const [visible, setVisible] = useState(false);
    const handleOk = useCallback(() => setVisible(false), []);
    const handleCancel = useCallback(() => setVisible(false), []);

    return (<>
        <Button onClick={() => setVisible(!visible)} >
            展示反馈: Popup, checkbox
        </Button>
        <Feedback
            type="checkbox"
            checkboxGroupProps={{
                options: ['抖音', '火山', '豆包']
            }}
            title="您最常使用以下哪些产品？"
            visible={visible}
            onOk={handleOk}
            onCancel={handleCancel}
        />
    </>);
};
```

### 自定义反馈内容

设置 `type` 为 `custom` 可获得多选形式的 feedback，可通过 `renderContent` 设置具体反馈的内容。使用自定义反馈时候，需自行控制提交按钮的禁用与否状态，用户可通过 `okButtonProps` 设置。

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
            <span>这是一段自定义的内容</span>
            <TextArea
                onChange={onTextAreaChange}
            />
        </>;
    }, [onTextAreaChange]);

    return (<>
        <Button onClick={() => setVisible(!visible)} >
            展示反馈: Popup, custom
        </Button>
        <Feedback
            type="custom"
            okButtonProps={{ disabled: !Boolean(value), }}
            title="您对本产品的建议是？"
            visible={visible}
            onOk={handleOk}
            onCancel={handleCancel}
            renderContent={renderContent}
        />
    </>);
};
```

### 模态对话框形式

可通过 `mode` 反馈的形式，默认是 `popup`, 设置为 `modal` 可获得模态对话框形式的展示。

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
            展示反馈: Modal, emoji
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

## API 参考

### FeedbackProps

除去下面参数列表所列参数外，当 `mode` 为 `modal` 时, FeedbackProps 还支持 [ModalProps](/zh-CN/show/modal#Modal) 中的参数，
当 `mode` 为 `popup` 时, FeedbackProps 还支持 [SideSheetProps](/zh-CN/show/sidesheet#API%20%E5%8F%82%E8%80%83) 中的参数

| 属性 | 说明 | 类型 | 默认值 |
|-----|-----|------|-------|
| cancelButtonProps | 设置取消按钮的参数 | [ButtonProps](/zh-CN/basic/button#Button) | - |
| checkboxGroupProps | 设置多选的参数 | [CheckBoxGroupProps](/zh-CN/input/checkbox#Checkbox%20Group) | - |
| radioGroupProps | 设置单选的参数 | [RadioGroupProps](/zh-CN/input/radio#RadioGroup) | - |
| renderContent | 自定义反馈内容展示 | (content: ReactNode) => ReactNode | - |
| mode | 展示模式，支持 popup、modal | boolean | popup |
| okButtonProps | 设置提交按钮的参数，比如在自定义内容是，通过设置 okButtonProps 中的 disabled 设置是否禁用提交 | [ButtonProps](/zh-CN/input/input#Button) | - |
| onCancel | 取消回调，参数为关闭函数，返回 promise 时 resolve 后自动关闭 | (e: any) => void \| Promise<any\> | 无 |
| onOk | 点击确定回调，参数为关闭函数，返回 promise 时 resolve 后自动关闭 | (e: any) => void \| Promise<any\> | 无 |
| onValueChange | 在反馈内容变化时候的回调|function  | (value: string \| string[] \| Object) |
| showThankInfo | 是否展示感谢反馈的文本 | boolean | true |
| type | 反馈内容的类型，支持 text、emoji、radio，checkbox，custom| boolean | emoji |
| textAreaProps | 设置多行输入框的参数 | [TextAreaProps](/zh-CN/input/input#TextArea) | - |
