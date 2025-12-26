---
localeCode: zh-CN
order: 78
category: 展示类
title: ScrollList 滚动列表
icon: doc-scrolllist
brief: 滚动列表。
---

## 代码演示

### 如何引入

```jsx import
import { ScrollList, ScrollItem } from '@douyinfe/semi-ui';
```

### 基本使用

滚动列表提供了一个类似于 iOS 操作系统的滚动选择模式，同时支持滚动至指定窗口位置选择与点击选择。

```jsx live=true
import React, { useState } from 'react';
import { ScrollList, ScrollItem, Button } from '@douyinfe/semi-ui';

() => {
    const [selectIndex1, setSelectIndex1] = useState(1);
    const [selectIndex2, setSelectIndex2] = useState(1);
    const [selectIndex3, setSelectIndex3] = useState(1);

    const ampms = [
        {
            value: '上午',
        },
        {
            value: '下午',
        },
    ];

    const hours = new Array(12).fill(0).map((itm, index) => {
        return {
            value: index + 1,
        };
    });

    const minutes = new Array(60).fill(0).map((itm, index) => {
        return {
            value: index,
            disabled: Math.random() > 0.5 ? true : false,
        };
    });

    const onSelectAP = (data) => {
        if (data.type === 1) {
            setSelectIndex1(data.index);
        }
    };

    const onSelectHour = (data) => {
        console.log('You have choose the hour for: ', data.value);
        if (data.type === 2) {
            setSelectIndex2(data.index);
        }
    };

    const onSelectMinute = (data) => {
        console.log('You have choose the minute for: ', data.value);
        if (data.type === 3) {
            setSelectIndex3(data.index);
        }
    };

    const handleClose = () => {
        console.log('close');
    };

    const renderFooter = () => {
        return (
            <Button size="small" type="primary" onClick={handleClose}>
                Ok
            </Button>
        );
    };

    const scrollStyle = {
        border: 'unset',
        boxShadow: 'unset',
    };
    
    return (
        <ScrollList style={scrollStyle} header={'无限滚动列表'} footer={renderFooter()}>
            <ScrollItem
                mode="wheel"
                cycled={false}
                list={ampms}
                type={1}
                selectedIndex={selectIndex1}
                onSelect={onSelectAP}
            />
            <ScrollItem
                mode="wheel"
                cycled={true}
                list={hours}
                type={2}
                selectedIndex={selectIndex2}
                onSelect={onSelectHour}
            />
            <ScrollItem
                mode="wheel"
                cycled={true}
                list={minutes}
                type={3}
                selectedIndex={selectIndex3}
                onSelect={onSelectMinute}
            />
        </ScrollList>
    );
};
```

## API 参考

### ScrollList

| 属性   | 说明       | 类型   | 默认值 |
| ------ | ---------- | ------ | ------ |
| bodyHeight | body高度 | string \| number |   |
| className | 样式类名 | string | ''     |
| footer | 底部 addon | ReactNode | ''     |
| header | 头部 addon | ReactNode | ''     |
| style  | 内联样式 | CSSProperties | {}     |

### ScrollItem

| 属性        | 说明                                                | 类型                                | 默认值 |
| ----------- | -------------------------------------------------- | ----------------------------------- | ------ |
| className   | 样式类名 | string                                   | ''                                  |
| cycled      | 是否为无限循环，仅在 mode 为 "wheel" 时生效 | boolean  | false                                |
| list        | 列表内容                                            | [ItemData](#ItemData)[]              | []     |
| mode        | 模式选择                                            | "normal" \| "wheel"                  | "wheel"|
| motion      | 是否开启滚动动画                                     | Motion                                | true   |
| onSelect    | 选中回调                                            | (data: [ItemData](#ItemData)) => void| NOOP   |
| selectedIndex | 选中项的索引                                         | number                               | 0      |
| style       | 内联样式                                            | CSSProperties                        | {}      |
| transform   | 对选中项的变换，返回值会作为文案进行显示                  | (value: any, text: string) => string | v => v |

#### ItemData

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| disabled | 该项是否被禁止选择 | boolean |  |
| text | 每一项的文案 | string |  |
| transform | 该项处于选中状态时的变换，返回值会作为文案进行显示，ScrollItem 组件如果同时传入会优先选择 ItemData 中的 transform 方法 | (value: any, text: string) => string | v => v |
| value | 每一项的值 | any |  |


## Accessibility

### ARIA

- `ScrollItem` 支持传入 `aria-label`, 指定该列标签
- `ScrollItem` 使用 `aria-disabled` 表示该项目是否被禁用
- `ScrollItem` 使用 `aria-selected` 表示该项目是否被选中

## 设计变量

<DesignToken/>
