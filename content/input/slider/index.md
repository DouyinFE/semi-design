---
localeCode: zh-CN
order: 26
category: 输入类
title:  Slider 滑动选择器
icon: doc-slider
brief: 滑动选择器帮助用户快速输入连续或离散的数值，或由这些数值组成的一段数值范围。
---


## 代码演示

### 如何引入

```jsx import
import { Slider } from '@douyinfe/semi-ui';
```
### 基本用法
基本滑动条。当 `range` 为 `true` 时，支持两侧滑动。当 `disabled` 为 `true` 时，滑块处于不可用状态。
```jsx live=true
import React from 'react';
import { Slider } from '@douyinfe/semi-ui';

() => (
    <div>
        <div>
            <div>Default</div>
            <Slider showBoundary={true}></Slider>
        </div>
        <br/>
        <br/>
        <div>
            <div>Range</div>
            <Slider defaultValue={[20, 60]} range></Slider>
        </div>
        <br/>
        <br/>
        <div>
            <div>Disabled</div>
            <Slider defaultValue={40} disabled></Slider>
        </div>
    </div>
);
```

### 带输入框的
滑动条的滑块和输入框组件保持同步。
```jsx live=true
import React from 'react';
import { Slider, InputNumber } from '@douyinfe/semi-ui';

class InputSlider extends React.Component {
    constructor(props) {
        super();
        this.state = { value: 10 };
        this.getSliderValue = this.getSliderValue.bind(this);
    }

    getSliderValue(value) {
        if (isNaN(Number(value))){
            return;
        }
        this.setState({ value: value / 1 }); 
    }

    render() {
        const { value } = this.state;
        return (
            <div>
                <div style={{ width: 320, marginRight: 15 }}>
                    <Slider step={1} value={value} onChange={(value) => (this.getSliderValue(value))} ></Slider>
                </div>
                <InputNumber onChange={(v) => this.getSliderValue(v)} style={{width: 100}} value={value} min={0} max={100} />
            </div>
        );
    }
}
```

### 自定义提示
使用 `tipFormatter` 可以设置 Tooltip 的显示的格式。设置 `tipFormatter={null}`，则隐藏 Tooltip。
```jsx live=true
import React from 'react';
import { Slider } from '@douyinfe/semi-ui';

() => (
    <div>
        <Slider tipFormatter={v => (`${v}%`)} />
        <br/>
        <br/>
        <Slider tipFormatter={null} />
    </div>
);
```

### 带标签的
使用 `marks` 属性标注滑块的刻度，使用 `value` / `defaultValue` 指定滑块位置。
```jsx live=true
import React from 'react';
import { Slider } from '@douyinfe/semi-ui';

() => (
    <div>
        <div>step=10</div>
        <Slider step={10} marks={{ 0: '0', 10: '10', 20: '20', 30: '30', 40: '40', 50: '50', 100: '100' }} defaultValue={[10, 100]} range={true}></Slider>
        <br/>
        <br/>
        <div>step=0.1</div>
        <Slider step={0.1} marks={{ 0.1: '0.1', 0.2: '0.2', 0.3: '0.3', 0.4: '0.4', 0.5: '0.5' }} min={0} max={1} defaultValue={[0.1, 0.5]} range={true}></Slider>
        <br/>
        <br/>
        <div>Marks</div>
        <Slider marks={{ 20: '20c', 40: '40c' }} defaultValue={[0, 100]} range={true} ></Slider>
        <br/>
        <br/>
        <div>Inclued</div>
        <Slider marks={{ 20: '20c', 40: '40c' }} included={false} defaultValue={[0, 100]} range={true}></Slider>
    </div>
);
```

### 分段背景
通过使用 `linear-gradient` 及 `railStyle` ，配合 onChange 可以实现动态的分段背景效果。
```jsx live=true
import React from 'react';
import { Slider } from '@douyinfe/semi-ui';

class SegSlider extends React.Component {
    constructor(props) {
        super();
        this.state = { value: [20, 60] };
        this.changeValue = this.changeValue.bind(this);
        this.getRailStyle = this.getRailStyle.bind(this);
    }

    changeValue(value) {
        this.setState({ value });
    }

    getRailStyle(range) {
    // color of second segment inherits from .semi-slider-track
        const color = ['var(--semi-color-danger)', 'transparent', 'var(--semi-color-success)'];
        const gradientPos = this.state.value.map(val => 
            ((val - range[0]) / (range[1] - range[0])).toFixed(2) * 100
        );
        const style = {
            background: `linear-gradient(to right, ${color[0]} ${gradientPos[0]}%, ${color[1]} ${gradientPos[0]}%, ${color[1]} ${gradientPos[1]}%, ${color[2]} ${gradientPos[1]}%)`
        };
        return style;
    }

    render() {
        const range = [10, 100];
        const railStyle = this.getRailStyle(range);
        return (
            <Slider
                range
                min={range[0]}
                max={range[1]}
                onChange={this.changeValue}
                railStyle={railStyle}
                defaultValue={this.state.value}
            />
        );
    }
}
```

