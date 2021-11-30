---
localeCode: zh-CN
order: 18
category: 输入类
title: Checkbox 复选框
icon: doc-checkbox
brief: 复选框允许用户选中多个选项
---


## 何时使用

- 在一组可选项中进行多项选择时；
- 单独使用可以表示两种状态之间的切换，和 Switch 类似。区别在于切换 Switch 会直接触发状态改变，而 Checkbox 一般用于状态标记，需要和提交操作配合。

## 代码演示

### 如何引入

```jsx import
import { Checkbox, CheckboxGroup } from '@douyinfe/semi-ui';
```

### 基本用法

Checkbox单个使用，可以通过`defaultChecked`、`checked`属性控制是否勾选。  
当传入`checked`时，为受控使用。  

```jsx live=true
import React from 'react';
import { Checkbox } from '@douyinfe/semi-ui';

() => (
    <Checkbox onChange={checked => console.log(checked)}>Semi Design</Checkbox>
);
```

```jsx live=true
import React from 'react';
import { Checkbox } from '@douyinfe/semi-ui';

() => (
    <Checkbox defaultChecked onChange={checked => console.log(checked)}>Semi Design</Checkbox>
);
```

带辅助文本的checkbox。通过`extra`传入辅助文本。辅助文本会更长一些，甚至还可能换行。

```jsx live=true
import React from 'react';
import { Checkbox } from '@douyinfe/semi-ui';

() => (
    <>
        <Checkbox extra='Semi Design 是由互娱社区前端团队与 UED 团队共同设计开发并维护的设计系统'>
            Semi Design
        </Checkbox>
        <br/>
        <Checkbox extra='Semi Design 是由互娱社区前端团队与 UED 团队共同设计开发并维护的设计系统' style={{ width: 400 }}>
            Semi Design
        </Checkbox>
    </>
);
```

### 禁用

通过设置 `disabled` 属性，禁用 Checkbox

```jsx live=true
import React from 'react';
import { Checkbox } from '@douyinfe/semi-ui';

() => (
    <div>
        <Checkbox defaultChecked={false} disabled>Unchecked Disabled</Checkbox>
        <br />
        <Checkbox defaultChecked disabled>Checked Disabled</Checkbox>
    </div>
);
```

### JSX方式声明Checkbox组

通过在CheckboxGroup内部放置 Checkbox元素，可以声明Checkbox组  
使用Checkbox组，你可以更便捷地通过CheckboxGroup的`defaultValue`、`value`属性去控制一组Checkbox的选中与否
此时Checkbox不需要再声明`defaultChecked`、`checked`属性

```jsx live=true
import React from 'react';
import { CheckboxGroup, Checkbox } from '@douyinfe/semi-ui';

() => (
    <CheckboxGroup style={{ width: '100%' }} defaultValue={['A', 'B']}>
        <Checkbox value="A">A</Checkbox>
        <Checkbox value="B">B</Checkbox>
        <Checkbox value="C">C</Checkbox>
        <Checkbox value="D">D</Checkbox>
        <Checkbox value="E">E</Checkbox>
    </CheckboxGroup>
);
```


### 数组方式声明 Checkbox 组

也可以将数组通过 `options` 属性直接传入 CheckboxGroup，直接生成 Checkbox 组

```jsx live=true
import React from 'react';
import { CheckboxGroup } from '@douyinfe/semi-ui';

() => {
    function onChange(checkedValues) {
        console.log('checked = ', checkedValues);
    }

    const plainOptions = ['抖音', '火山', '皮皮虾'];
    const options = [
        { label: '追求极致', value: '1', extra: '不断提高要求，延迟满足感，在更大范围里找最优解' },
        { label: '务实敢为', value: '2', extra:'直接体验，深入事实；不自嗨，注重效果；能突破有担当，打破定式；尝试多种可能，快速迭代' },
        { label: '开放谦逊', value: '3', extra: '内心阳光，信任伙伴；乐于助人和求助，合作成大事;格局大，上个台阶想问题；对外敏锐谦虚，ego小，听得进意见' },
        { label: '坦诚清晰', value: '4', extra: '敢当面表达真实想法；能承认错误，不装不爱面子；实事求是，暴露问题，反对“向上管理”；准确、简洁、直接，有条理有重点'}
    ];
    const optionsWithDisabled = [
        { label: 'Photography', value: 'Photography' },
        { label: 'Movies', value: 'Movies' },
        { label: 'Running', value: 'Running', disabled: false },
    ];
    return (
        <div>
            <CheckboxGroup options={plainOptions} defaultValue={['抖音']} onChange={onChange} />
            <br/><br/>
            <CheckboxGroup options={options} defaultValue={[]} onChange={onChange} />
            <br/><br/>
            <CheckboxGroup
                options={optionsWithDisabled}
                disabled
                defaultValue={['Photography']}
                onChange={onChange}
            />
        </div>
    );
};
```


