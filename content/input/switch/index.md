---
localeCode: zh-CN
order: 27
category: 输入类
title:  Switch 开关
icon: doc-switch
width: 60%
brief: 开关是用于切换两种互斥状态的交互形式
---


## 代码演示

### 如何引入

```jsx import
import { Switch } from '@douyinfe/semi-ui';
```
### 基本

```jsx live=true
import React from 'react';
import { Switch } from '@douyinfe/semi-ui';

() => (
    <div>
        <Switch onChange={(v, e) => console.log(v)}>
        </Switch>
        <br/>
        <Switch defaultChecked={true} onChange={(v, e) => console.log(v)}>
        </Switch>
    </div>
);
```

### 尺寸

```jsx live=true
import React from 'react';
import { Switch } from '@douyinfe/semi-ui';

() => (
    <div>
        <Switch size='small'></Switch>
        <Switch defaultChecked={true} size='small'></Switch>
        <Switch size='small' loading/>
        <Switch size='small' loading defaultChecked={true} />
        <br/><br/>
        <Switch></Switch>
        <Switch defaultChecked={true}></Switch>
        <Switch loading />
        <Switch loading defaultChecked={true} />
        <br/><br/>
        <Switch size='large'></Switch>
        <Switch defaultChecked={true} size='large'></Switch>
        <Switch size='large' loading/>
        <Switch size='large' loading defaultChecked={true} />
    </div>
);
```

### 不可用

```jsx live=true
import React from 'react';
import { Switch } from '@douyinfe/semi-ui';

() => (
    <div>
        <Switch disabled></Switch>
        <br/>
        <Switch disabled checked={true}></Switch>
    </div>
);
```

### 带文本

可以通过 `checkedText` 与 `uncheckedText` 设置开关时的文本  
注意：此项功能在最小的开关(即 size='small'时)无效  


```jsx live=true
import React from 'react';
import { Switch } from '@douyinfe/semi-ui';

() => (
    <div>
        <Switch checkedText='开' uncheckedText='关' />
        <Switch checkedText='｜' uncheckedText='〇' style={{marginLeft:5}}/>
        <br/><br/>
        <Switch defaultChecked checkedText='开' uncheckedText='关' />
        <Switch defaultChecked checkedText='｜' uncheckedText='〇' style={{marginLeft:5}}/>
        <br/><br/>
        <Switch checkedText='开' uncheckedText='关' size='large' />
        <Switch checkedText='｜' uncheckedText='〇' size='large' style={{marginLeft:5}}/>
        <br/><br/>
        <Switch defaultChecked checkedText='开' uncheckedText='关' size='large' />
        <Switch defaultChecked checkedText='｜' uncheckedText='〇' size='large' style={{marginLeft:5}}/>
    </div>
);
```

相比于通过chekedText与uncheckedText设置内嵌的文本，我们更推荐将文本说明放置在Switch外部
```jsx live=true
import React, { useState } from 'react';
import { Switch, Typography } from '@douyinfe/semi-ui';

() => {
    const [open, setOpen] = useState();
    const { Title } = Typography;
    return (
        <div style={{display:'flex', alignItems: 'center'}}>
            <Title heading={6} style={{margin: 8}}>{open?'已开启':'已关闭'}</Title>
            <Switch checked={open} onChange={setOpen}/>
        </div>
    );
};
```

### 受控组件

组件是否选中完全取决于传入的 checked 值，配合 onChange 回调函数使用

```jsx live=true hideInDSM
import React from 'react';
import { Switch } from '@douyinfe/semi-ui';

class Demo extends React.Component {
    constructor() {
        super();
        this.state = {
            checked: true,
        };
        this.onChange = this.onChange.bind(this);
    }
    onChange(checked) {
        this.setState({ checked });
    }
    render() {
        return (
            <>
                <Switch
                    checked={this.state.checked}
                    onChange={this.onChange}>
                </Switch>
            </>
        );
    }
}
```

### 加载中

version: >= 1.29.0

可以通过设置 loading="true" 开启加载中状态。

```jsx live=true
import React from 'react';
import { Switch } from '@douyinfe/semi-ui';

() => (
    <div>
        <Switch loading />
        <br />
        <Switch loading defaultChecked={true} />
    </div>
);
```

## API 参考

| 属性           | 说明                                     | 类型                      | 默认值    |版本|
| -------------- | ---------------------------------------- | ------------------------- | --------- |--------- |
| className      | 类名                                     | string                    |           |
| checked        | 指示当前是否选中,配合 onChange 使用      | boolean                   | false     ||
| checkedText    | 打开时展示的内容, size为small时无效 | ReactNode                 |           |0.25.0|
| defaultChecked | 初始是否选中                             | boolean                   | false     ||
| disabled       | 是否禁用                                 | boolean                   | false     ||
| loading        | 设置加载状态                                 | boolean                   | false     |1.29.0|
| onChange       | 变化时回调函数                           | function(checked:boolean) |           ||
| onMouseEnter   | 鼠标移入时回调                        | function()                |           ||
| onMouseLeave   | 鼠标移出时回调                        | function()                |           ||
| size           | 尺寸,可选值`large`,`default`,`small`     | string                    | 'default' ||
| style           | 内联样式     | object                    | ||
| uncheckedText  | 关闭时展示的内容, size为small时无效 | ReactNode                 |           |0.25.0|

## 设计变量
<DesignToken/>