---
localeCode: zh-CN
order: 41
category: 输入类
title:  Input 输入框
icon: doc-input
width: 60%
brief: 输入框是最基本的接收用户文本输入的组件
---


## 代码演示

### 如何引入

```jsx import
import { Input } from '@douyinfe/semi-ui';
```
### 基本

基本使用

```jsx live=true
import React from 'react';
import { Input } from '@douyinfe/semi-ui';

() => (
    <Input defaultValue='hi'></Input>
);
```

### 三种大小

默认定义了三种尺寸：大、默认、小

```jsx live=true
import React from 'react';
import { Input } from '@douyinfe/semi-ui';

() => (
    <>
        <Input placeholder='large' size='large'></Input>
        <br/><br/>
        <Input placeholder='default'></Input>
        <br/><br/>
        <Input placeholder='small' size='small'></Input>
    </>
);
```

### 不可用

设定 `disabled` 属性为 `true`

```jsx live=true
import React from 'react';
import { Input } from '@douyinfe/semi-ui';

() => (
    <>
        <Input defaultValue='enabled input'></Input>
        <br/>
        <br/>
        <Input disabled defaultValue='disabled input'></Input>
    </>
);
```

### 前缀/后缀

在输入框上增加前缀、后缀图标，可以是 ReactNode

当 prefix、suffix 传入的内容为文本或者 Semi Icon 时，会自动带上左右间隔，若为自定义 ReactNode，则左右间隔为 0


```jsx live=true
import React from 'react';
import { Input, Typography } from '@douyinfe/semi-ui';
import { IconSearch } from '@douyinfe/semi-icons';

() => (
    <>
        <Input prefix={<IconSearch />} showClear></Input>
        <br/><br/>
        <Input prefix="Prefix" showClear></Input>
        <br/><br/>
        <Input suffix={<IconSearch />} showClear></Input>
        <br/><br/>
        <Input suffix={<Typography.Text strong type='secondary' style={{ marginRight: 8 }}>Suffix</Typography.Text>} showClear></Input>
    </>
);
```

### 前置/后置标签

在输入框上增加前置/后置标签

当 addonBefore、addonAfter 传入的内容为文本或者 Semi Icon 时，会自动带上左右间隔，若为自定义 ReactNode，则左右间隔为 0

```jsx live=true
import React from 'react';
import { Input } from '@douyinfe/semi-ui';

() => (
    <Input addonBefore="http://" addonAfter=".com" />
);
```

### 带移除图标

点击图标删除所有内容

```jsx live=true
import React from 'react';
import { Input } from '@douyinfe/semi-ui';

() => (
    <Input showClear defaultValue='click to clear'></Input>
);
```

### 密码模式

隐藏输入的具体内容

```jsx live=true
import React from 'react';
import { Input } from '@douyinfe/semi-ui';

() => (
    <Input mode="password" defaultValue="123456"></Input>
);
```


### 校验状态

可设置不同校验状态，展示不同样式

```jsx live=true
import React from 'react';
import { Input } from '@douyinfe/semi-ui';

() => (
    <>
        <Input defaultValue='ies' validateStatus='warning'></Input>
        <br/><br/>
        <Input defaultValue='ies' validateStatus='error'></Input>
        <br/><br/>
        <Input defaultValue='ies'></Input>
    </>
);
```

### 受控组件

`Input` 值完全取决于传入的 `value` 值，配合 `onChange` 回调函数使用

```jsx live=true hideInDSM
import React, { useState } from 'react';
import { Input } from '@douyinfe/semi-ui';

() => {
    const [value, setValue] = useState('controlInput');
    
    const onChange = (val, e) => {
        console.log(val);
        setValue(val);
    };
    
    return (
        <>
            <Input
                value={value}
                onChange={onChange}>
            </Input>
        </>
    );
};
```

### 输入框组合

可以将多个输入框放入 InputGroup 的容器中，通过设置 `size` ，`disabled` 可统一设置组合中的输入框属性，支持输入框类型包括： `Input`， `InputNumber`， `Select`， `AutoComplete`、`TreeSelect`、`Cascader`、`DatePicker`