### 水平排列

通过设置 `direction` 为 `horizontal` 或者 `vertical` 可以调整 CheckboxGroup 内的布局

```jsx live=true
import React from 'react';
import { CheckboxGroup } from '@douyinfe/semi-ui';

() => {
    const options = [
        { label: '抖音', value: 'abc' },
        { label: '火山', value: 'hotsoon' },
        { label: '皮皮虾', value: 'pipixia' },
        { label: '今日头条', value: 'toutiao' }
    ];
    return (
        <CheckboxGroup options={options} direction='horizontal' />
    );
};
```


### 受控

联动 checkbox。

```jsx live=true hideInDSM
import React from 'react';
import { Checkbox, Button } from '@douyinfe/semi-ui';

class App extends React.Component {

    constructor() {
        super();
        this.state = {
            checked: true,
            disabled: false,
        };
        this.toggleChecked = this.toggleChecked.bind(this);
        this.toggleDisable = this.toggleDisable.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    toggleChecked () {
        this.setState({ checked: !this.state.checked });
    };

    toggleDisable () {
        this.setState({ disabled: !this.state.disabled });
    };

    onChange (e) {
        console.log('checked = ', e.target.checked);
        this.setState({
            checked: e.target.checked,
        });
    };

    render() {
        const label = `${this.state.checked ? 'Checked' : 'Unchecked'} ${
            this.state.disabled ? 'Disabled' : 'Enabled'
        }`;
        return (
            <div>
                <p style={{ marginBottom: '20px' }}>
                    <Checkbox
                        checked={this.state.checked}
                        disabled={this.state.disabled}
                        onChange={this.onChange}
                    >
                        {label}
                    </Checkbox>
                </p>
                <p>
                    <Button type="primary" size="small" onClick={this.toggleChecked}>
                        {!this.state.checked ? 'Check' : 'Uncheck'}
                    </Button>
                    <Button
                        style={{ marginLeft: '10px' }}
                        type="primary"
                        size="small"
                        onClick={this.toggleDisable}
                    >
                        {!this.state.disabled ? 'Disable' : 'Enable'}
                    </Button>
                </p>
            </div>
        );
    }
}

```

### 全选

在实现全选效果时，你可能会用到 `indeterminate` 属性。

```jsx live=true
import React, { useState } from 'react';
import { Checkbox, CheckboxGroup } from '@douyinfe/semi-ui';

() => {
    const plainOptions = ['Photography', 'Movies', 'Running'];
    const [checkedList, setCheckedList] = useState(['Photography', 'Running']);
    const [indeterminate, setIndeterminate] = useState(true);
    const [checkAll, setCheckall] = useState(false);
    const onChange = (checkedList) => {
        setCheckedList(checkedList);
        setIndeterminate(!!checkedList.length && checkedList.length < plainOptions.length);
        setCheckall(checkedList.length === plainOptions.length);
    };
    const onCheckAllChange = (e) => {
        console.log(e);
        setCheckedList(e.target.checked ? plainOptions : []);
        setIndeterminate(false);
        setCheckall(e.target.checked);
    };

    return (
        <div>
            <div style={{ paddingBottom: 8, borderBottom: '1px solid var(--semi-color-border)' }}>
                <Checkbox
                    indeterminate={indeterminate}
                    onChange={onCheckAllChange}
                    checked={checkAll}
                >
                    Check all
                </Checkbox>
            </div>
            <CheckboxGroup
                style={{marginTop:6}}
                options={plainOptions}
                value={checkedList}
                onChange={onChange}
            />
        </div>
    );
};
```

### 卡片样式

version: >=1.30.0

可以给 CheckboxGroup 设置 `type='card'`，实现带有背景的卡片样式。