### 受控组件
滑块位置即 `Slider` 的值由 value 控制，配合 onChange 使用。
```jsx live=true hideInDSM
import React from 'react';
import { Slider, Button } from '@douyinfe/semi-ui';

class ControllSlider extends React.Component {
    constructor(props) {
        super();
        this.state = { value: 10 };
        this.changeValue = this.changeValue.bind(this);
    }

    changeValue() {
        this.setState({ value: this.state.value + 10 });
    }

    render() {
        return (
            <div>
                <Button onClick={this.changeValue} style={{ marginRight: 20 }}>点击改变value值</Button>
                <br/>
                <br/>
                <Slider value={this.state.value}></Slider>
            </div>
        );
    }
}
```

### 垂直
```jsx live=true
import React from 'react';
import { Slider } from '@douyinfe/semi-ui';

() => (
    <div>
        <div style={{height: 300, marginLeft: 30, marginTop: 10, paddingRight: 30, display: 'inline-block'}}>
            <Slider vertical></Slider>
        </div>
        <div style={{height: 300, marginLeft: 30, marginTop: 10, paddingRight: 30, display: 'inline-block'}}>
            <Slider vertical verticalReverse></Slider>
        </div>
        <div style={{height: 300, marginLeft: 30, marginTop: 10, paddingRight: 30, display: 'inline-block'}}>
            <Slider vertical range defaultValue={[20, 60]}></Slider>
        </div>
        <div style={{height: 300, marginLeft: 30, marginTop: 10, paddingRight: 30, display: 'inline-block'}}>
            <Slider vertical verticalReverse range defaultValue={[20, 60]}></Slider>
        </div>
        <div style={{height: 300, marginLeft: 30, marginTop: 10, paddingRight: 30, display: 'inline-block'}}>
            <Slider vertical range marks={{ 20: '20c', 40: '40c' }} step={10} defaultValue={[20, 60]}></Slider>
        </div>
        <div style={{height: 300, marginLeft: 30, marginTop: 10, paddingRight: 30, display: 'inline-block'}}>
            <Slider vertical verticalReverse range marks={{ 20: '20c', 40: '40c' }} step={10} defaultValue={[20, 60]}></Slider>
        </div>
    </div>
);

```

## API参考
| 属性  | 说明        | 类型   | 默认值 | 版本 | 
|-------|-------------|-----------------|--------|-------|
| defaultValue | 设置初始取值 | number \| number[] | 0 |-|
| disabled | 滑块是否禁用 | boolean | false |-|
| included | `marks` 不为空对象时有效，值为 true 时表示值为包含关系，false 表示并列 | boolean | true |-|
| marks | 刻度，key 的类型必须为 `number` 且取值在闭区间 \[min, max] 内 | Record<number, string \> | 无 |-|
| max | 最大值 | number | 100 |-|
| min | 最小值 | number | 0 |-|
| railStyle | 滑块轨道的样式 | CSSProperties | - |0.31.0|
| range | 是否支持两边同时可滑动 | boolean | false |-|
| step | 步长 | number | 1 |-|
| tipFormatter | 设置Tooltip的展示格式，默认显示当前选值  | (value: string \| number \| boolean \| (string \| number \| boolean)[]) => any | v => v |-|
| tooltipVisible | 是否始终显示Tooltip | boolean | 无 |-|
| value | 设置当前取值 | number \| number[] |  |-|
| vertical | 是否设置方向为垂直 | boolean | false |-|
| verticalReverse | 反转垂直方向，即上大下小 >=1.29.0| boolean | false |-|
| onAfterChange | 与 `onmouseup` 触发时机一致，把当前值作为参数传入 | (value: number \| number[]) => void | 无 |-|
| onChange | 当 Slider 的值发生改变时的回调 | (value: number \| number[]) => void | 无 |-|

## 设计变量
<DesignToken/>