<Notice type="primary" title="注意事项">
  <div>InputGroup 不推荐插入非支持元素，Form.InputGroup 会对支持的元素进行错误聚合，而不会自定义元素进行处理。</div>
</Notice>

```jsx live=true
import React from 'react';
import { InputGroup, Input, InputNumber, AutoComplete, DatePicker, Select } from '@douyinfe/semi-ui';

() => (
    <div>
        <InputGroup>
            <Input placeholder="Name" style={{ width: 100 }} />
            <InputNumber placeholder="Score" style={{ width: 140 }} />
        </InputGroup>
        <br/><br/><br/>
        <InputGroup size={'small'}>
            <Select style={{ width: '100px' }} defaultValue='home'>
                <Select.Option value='home'>Home</Select.Option>
                <Select.Option value='work'>Work</Select.Option>
            </Select>
            <AutoComplete
                data={['Beijing Haidian']}
                placeholder='Address: '
                style={{ width: 180 }}
            >
            </AutoComplete>
        </InputGroup>
        <br/><br/><br/>
        <InputGroup size={'small'}>
            <Select style={{ width: '100px' }} defaultValue='signup'>
                <Select.Option value='signup'>Sign Up</Select.Option>
                <Select.Option value='signin'>Sign In</Select.Option>
            </Select>
            <Input placeholder="Email" style={{ width: 180 }} />
        </InputGroup>
        <br/><br/><br/>
        <InputGroup size={'small'}>
            <Input placeholder="Name" style={{ width: 100 }} />
            <DatePicker placeholder="Birthday" />
        </InputGroup>
    </div>
);
```

```jsx live=true
import React from 'react';
import { InputGroup, Select, Cascader, TreeSelect } from '@douyinfe/semi-ui';

() => {
    const Option = Select.Option;
    const treeData = [
        {
            label: 'Asia',
            value: 'Asia',
            key: '0',
            children: [
                {
                    label: 'China',
                    value: 'China',
                    key: '0-0',
                    children: [
                        { label: 'Beijing', value: 'Beijing', key: '0-0-0' },
                        { label: 'Shanghai', value: 'Shanghai', key: '0-0-1' },
                    ],
                },
            ],
        },
        { label: 'North America', value: 'North America', key: '1' }
    ];
    return (
        <>
            <InputGroup>
                <Select style={{ width: 100 }} defaultValue='from'>
                    <Select.Option value='from'>From: </Select.Option>
                    <Select.Option value='to'>To: </Select.Option>
                </Select>
                <TreeSelect
                    style={{ width: 220 }}
                    treeData={treeData}
                    placeholder="Please select"
                />
            </InputGroup>
            <br/><br/>
            <InputGroup>
                <Select style={{ width: 100 }} defaultValue='from'>
                    <Select.Option value='from'>From: </Select.Option>
                    <Select.Option value='to'>To: </Select.Option>
                </Select>
                <Cascader
                    style={{ width: 220 }}
                    treeData={treeData}
                    placeholder="Please select"
                />
            </InputGroup>
        </>
    );
};

```

### 多行输入框

用于多行输入。通过设置 `maxCount` 属性可以进行字数限制并显示字数统计。支持 `showClear`。

```jsx live=true
import React from 'react';
import { TextArea } from '@douyinfe/semi-ui';

() => (
    <div>
        <TextArea />
        <br/><br/>
        <TextArea maxCount={100} showClear/>
    </div>
);
```

### 行号

通过设置 `showLineNumber` 展示行号。可用 `lineNumberStart` 设置起始行号，或通过 `lineNumberStyle`/`lineNumberClassName` 自定义行号区样式。

```jsx live=true
import React from 'react';
import { TextArea } from '@douyinfe/semi-ui';

() => (
    <TextArea
        showLineNumber
        lineNumberStart={1}
        defaultValue={'Line 1\nLine 2\n这是一行较长的文本，用来演示软换行时的行号对齐效果。\nLine 4\nLine 5'}
        rows={5}
        style={{ width: 420 }}
        lineNumberStyle={{ color: 'var(--semi-color-text-2)' }}
    />
);
```