```jsx live=true dir="column"
import React from 'react';
import { CheckboxGroup, Checkbox } from '@douyinfe/semi-ui';

() => (
    <CheckboxGroup type='card' defaultValue={['1', '3']} direction='vertical'>
        <Checkbox value={'1'} disabled extra='Semi Design 是由互娱社区前端团队与 UED 团队共同设计开发并维护的设计系统' style={{width:280}}>
            单选框标题
        </Checkbox>
        <Checkbox value={'2'} disabled extra='Semi Design 是由互娱社区前端团队与 UED 团队共同设计开发并维护的设计系统' style={{width:280}}>
            单选框标题
        </Checkbox>
        <Checkbox value={'3'} extra='Semi Design 是由互娱社区前端团队与 UED 团队共同设计开发并维护的设计系统' style={{width:280}}>
            单选框标题
        </Checkbox>
        <Checkbox value={'4'} extra='Semi Design 是由互娱社区前端团队与 UED 团队共同设计开发并维护的设计系统' style={{width:280}}>
            单选框标题
        </Checkbox>
    </CheckboxGroup>
);
```
### 无 checkbox 的纯卡片样式

version: >=1.30.0

可以给 CheckboxGroup 设置 `type='pureCard'`，实现带有背景且无 checkbox 的纯卡片样式。

```jsx live=true dir="column"
import React from 'react';
import { CheckboxGroup, Checkbox } from '@douyinfe/semi-ui';

() => (
    <CheckboxGroup type='pureCard' defaultValue={['1', '3']} direction='vertical'>
        <Checkbox value={'1'} disabled extra='Semi Design 是由互娱社区前端团队与 UED 团队共同设计开发并维护的设计系统' style={{width:280}}>
            单选框标题
        </Checkbox>
        <Checkbox value={'2'} extra='Semi Design 是由互娱社区前端团队与 UED 团队共同设计开发并维护的设计系统' style={{width:280}}>
            单选框标题
        </Checkbox>
        <Checkbox value={'3'} extra='Semi Design 是由互娱社区前端团队与 UED 团队共同设计开发并维护的设计系统' style={{width:280}}>
            单选框标题
        </Checkbox>
    </CheckboxGroup>
);
```

### 配合grid布局

Checkbox.Group 内嵌 Checkbox 并与 Grid 组件一起使用，可以实现灵活的布局。

```jsx live=true hideInDSM
import React from 'react';
import { Checkbox, CheckboxGroup, Row, Col } from '@douyinfe/semi-ui';

() => (
    <CheckboxGroup style={{ width: '100%' }}>
        <Row>
            <Col span={8}>
                <Checkbox value="A">A</Checkbox>
            </Col>
            <Col span={8}>
                <Checkbox value="B">B</Checkbox>
            </Col>
            <Col span={8}>
                <Checkbox value="C">C</Checkbox>
            </Col>
            <Col span={8}>
                <Checkbox value="D">D</Checkbox>
            </Col>
            <Col span={8}>
                <Checkbox value="E">E</Checkbox>
            </Col>
        </Row>
    </CheckboxGroup>
);
```

## API参考

### Checkbox

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| checked | 指定当前Checkbox是否选中（在Group中使用时无效） | boolean | false |
| defaultChecked | 初始是否选中（在Group中使用时无效） | boolean | false |
| disabled | 失效状态 | boolean | false |
| extra | 副文本<br/>__v0.25.0后提供__ | ReactNode | - |
| value | 该checkbox在CheckboxGroup中代表的value | any | - |
| indeterminate | 设置 indeterminate 状态，只负责样式控制 | boolean | false |
| onChange | 变化时回调函数 | function(e:Event) | - |

### Checkbox Group

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| defaultValue | 组内默认选中的选项，会与Checkbox的value值做匹配 | any\[] | \[] |
| direction | 组内checkbox布局，可选水平```horizontal```或```vertical``` | string | `vertical` |
| disabled | 整组失效 | boolean | false |
| name | CheckboxGroup 下所有 `input[type="checkbox"]` 的 `name` 属性 | string | - |
| options | 指定可选项 | any\[] | \[] |
| type |	设置所有 checkbox 的样式类型，可选值为: `default`、`card`、`pureCard` **v1.30.0 后提供**|string|`default`|
| value | 指定选中的选项 | any\[] | \[] |
| onChange | 变化时回调函数 | function(checkedValue) | - |

### 方法

#### Checkbox

| 名称 | 描述 |
| --- | --- |
| blur() | 移除焦点 |
| focus() | 获取焦点 |

## 设计变量
<DesignToken/>

<!-- ## 相关物料
```material
45, 64, 73, 89, 123
``` -->