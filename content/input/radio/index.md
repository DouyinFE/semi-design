---
localeCode: zh-CN
order: 23
category: 输入类
title: Radio 单选框
icon: doc-radio
brief: 用户使用单选框来从少量的选项集合中选择单个选项
---

## 何时使用

-   用于在多个备选项中选中单个状态。
-   和 Select 的区别是，Radio 所有选项默认可见，方便用户在比较中选择，因此选项不宜过多。

## 代码演示
### 如何引入

```jsx import
import { Radio, RadioGroup } from '@douyinfe/semi-ui';
```
### 基本用法

```jsx live=true
import React from 'react';
import { Radio } from '@douyinfe/semi-ui';

() => (
    <Radio>Radio</Radio>
);
```

### 带辅助文本

通过`extra`设置辅助文本，可以是任意类型的 ReactNode

> `extra`在 v0.25.0 后开始提供

```jsx live=true
import React from 'react';
import { Radio } from '@douyinfe/semi-ui';

() => (
    <Radio extra="Semi Design 是由互娱社区前端团队与 UED 团队共同设计开发并维护的设计系统">
        Semi Design
    </Radio>
);
```

### 禁用

Radio 不可用

```jsx live=true
import React, { useState } from 'react';
import { Radio, Button } from '@douyinfe/semi-ui';

() => {
    const [disabled, setDisabled] = useState(true);
    const toggleDisabled = () => {
        setDisabled(!disabled);
    };
    return (
        <div>
            <Radio defaultChecked={false} disabled={disabled}>
                Disabled
            </Radio>
            <br />
            <Radio defaultChecked disabled={disabled}>
                Disabled
            </Radio>
            <div style={{ marginTop: 20 }}>
                <Button type="primary" onClick={toggleDisabled}>
                    Toggle disabled
                </Button>
            </div>
        </div>
    );
};
```

### 高级模式

高级模式（mode='advanced'）checked 可以通过点击转换为 unchecked。

```jsx live=true
import React, { useState } from 'react';
import { Radio } from '@douyinfe/semi-ui';

() => {
    const [checked, setChecked] = useState(true);
    const toggle = (e) => {
        console.log('radio checked', e.target.checked);
        setChecked(e.target.checked);
    };
    return (
        <Radio 
            checked={checked}
            mode="advanced"
            onChange={toggle}
        >
            允许取消选择
        </Radio>
    );
};
```

### 单选组合

一组互斥的 Radio 配合使用

```jsx live=true
import React from 'react';
import { RadioGroup, Radio } from '@douyinfe/semi-ui';

() => {
    const [value,  setValue] = useState(1);
    const onChange = (e) => {
        console.log('radio checked', e.target.value);
        setValue(e.target.value);
    }; 
    return (
        <RadioGroup onChange={onChange} value={value}>
            <Radio value={1}>A</Radio>
            <Radio value={2}>B</Radio>
            <Radio value={3}>C</Radio>
            <Radio value={4}>D</Radio>
        </RadioGroup>
    );
};
```

### 垂直排列

可通过给 RadioGroup 设置 `direction`属性来决定 组内的 radio 元素水平排列或者垂直排列

```jsx live=true
import React from 'react';
import { RadioGroup, Radio } from '@douyinfe/semi-ui';

() => (
    <RadioGroup direction="vertical">
        <Radio value={1}>A</Radio>
        <Radio value={2}>B</Radio>
        <Radio value={3}>C</Radio>
        <Radio value={4}>D</Radio>
    </RadioGroup>
);
```

### 按钮样式

version: >=1.26.0

可以利用 `type='button'` 来设置 button 样式类型的单选器，并且，button 类型单选器支持三种尺寸大小。

需要注意的是: button 类型的单选器暂不支持辅助文本（`extra`）和垂直排列（`direction='vertical'`）。