### 使用 Shift + Enter 换行的多行输入框
TextArea 默认情况下 Enter 回车与 Shift + Enter 均可实现换行  
通过适当的事件监听与禁用默认行为，你可以实现禁用 Enter 换行，仅 Shift + Enter 才能换行

```jsx live=true
import React from 'react';
import { TextArea, HotKeys } from '@douyinfe/semi-ui';

() => {
    const [text, setText] = useState('');

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault(); // 阻止默认的换行行为
        }
    };

    const handleChange = (value, event) => {
        setText(event.target.value);
    };

    return (
        <>  
            <p style={{ display: 'flex' }}>
                使用
                <HotKeys
                    hotKeys={['shift', 'enter']}
                    style={{ marginBottom: 12, marginLeft: 4, marginRight: 4 }}
                />
                换行的 TextArea
            </p>
            <TextArea
                value={text}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
            />
        </>
    );
};
```


### 自动扩展的多行输入框

通过设置 `autosize` 属性可设置只有高度自动随内容增加而变化。

```jsx live=true
import React from 'react';
import { TextArea } from '@douyinfe/semi-ui';

() => (
    <div>
        <TextArea autosize rows={1} />
        <br/><br/>
        <TextArea autosize={{ minRows: 1, maxRows: 3}} />
        <br/><br/>
        <TextArea autosize maxCount={100} />
    </div>
);
```

### 自定义计算字符串长度

通过设置 `getValueLength` 属性可以自定义计算字符串长度。搭配 maxLength 和 minLength 可以支持 emoji 长度按照可见长度计算。


传入 getValueLength 时，Semi 内部做了什么：

- maxLength：不直接透传 maxLength 给原生 input。如果输入长度超出最大限制，则使用上一次输入的合法长度字符。
- minLength：动态切换 minLength 的长度，emoji 按照一个长度计算。
- maxCount：使用 getValueLength 获取的值与 maxCount 进行比较

```jsx live=true
import React from 'react';
import GraphemeSplitter from 'grapheme-splitter';
import { Input, Typography, Form, TextArea, Button } from '@douyinfe/semi-ui';

() => {
    const [value, setValue] = useState();
    function getValueLength(str) {
        if (typeof str === 'string') {
            const splitter = new GraphemeSplitter();
            return splitter.countGraphemes(str);
        } else {
            return 0;
        }
    }

    function getTextAreaStrLength(str) {
        const filteredStr = str.replace(/\s/g, '');
        return filteredStr.length;
    }

    return (
        <div>
            <h4>maxLength=10</h4>
            <div>
                <Typography.Text>尝试输入以下字符</Typography.Text>
                <div><Typography.Text copyable>💖</Typography.Text></div>
                <div><Typography.Text copyable>👨‍👩‍👧‍👦</Typography.Text></div>
            </div>
            <Input maxLength={10} getValueLength={getValueLength} onChange={setValue} style={{ width: 200, marginTop: 12, marginBottom: 12 }} />
            {
                value && (
                    <div>
                        <div><Typography.Text type="tertiary">{`getValueLength=${getValueLength(value)}`}</Typography.Text></div>
                        <div><Typography.Text type="tertiary">{`length=${value.length}`}</Typography.Text></div>
                    </div>
                )
            }
            <br/><br/>
            <h4>Form.Input + minLength=4</h4>
            <Form layout="horizontal">
                <Form.Input noLabel field="username" minLength={4} getValueLength={getValueLength} style={{ width: 200 }} />
                <Button type="primary" htmlType="submit">提交</Button>
            </Form>
            <h4>maxCount=10</h4>
            <TextArea defaultValue="semi design" rows={2} maxCount={10} getValueLength={getTextAreaStrLength} style={{ width: 200 }} />
        </div>
    );
};
```

一些问题的回答：

> 为何不直接引入 `grapheme-splitter` 包？这个包未压缩体积为 200+kB，对于不需要把 emoji 按照可见长度计算的用户来说，这个体积有点过大了。因此 Semi 选择把长度计算函数作为参数让用户传入。

