---
localeCode: zh-CN
order: 63
category: 反馈类
title: Progress 进度条
icon: doc-progress
width: 60%
brief: 展示操作的当前进度。
---

## 何时使用

在操作需要较长时间才能完成时，为用户显示该操作的当前进度和状态

## 代码演示

### 如何引入

```jsx import
import { Progress } from '@douyinfe/semi-ui';
```

### 标准的进度条

通过`stroke`属性来控制进度条的填充色  
通过`percent`属性控制已完成的进度  
通过`size`属性控制进度条尺寸  
如果`size`预设的尺寸不满足，可以通过`style`传入 height 自定义进度条高度

```jsx live=true
import React from 'react';
import { Progress } from '@douyinfe/semi-ui';

() => (
    <div style={{ width: 200 }}>
        <Progress percent={10} stroke="#fc8800" />
        <br />
        <Progress percent={25} stroke="#f93920" />
        <br />
        <Progress percent={50} />
        <br />
        <Progress percent={80} />
        <br />
        <Progress percent={80} size="large" />
        <br />
        <Progress percent={80} style={{ height: '8px' }} />
    </div>
)
```

### 展示百分比文本

通过`showInfo`控制是否展示百分比数字，可以通过`format`格式化展示文本

```jsx live=true
import React from 'react';
import { Progress } from '@douyinfe/semi-ui';

() => (
    <div style={{ width: 200 }}>
        <Progress percent={10} stroke="#fc8800" showInfo={true} />
        <br />
        <Progress percent={25} stroke="#f93920" showInfo={true} />
        <br />
        <Progress percent={50} showInfo={true} />
        <br />
        <Progress percent={50} showInfo={true} format={percent => percent * 10 + '‰'} />
    </div>
)
```

### 垂直的进度条

设置`direction='vertical'`，展示垂直进度条，可以通过`style`传入 width 控制进度条宽度

```jsx live=true
import React from 'react';
import { Progress } from '@douyinfe/semi-ui';

() => (
    <div style={{ height: 100, display: 'flex' }}>
        <Progress percent={10} direction="vertical" />
        <Progress percent={25} direction="vertical" />
        <Progress percent={50} direction="vertical" />
        <Progress percent={80} direction="vertical" size="large" />
        <Progress percent={80} direction="vertical" style={{ width: '8px' }} />
    </div>
)
```

### 环形进度条

将 type 设为`circle`，进度条将会展示成环状。进度条默认尺寸为 72 x 72

```jsx live=true
import React from 'react';
import { Progress } from '@douyinfe/semi-ui';

() => (
    <div>
        <Progress percent={10} type="circle" style={{ margin: 5 }} />
        <Progress percent={25} type="circle" style={{ margin: 5 }} />
        <Progress percent={50} type="circle" style={{ margin: 5 }} />
        <Progress percent={80} type="circle" style={{ margin: 5 }} />
    </div>
)
```

你可以通过修改`width`来控制环形进度条的大小

```jsx live=true
import React from 'react';
import { Progress } from '@douyinfe/semi-ui';

() => (
    <React.Fragment>
        <div>
            <Progress percent={100} type="circle" width={100} style={{ margin: 5 }} />
        </div>
        <div>
            <Progress percent={100} type="circle" width={100} style={{ margin: 5 }} stroke="#f93920" />
        </div>
    </React.Fragment>
)
```

### 小号的环形进度条

小号进度条默认尺寸为 24 x 24

```jsx live=true
import React from 'react';
import { Progress } from '@douyinfe/semi-ui';

() => (
    <React.Fragment>
        <Progress percent={10} type="circle" size="small" style={{ margin: 5 }} />
        <Progress percent={25} type="circle" size="small" style={{ margin: 5 }} />
        <Progress percent={50} type="circle" size="small" style={{ margin: 5 }} />
        <Progress percent={80} type="circle" size="small" style={{ margin: 5 }} />
    </React.Fragment>
)
```

### 动态改变进度