```jsx live=true dir="column"
import React from 'react';
import { RadioGroup, Radio, Space } from '@douyinfe/semi-ui';

() => {
    return (
        <Space vertical spacing='loose' align='start'>
            <RadioGroup type='button' buttonSize='small' defaultValue={1}>
                <Radio value={1}>即时推送</Radio>
                <Radio value={2}>定时推送</Radio>
                <Radio value={3}>动态推送</Radio>
            </RadioGroup>
            <RadioGroup type='button' buttonSize='middle' defaultValue={1}>
                <Radio value={1}>即时推送</Radio>
                <Radio value={2}>定时推送</Radio>
                <Radio value={3}>动态推送</Radio>
            </RadioGroup>
            <RadioGroup type='button' buttonSize='large' defaultValue={1}>
                <Radio value={1}>即时推送</Radio>
                <Radio value={2}>定时推送</Radio>
                <Radio value={3}>动态推送</Radio>
            </RadioGroup>
        </Space>
    );
};
```

### 卡片样式

version: >=1.30.0

可以给 `RadioGroup` 设置 `type='card'` 实现带有背景的卡片样式。

```jsx live=true dir="column"
import React from 'react';
import { RadioGroup, Radio } from '@douyinfe/semi-ui';

() => (
    <RadioGroup type='card' defaultValue={2} direction='vertical'>
        <Radio value={1} disabled extra='Semi Design 是由互娱社区前端团队与 UED 团队共同设计开发并维护的设计系统' style={{width:280}}>
            单选框标题
        </Radio>
        <Radio value={2} extra='Semi Design 是由互娱社区前端团队与 UED 团队共同设计开发并维护的设计系统' style={{width:280}}>
            单选框标题
        </Radio>
        <Radio value={3} extra='Semi Design 是由互娱社区前端团队与 UED 团队共同设计开发并维护的设计系统' style={{width:280}}>
            单选框标题
        </Radio>
    </RadioGroup>
);
```
### 无 radio 的纯卡片样式

version: >=1.30.0

可以给 `RadioGroup` 设置 `type='pureCard'` 实现带有背景且无 radio 的纯卡片样式。

```jsx live=true dir="column"
import React from 'react';
import { RadioGroup, Radio } from '@douyinfe/semi-ui';

() => (
    <RadioGroup type='pureCard' defaultValue={2} direction='vertical'>
        <Radio value={1} disabled extra='Semi Design 是由互娱社区前端团队与 UED 团队共同设计开发并维护的设计系统' style={{width:280}}>
            单选框标题
        </Radio>
        <Radio value={2} extra='Semi Design 是由互娱社区前端团队与 UED 团队共同设计开发并维护的设计系统' style={{width:280}}>
            单选框标题
        </Radio>
        <Radio value={3} extra='Semi Design 是由互娱社区前端团队与 UED 团队共同设计开发并维护的设计系统' style={{width:280}}>
            单选框标题
        </Radio>
    </RadioGroup>
);
```

### 配置 options

通过配置 options 参数来渲染单选框

```jsx live=true hideInDSM
import React from 'react';
import { RadioGroup, Space } from '@douyinfe/semi-ui';

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            value1: 'Guest',
            value2: 'Developer',
            value3: 'Maintainer',
        };
        this.plainOptions = ['Guest', 'Developer', 'Maintainer'];
        this.options = [
            { label: 'Guest', value: 'Guest', extra: 'Semi Design', style: { width: 120 } },
            { label: 'Developer', value: 'Developer', extra: 'Semi Design', style: { width: 120 } },
            { label: 'Maintainer', value: 'Maintainer', extra: 'Semi Design', style: { width: 120 } },
        ];
        this.optionsWithDisabled = [
            { label: 'Guest', value: 'Guest' },
            { label: 'Developer', value: 'Developer' },
            { label: 'Maintainer', value: 'Maintainer', disabled: true },
        ];
        this.onChange1 = this.onChange1.bind(this);
        this.onChange2 = this.onChange2.bind(this);
        this.onChange3 = this.onChange3.bind(this);
    }
    onChange1(e) {
        console.log('radio1 checked', e.target.value);
        this.setState({
            value1: e.target.value,
        });
    }

    onChange2(e) {
        console.log('radio2 checked', e.target.value);
        this.setState({
            value2: e.target.value,
        });
    }

    onChange3(e) {
        console.log('radio3 checked', e.target.value);
        this.setState({
            value3: e.target.value,
        });
    }

    render() {
        return (
            <Space vertical align='start' spacing='loose'>
                <RadioGroup
                    options={this.plainOptions}
                    onChange={this.onChange1}
                    value={this.state.value1}
                />
                <RadioGroup
                    options={this.optionsWithDisabled}
                    onChange={this.onChange3}
                    value={this.state.value3}
                />
                <RadioGroup
                    options={this.options}
                    onChange={this.onChange2}
                    value={this.state.value2}
                />
            </Space>
        );
    }
}
```

