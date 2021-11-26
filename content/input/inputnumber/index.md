---
localeCode: zh-CN
order: 22
category: 输入类
title: InputNumber 数字输入框
icon: doc-inputnumber
brief: 通过鼠标或键盘，输入范围内的数值。
---


## 何时使用

当需要获取标准数值时。

## 代码演示

### 如何引入

```jsx import
import { InputNumber } from '@douyinfe/semi-ui';
```
### 基本输入框

```jsx live=true
import React from 'react';
import { InputNumber } from '@douyinfe/semi-ui';

() => (
    <div style={{ width: 280 }}>
        <label>简单数字输入框</label>
        <InputNumber />
        <br/><br/>

        <label>设置了步长 step=2 </label>
        <InputNumber step={2} />
        <br/><br/>

        <label>设置 shiftStep=100， 按住 shift 同时点击按钮，可以一次增加/减少100 </label>
        <InputNumber shiftStep={100} />
        <br/><br/>

        <label>设置了上下界 min=1,max=10</label>
        <InputNumber min={1} max={10} defaultValue={1} />
        <br/><br/>
    </div>
);
```

```jsx live=true
import React from 'react';
import { InputNumber } from '@douyinfe/semi-ui';

() => (
    <div style={{ width: 280 }}>
        <label>设置了默认值 defaultValue=1 </label>
        <InputNumber defaultValue={1} />
        <br/><br/>

        <label>禁用 disabled=true</label>
        <InputNumber defaultValue={2} disabled />
        <br/><br/>

        <label>自动获得焦点 autofocus=true </label>
        <InputNumber defaultValue={3} autofocus />
        <br/><br/>

        <label>设置了小数位数 precision=2 </label>
        <InputNumber precision={2} defaultValue={1.234} />
        <br/><br/>

        <label>设置了 innerButtons=true </label>
        <InputNumber innerButtons={true} suffix={'小时'} defaultValue={1} style={{ width: 190}} />
        <br/>
    </div>
);
```


### 隐藏步进器

通过innerButtons，你可以将右侧的步进器隐藏进内部，仅hover时才会显示

```jsx live=true
import React from 'react';
import { InputNumber } from '@douyinfe/semi-ui';

() => (
    <InputNumber innerButtons style={{ width: 190}} />
);
```

hideButtons设为true，彻底隐藏步进器

```jsx live=true
import React from 'react';
import { InputNumber } from '@douyinfe/semi-ui';

() => (
    <InputNumber hideButtons style={{ width: 190}} />
);
```

### 尺寸

```jsx live=true
import React from 'react';
import { InputNumber } from '@douyinfe/semi-ui';

() => (
    <div style={{ width: 180 }}>
        <label>默认尺寸 size=default</label>
        <InputNumber />
        <br/><br/>

        <label>大尺寸 size=large</label>
        <InputNumber size="large" />
        <br/><br/>

        <label>小尺寸 size=small</label>
        <InputNumber size="small" />
        <br/>
    </div>
);
```

### 自定义显示格式与解析方式

> formatter 和 parser 一对方法，一般需要同时设置，否则无法正确解析值

```jsx live=true
import React from 'react';
import { InputNumber } from '@douyinfe/semi-ui';

() => {
    const log = (v) => {
        console.log(`Changed to: [${typeof v}] ${v}`);
    };

    return (
        <div style={{ width: 180 }}>
            <label>人民币</label>
            <InputNumber
                onChange={this.log}
                defaultValue={1000}
                min={0}
                formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\￥\s?|(,*)/g, '')}
            />
            <br/><br/>

            <label>自定义串</label>
            <InputNumber
                onChange={this.log}
                defaultValue={1111}
                formatter={value => String(value).split('').join('-')}
                parser={value => value.replace(/\-/g, '')}
            />
            <br/>
        </div>
    );
};
```

### 纯数字输入框
搭配 formatter 和 onNumberChange（**>=v1.9.0**） 可以实现纯数字输入框。

```jsx live=true
import React from 'react';
import { InputNumber } from '@douyinfe/semi-ui';

function Demo () {
    return (
        <InputNumber
            formatter={value => `${value}`.replace(/\D/g, '')}
            onNumberChange={number => console.log(number)}
            min={0}
            max={Number.MAX_SAFE_INTEGER}
        />
    );
}
```

## API 参考

| 属性         | 说明                                                           | 类型                              | 默认值    | 版本      |
| ------------ | -------------------------------------------------------------- | --------------------------------- | --------- | --------- |
| autofocus    | 自动获取焦点                                                   | boolean                           | false     |           |
| className | 类名                                                               | string  | -      |
| defaultValue | 默认值                                                         | number                            |           |           |
| disabled     | 禁用                                                           | boolean                           | false     |           |
| formatter    | 指定输入框展示值的格式                                         | (value: number\|string) => string | -         |           |
| hideButtons  | 为 `true` 时隐藏 “上/下” 按钮                                  | boolean                           | false     | **1.0.0** |
| innerButtons | 为 `true` 时 “上/下” 按钮显示在输入框内部                                  | boolean                           | false     | **1.5.0** |
| insetLabel   | 前缀标签，优先级低于 `prefix`                                  | string\|ReactNode                 |           |           |
| keepFocus    | 点击按钮时保持输入框聚焦                                        | boolean                 |     false      |   **1.10.0**        |
| max          | 限定最大值                                                     | number                            | Infinity  |           |
| min          | 限定最小值                                                     | number                            | -Infinity |           |
| parser       | 指定从 `formatter` 里转换回数字串的方式，和 `formatter` 搭配使用 | (str: string) => string           | -         |           |
| precision    | 数值精度                                                       | number                            | -         |           |
| prefixCls    | 前缀内容                                                       | string\|ReactNode                 |           |           |
| pressInterval| 长按按钮时，多久触发一次点击事件，单位毫秒                                   | number                 |   250        |           |
| pressTimeout | 长按按钮时，延迟多久后触发点击事件，单位毫秒                                                      | number                 |     250      |           |
| shiftStep    | 按住 shift 键每次改变步数，可以为小数                           | number                            | 1         | **1.5.0** |
| showClear    | 是否显示清除按钮                                               | boolean                           | false     | **0.35.0**   |
| size         | 输入框大小，可选值："default"\|"small"\|"large"                | string                            | 'default' |           |
| step         | 每次改变步数，可以为小数                                       | number                            | 1         |           |
| style     | 样式                                                               | CSSProperties  | -      |
| suffix       | 自定义后缀                                                     | ReactNode                         |           |           |
| value        | 当前值                                                         | number                            |           |           |
| onBlur       | 失去焦点时的回调                                               | (e: domEvent) => void             | () => {}  | **1.0.0** |
| onChange     | 变化回调                                                       | (value: number\|string) => void   | -         |           |
| onFocus      | 获得焦点时的回调                                               | (e: domEvent) => void             | () => {}  | **1.0.0** |
| onNumberChange | 数字变化回调                                                  | (value: number) => void   | -         |     **1.9.0**      |

## Methods

| 名称    | 描述     |
| ------- | -------- |
| blur()  | 移出焦点 |
| focus() | 获取焦点 |

## 设计变量
<DesignToken/>