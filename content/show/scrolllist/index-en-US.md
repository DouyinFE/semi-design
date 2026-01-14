---
localeCode: en-US
order: 79
category: Show
title:  ScrollList
subTitle: ScrollList
icon: doc-scrolllist
brief: Scroll through the list.
---


## Demos

### How to import

```jsx import 
import { ScrollList, ScrollItem } from '@douyinfe/semi-ui';
```
### Basic Usage

The scrolling list provides a scrolling selection mode similar to the iOS operating system, while supporting scrolling to the specified window location selection and click selection.

```jsx live=true
import React, { useState } from 'react';
import { ScrollList, ScrollItem, Button } from '@douyinfe/semi-ui';

() => {
    const [selectIndex1, setSelectIndex1] = useState(1);
    const [selectIndex2, setSelectIndex2] = useState(1);
    const [selectIndex3, setSelectIndex3] = useState(1);

    const ampms = [{
        value: 'AM',
    }, {
        value: 'PM',
    }];

    const hours = new Array(12).fill(0).map((itm, index) => {
        return {
            value: index + 1
        };
    });

    const minutes = new Array(60).fill(0).map((itm, index) => {
        return {
            value: index,
            disabled: Math.random() > 0.5 ? true : false
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
        <ScrollList style={scrollStyle} header={'Infinite Scroll List'} footer={renderFooter()}>
            <ScrollItem mode="wheel" cycled={false} list={ampms} type={1} selectedIndex={selectIndex1} onSelect={onSelectAP} />
            <ScrollItem mode="wheel" cycled={true} list={hours} type={2} selectedIndex={selectIndex2} onSelect={onSelectHour} />
            <ScrollItem mode="wheel" cycled={true} list={minutes} type={3} selectedIndex={selectIndex3} onSelect={onSelectMinute} />
        </ScrollList>
    );
};
```

## API Reference

### ScrollList

| Properties | Instructions | type   | Default |
| ---------- | ------------ | ------ | ------- |
| bodyHeight   | height of scroll list body   | number \| string | 300  |
| className   | classname of wrapper   | string | ''      |
| footer     | Bottom addon | ReactNode | ''      |
| header     | Head addon   | ReactNode | ''      |
| style     | inline style   | CSSProperties | {}      |

### ScrollItem

| Properties  | Instructions                                                                         | type                     | Default |
| ----------- | ------------------------------------------------------------------------------------ | ------------------------ | ------- |
| cycled      | Whether it is an infinite loop, effective only if the mode is "wheel"                | boolean                  | false   |
| className   | classname of scroll item                | string                  | ''   |
| list        | List content                                                                         | [Item Data](#ItemData)[] | []      |
| mode        | mode selection                                                                       | "normal" \| "wheel"      | "wheel"|
| motion      | Whether to start the scroll animation                                                | Motion                  | true    |
| onSelect    | Select callback                                                                      | (data: [ItemData](#ItemData)) => void                 | NOOP    |
| selectedIndex | Index of selected items                                                              | number                   | 0       |
| style | Inline style                                                              | CSSProperties                   | {}       |
| transform   | For the Transformation of the selected item, the return value is displayed as a copy | (value: any, text: string) => string                 | v = > v |

#### ItemData

| Properties | Instructions                                                                                                                                                                                                    | type     | Default |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------- |
| disabled   | Whether the item is prohibited or not                                                                                                                                                                           | boolean  |         |
| text       | The copy of each item.                                                                                                                                                                                          | string   |         |
| transform  | When the transformation is in the selected state, the return value is displayed as a copy, and if the ScrollItem component is passed at the same time, the transform method in ItemData will be selected first. | (value: any, text: string) => string | v = > v |
| value      | The value of each item                                                                                                                                                                                          | any       |         |


## Accessibility

### ARIA

- `ScrollItem` support `aria-label`, indicates the label of current column.
- `ScrollItem` uses `aria-disabled` to indicate whether the item is disabled
- `ScrollItem` uses `aria-selected` to indicate whether the item is selected

## Design Tokens
<DesignToken/>