## API 参考

### Radio

| 属性           | 说明                                                                   | 类型              | 默认值  |
|----------------|-----------------------------------------------------------------------|------------------|--------|
| addonClassName | 包裹内容容器的样式类名  **v1.16.0 后提供**                                 | string            |       |
| addonStyle     | 包裹内容容器的内联样式  **v1.16.0 后提供**                                 | CSSProperties     |       |
| autoFocus      | 自动获取焦点                                                            | boolean           | false  |
| checked        | 指定当前是否选中                                                         | boolean           | false  |
| className      | 样式类名                                                                | string            |        |
| defaultChecked | 初始是否选中                                                             | boolean           | false  |
| disabled       | 禁选单选框                                                              |boolean            | false    |
| extra          | 副文本，只对type='default'生效<br/>**v0.25.0 后提供**                     | ReactNode         | -      |
| mode           | 高级和普通模式，高级模式可以在 checked 时点击变成 unchecked，可选值 advanced   | string            | -      |
| style          | 内联样式                                                                 | CSSProperties    |        |
| value          | 根据 value 进行比较，判断是否选中                                          | any               | -      |
| onChange       | 选项变化时的回调函数                                                      | function(e:Event) | -      |
| onMouseEnter   | 鼠标移入选项时的回调函数                                                   | function(e:Event) | -      |
| onMouseLeave   | 鼠标移出选项时的回调函数                                                   | function(e:Event) | -      |
### RadioGroup

单选框组合，用于包裹一组 `Radio`。

| 属性         | 说明                                                                                        | 类型                                                                      | 默认值       |
| ------------ | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ------------ |
|buttonSize|type='button'的radio的尺寸大小，可选值为：`small`、`middle`、`large` <br/>**v1.26.0 后提供** |string|`middle`|
| className    | 样式类名                                                                                    | string                                                                    |              |
| defaultValue | 默认选中的值                                                                                | any                                                                       | -            |
| direction    | radio 排列方向, 只对type='default'生效，可选值`horizontal`、`vertical` <br/>**v0.31.0 后提供**                      | string                                                                    | `horizontal` |
| disabled     | 禁选所有子单选器                                                                            | boolean                                                                   | false        |
| mode         | 高级和普通模式，可以在 checked 时点击变成 unchecked，可选值 advanced <br/>**v1.9.0 后提供** | string                                                                    | -            |
| name         | RadioGroup 下所有 `input[type="radio"]` 的 `name` 属性                                      | string                                                                    | -            |
| options      | 以配置形式设置子元素                                                                        | Array | -            |
| style        | 内联样式                                                                                    | CSSProperties                                                                    |              |
| value        | 用于设置当前选中的值                                                                        | any                                                                       | -            |
|type|设置所有radio的样式类型，可选值为：`default`、`button`、`card`、`pureCard` <br/>**该 api 在 v1.26.0 后提供，其中 card 和 pureCard 在 v1.30.0 后提供**    |string|`default`|
| onChange     | 选项变化时的回调函数                                                                        | function(e:Event)                                                         | -            |

## 方法

### Radio

| 名称    | 描述     |
| ------- | -------- |
| blur()  | 移除焦点 |
| focus() | 获取焦点 |

<!-- ## 相关物料
```material
123
``` -->

## 设计变量
<DesignToken/>