```jsx live=true
import React from 'react';
import { Progress } from '@douyinfe/semi-ui';
import React, { useState } from 'react';
import { IconChevronLeft, IconChevronRight } from '@douyinfe/semi-icons';

() => {
    const [percent, setPercent] = useState(40);
    return (
        <>
            <div>
                <Progress percent={percent} showInfo />
                <Button
                    icon={<IconChevronLeft />}
                    theme="light"
                    onClick={() => {
                        setPercent(percent - 10);
                    }}
                    disabled={percent === 0}
                />
                <Button
                    icon={<IconChevronRight />}
                    theme="light"
                    onClick={() => {
                        setPercent(percent + 10);
                    }}
                    disabled={percent >= 100}
                />
            </div>
        </>
    );
};
```

```jsx live=true
import React from 'react';
import { Progress } from '@douyinfe/semi-ui';
import React, { useState } from 'react';
import { IconChevronLeft, IconChevronRight } from '@douyinfe/semi-icons';

() => {
    const [cirPerc, setCirPerc] = useState(40);
    return (
        <div>
            <div>
                <Progress percent={cirPerc} type="circle" />
            </div>
            <Button
                icon={<IconChevronLeft />}
                theme="light"
                onClick={() => {
                    setCirPerc(cirPerc - 10);
                }}
                disabled={cirPerc === 0}
            />
            <Button
                icon={<IconChevronRight />}
                theme="light"
                onClick={() => {
                    setCirPerc(cirPerc + 10);
                }}
                disabled={cirPerc >= 100}
            />
        </div>
    );
};
```

### 自定义中心文字内容

你可以通过传入 `format` 函数自定义中心文字，`format` 的入参为当前百分比  
如果不需要中心文本内容，你可以将 `showInfo` 设为 false，或者在 `format` 中直接返回空字符串

```jsx live=true
import React from 'react';
import { Progress } from '@douyinfe/semi-ui';

() => (
    <React.Fragment>
        <Progress percent={75} showInfo type="circle" format={per => per + 'Days'} style={{ margin: 10 }} />
        <Progress percent={100} showInfo type="circle" format={per => 'Done'} style={{ margin: 10 }} />
        <Progress percent={50} showInfo type="circle" showInfo={false} style={{ margin: 10 }} />
    </React.Fragment>
)
```

### 圆角/方角边缘

通过 strokeLinecap 属性，你可以控制环形进度条边缘形状

```jsx live=true
import React from 'react';
import { Progress } from '@douyinfe/semi-ui';

() => (
    <React.Fragment>
        <Progress percent={50} strokeLinecap="round" type="circle" style={{ margin: 10 }} />
        <Progress percent={50} strokeLinecap="square" type="circle" style={{ margin: 10 }} />
    </React.Fragment>
)
```

## API 参考

|属性 | 说明 | 类型 | 默认值 |
|--- | --- | --- | --- |
|className | 样式类名 | string |  |
|direction | 条状进度条方向 `horizontal`、`vertical` | string | 'horizontal' |
|format | 格式化函数，入参为当前百分比，return 的结果将会直接渲染在圆形进度条中心 | (percent: number) => ReactNode | (percent) => percent + '%' |
|orbitStroke | 进度条轨道填充色<br/>**v1.0.0 后提供** | string | 'var(--semi-color-fill-0)' |
|percent | 进度百分比 | number |  |
|showInfo | 环形进度条是否显示中间文本，条状进度条后右侧是否显示文本 | boolean | false |
|size | 尺寸,可选`default`、`small`(仅 type=circle 生效)、`large`(仅 type=line 生效) | string | 'default' |
|stroke | 进度条填充色 | string | 'var(--semi-color-success)' |
|strokeLinecap | 圆角`round`/方角`square`(仅在 type='circle'模式下生效) | string | 'round' |
|strokeWidth | type 为`line`时，该属性控制进度条高度; type 为`circle`时，该属性控制进度条宽度 | number | 4 |
|style | 样式 | CSSProperties |  |
|type | 类型，可选`line`、`circle` | string | 'line' |
|width | 环形进度条宽度 | number | size='default'时为 72，'small'为 24 |

## 设计变量

<DesignToken/>