> 为何不动态修改 maxLength？动态修改 maxLength 在输入操作完成以后，计算剩余可以输入的字符长度。 如 maxLength 设置为 1，想输入一个 length 为 2 的 '💖'，但是由于 input maxLength 的限制，这里根本就输入不进去，也就无法更新 maxLength。

## API 参考

### Input
> 其他属性与html input 标签保持一致

| 属性                | 说明                                             | 类型                              | 默认值    |
|-------------------|------------------------------------------------|---------------------------------|-----------|
| aria-describedby  | 设置 aria-describedby 属性                         | string                          | -  |
| aria-errormessage | 设置 aria-errormessage 属性                        | string                          | -  |
| aria-invalid      | 设置 aria-invalid 属性                             | string                          | -  |
| aria-label        | 设置 aria-label 属性                               | string                          | -  |
| aria-labelledby   | 设置 aria-labelledby 属性                          | string                          | -  |
| aria-required     | 设置 aria-required 属性                            | string                          | -  |
| addonAfter        | 后置标签                                           | ReactNode                       |           |
| addonBefore       | 前置标签                                           | ReactNode                       |           |
| borderless        | 无边框模式  >=2.33.0                                | boolean                         |           |
| className         | 类名                                             | string                          |           |
| clearIcon         | 可用于自定义清除按钮, showClear为true时有效 **>=2.25.0**     | ReactNode                       |  |
| defaultValue      | 输入框内容默认值                                       | ReactText                       |           |
| disabled          | 是否禁用，默认为false                                  | boolean                         | false     |
| getValueLength    | 自定义计算字符串长度                                     | (value: string) => number       |      |
| hideSuffix        | 清除按钮与后缀标签并存时隐藏后缀标签，默认为false两者并列                | boolean                         | false     |
| mode              | 输入框的模式，可选值password                | string                          |           |
| prefix            | 前缀标签                                           | ReactNode                       |           |
| preventScroll     | 指示浏览器是否应滚动文档以显示新聚焦的元素，作用于组件内的 focus 方法         | boolean                         |  |  |
| showClear         | 输入框有内容且 hover 或 focus 时展示清除按钮      | boolean                         | false     |
| size              | 输入框大小，large、default、small                      | string                          | 'default' |
| style             | 样式                                             | CSSProperties                   |           |
| suffix            | 后缀标签                                           | ReactNode                       |           |
| type              | 声明input类型，同原生input标签的type属性                    | string                          | text     |
| validateStatus    | 校验状态，可选值default、error、warning，默认default。仅影响展示样式 | string                          | 'default' |
| value             | 输入框内容                                          | ReactText                       |           |
| onBlur            | 输入框失去焦点时的回调                                    | function(e:event)               |           |
| onChange          | 输入框内容变化时的回调                                    | function(value:string, e:event) |           |
| onClear           | 点击清除按钮时的回调                                     | function(e:event)               |           |
| onEnterPress      | 按回车时回调（keypress）                               | function(e:event)               |           |
| onFocus           | 输入框focus时的回调                                   | function(e:event)               |           |
| onKeyDown         | keydown回调                                      | function(e:event)               |           |
| onKeyPress        | keypress回调                                     | function(e:event)               |           |
| onKeyUp           | keyup回调                                        | function(e:event)               |           |
| onCompositionStart | onCompositionStart回调, **>=2.85.0**  | function(e:event) | - |
| onCompositionEnd | onCompositionEnd回调, **>=2.85.0**  | function(e:event) | - |
| onCompositionUpdate | onCompositionUpdate回调, **>=2.85.0**  | function(e:event) | - |

### TextArea

> 其他属性与 html textarea 标签保持一致

