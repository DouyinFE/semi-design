---
localeCode: zh-CN
order: 21
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
    <Input defaultValue='hi' autofocus></Input>
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

在输入框上增加前缀、后缀图标，可以是 ReactNode 。

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
import React from 'react';
import { Input } from '@douyinfe/semi-ui';

class InputDemo extends React.Component {
    constructor() {
        super();
        this.state = {
            value: 'controlInput',
            value2: 'input'
        };
        this.onChange = this.onChange.bind(this);
    }
    onChange(value, e) {
        console.log(value);
        this.setState({ value });
    }
    render() {
        return (
            <>
                <Input
                    value={this.state.value}
                    onChange={this.onChange}>
                </Input>
            </>
        );
    }
}
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

用于多行输入。通过设置 `maxCount` 属性可以进行字数限制并显示字数统计。1.30.0 开始支持 `showClear`。

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

### 自动扩展的多行输入框

通过设置 `autosize` 属性可设置只有高度自动随内容增加而变化。

```jsx live=true
import React from 'react';
import { TextArea } from '@douyinfe/semi-ui';

() => (
    <div>
        <TextArea autosize rows={1} />
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

| 属性           | 说明                                                            | 类型                            | 默认值    |
|----------------|---------------------------------------------------------------|---------------------------------|-----------|
| addonAfter     | 后置标签                                                        | ReactNode               |           |
| addonBefore    | 前置标签                                                        | ReactNode               |           |
| className      | 类名                                                            | string                          |           |
| defaultValue   | 输入框内容默认值                                                | ReactText                          |           |
| disabled       | 是否禁用，默认为false                                            | boolean                         | false     |
| getValueLength| 自定义计算字符串长度                                            | (value: string) => number        |      |
| hideSuffix     | 清除按钮与后缀标签并存时隐藏后缀标签，默认为false两者并列        | boolean                         | false     |
| mode           | 输入框的模式，可选值password **>=v1.3.0**                        | string                          |           |
| prefix         | 前缀标签                                                        | ReactNode               |           |
| showClear      | 支持清除 **>=1.0.0**                                            | boolean                         | false     |
| size           | 输入框大小，large、default、small                                  | string                          | 'default' |
| style          | 样式                                                            | CSSProperties                          |           |
| suffix         | 后缀标签                                                        | ReactNode               |           |
| type           | 声明input类型，同原生input标签的type属性                         | string                         | text     |
| validateStatus | 校验状态，可选值default、error、warning，默认default。仅影响展示样式 | string                          | 'default' |
| value          | 输入框内容                                                      | ReactText                          |           |
| onBlur         | 输入框失去焦点时的回调                                          | function(e:event)                        |           |
| onChange       | 输入框内容变化时的回调                                          | function(value:string, e:event) |           |
| onClear        | 点击清除按钮时的回调                                            | function(e:event)                        |           |
| onEnterPress   | 按回车时回调（keypress）                                          | function(e:event)               |           |
| onFocus        | 输入框focus时的回调                                             | function(e:event)                        |           |
| onKeyDown      | keydown回调                                                     | function(e:event)               |           |
| onKeyPress     | keypress回调                                                    | function(e:event)               |           |
| onKeyUp        | keyup回调                                                       | function(e:event)               |           |
### TextArea

> 其他属性与 html textarea 标签保持一致

| 属性         | 说明                               | 类型                            | 默认值 |
|--------------|----------------------------------|---------------------------------|--------|
| autosize     | 是否随着自动适应内容高度           | boolean                         | false  |
| className    | 类名                               | string                          | -      |
| cols         | 默认列数                           | number                          | 无     |
| disabled     | 禁用状态                           | boolean                         | false  |
| getValueLength| 自定义计算字符串长度                                            | (value: string) => number        |      |
| maxCount     | 设置字数限制并显示字数统计         | number                          | 无     |
| placeholder  | 当前的默认值                       | string                          | 无     |
| readonly     | 只读                               | boolean                         | false  |
| rows         | 默认行数                           | number                          | 4      |
| showClear    | 支持清除 **>=1.30.0**               | boolean                         | false     |
| style        | 样式                               | CSSProperties                   | -      |
| onBlur       | 输入框失去焦点时的回调             |(e:event) => void               | -      |
| onChange     | 输入框内容变化时的回调             | (value:string, e:event) => void |        |
| onClear      | 点击清除按钮时的回调  **>=1.30.0** | (e:event) => void                         | -       |
| onEnterPress | 按下回车的回调                     | (e:event) => void                         | 无     |
| onFocus      | 输入框 focus 时的回调              | (e:event) => void               | -      |
| onKeyDown    | keydown 回调，html 事件             | (e:event) => void               | -      |
| onKeyPress   | keypress 回调，html 事件            | (e:event) => void               | -      |
| onKeyUp      | keyup 回调，html 事件               | (e:event) => void               | -      |
| onResize     | 触发高度变化时的回调 **>=v0.37.0** | ({ height:number }) => void    | -      |
## Methods

| 名称    | 描述     |
|---------|--------|
| blur()  | 移出焦点 |
| focus() | 获取焦点 |

## 设计变量
<DesignToken/>

<!-- ## 相关物料
```material
44, 46
``` -->