| 属性         | 说明                               | 类型                            | 默认值 |
|--------------|----------------------------------|---------------------------------|--------|
| aria-describedby   | 设置 aria-describedby 属性           | string                         | -  |
| aria-errormessage   | 设置 aria-errormessage 属性           | string                         | -  |
| aria-invalid   | 设置 aria-invalid 属性           | string                         | -  |
| aria-label   | 设置 aria-label 属性           | string                         | -  |
| aria-labelledby   | 设置 aria-labelledby 属性           | string                         | -  |
| aria-required   | 设置 aria-required 属性           | string                         | -  |
| autosize     | 是否随着自动适应内容高度，可写成对象配置最小最大行数`{minRows?: number, maxRows?: number}`<br />**从2.45.0版本起支持对象参数**           | boolean\|object                         | false  |
| borderless        | 无边框模式  >=2.33.0                                 | boolean                         |           |
| className    | 类名                               | string                          | -      |
| cols         | 默认列数                           | number                          | 无     |
| disabled     | 禁用状态                           | boolean                         | false  |
| getValueLength| 自定义计算字符串长度                                            | (value: string) => number        |      |
| maxCount     | 设置字数限制并显示字数统计         | number                          | 无     |
| placeholder  | 当前的默认值                       | string                          | 无     |
| readonly     | 只读                               | boolean                         | false  |
| rows         | 默认行数                           | number                          | 4      |
| showLineNumber | 是否展示行号 | boolean | false |
| lineNumberStart | 行号起始值 | number | 1 |
| lineNumberClassName | 行号区域 className | string | - |
| lineNumberStyle | 行号区域样式 | CSSProperties | - |
| showClear    | 支持清除               | boolean                         | false     |
| style        | 样式                               | CSSProperties                   | -      |
| onBlur       | 输入框失去焦点时的回调             |(e:event) => void               | -      |
| onChange     | 输入框内容变化时的回调             | (value:string, e:event) => void |        |
| onClear      | 点击清除按钮时的回调 | (e:event) => void                         | -       |
| onEnterPress | 按下回车的回调                     | (e:event) => void                         | 无     |
| onFocus      | 输入框 focus 时的回调              | (e:event) => void               | -      |
| onKeyDown    | keydown 回调，html 事件             | (e:event) => void               | -      |
| onKeyPress   | keypress 回调，html 事件            | (e:event) => void               | -      |
| onKeyUp      | keyup 回调，html 事件               | (e:event) => void               | -      |
| onResize     | 触发高度变化时的回调 | ({ height:number }) => void    | -      |
| onCompositionStart | onCompositionStart回调, **>=2.85.0**   | function(e:event) | - |
| onCompositionEnd | onCompositionEnd回调, **>=2.85.0**  | function(e:event) | - |
| onCompositionUpdate | onCompositionUpdate回调, **>=2.85.0**  | function(e:event) | - |

### InputGroup

通用属性将设置到 InputGroup 的子级元素上，例如 disabled、onFocus 等。如果你在子级设置了 onFocus、onBlur 或 disabled，会覆盖掉 InputGroup 对应属性值。


| 属性          | 说明                           | 类型                                                          | 默认值    |
|---------------|------------------------------|---------------------------------------------------------------|-----------|
| className     | 组的类名                       | string                                                        | -         |
| disabled      | 禁用                           | boolean                                                       | -         |
| label         | InputGroup 的 label 属性       | [LabelProps](https://semi.design/zh-CN/input/form#Form.Label) | -         |
| labelPosition | label 位置，可选 top 或 left    | string                                                        | -         |
| size          | 输入框大小，large、default、small | string                                                        | 'default' |
| style         | 组的样式                       | CSSProperties                                                 | -         |
| onBlur        | 输入框失去焦点时的回调         | (e:event) => void                                             | -         |
| onFocus       | 输入框 focus 时的回调          | (e:event) => void                                             | -         |

## Methods

绑定在组件实例上的方法，可以通过 ref 调用实现某些特殊交互

| 名称    | 描述     |
|---------|--------|
| blur()  | 移出焦点 |
| focus() | 获取焦点 |

## Accessibility

### ARIA

- 当 validateStatus 为 error 时，输入框的 aria-invalid 为 true
- 在 Form 中使用时，field label 是 Input 的 aria-label

### 键盘和焦点

- Input 可被获取焦点，键盘用户可以使用 Tab 及 Shift  + Tab 切换焦点
- 密码按钮可以被聚焦，聚焦后使用 Enter 或者空格键激活


## 设计变量
<DesignToken/>

<!-- ## 相关物料
```material
44, 46
``` -->

## 相关物料
<semi-material-list code="46"></semi-material-list>
