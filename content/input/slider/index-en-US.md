---
localeCode: en-US
order: 26
category: Input
title:  Slider
subTitle: Slider
icon: doc-slider
brief: Slider is used to help users quickly enter a numeric value or range.
---


## Demos

### How to import

```jsx import
import { Slider } from '@douyinfe/semi-ui';
```
### Basic Usage

You can set `range={true}` to allow slider slide from both sides.

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
)
```

### With Input

Synchronize slider with input value.

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
        if(isNaN(Number(value))){
            return;
        }
        this.setState({ value: value / 1 });
    }

    render() {
        const { value } = this.state
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

### Tooltip

You can use `tipFormatter` to format Tooltip content or set `tipFormatter={null}`to hide Tooltip.

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
)
```

### With Tag

Use `marks` to label measures on sliders.

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
)
```


### Segmented Background
To create a slider with segmented background, you could use CSS property `linear-gradient` for `railStyle` along with `onChange` to change background dynamically。
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
    }
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

### Controlled Component

You can use `value` along with `onChange` property if you want to use Slider as a controlled component.

```jsx live=true
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
        <Button onClick={this.changeValue} style={{ marginRight: 20 }}>Click to change value</Button>
        <br/>
        <br/>
        <Slider value={this.state.value}></Slider>
      </div>
    );
  }
}
```

### Vertical

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
)
```

## API Reference

| Property       | Instructions                                                                               | type          | Default | Version | 
| -------------- | ------------------------------------------------------------------------------------------ | ------------- | ------- |------ |
| defaultValue   | Default value                                                                              | number \| number[] | 0       |- |
| disabled       | Disable slider                                                                             | boolean       | false   |- |
| included       | Takes effect when `marks` is not null, true means containment and false means coordination | boolean       | true    |- |
| marks          | Tick mark of Slider, type of key must be number, and must in closed interval [min, max]    | Record<number, string \>        | -       |- |
| max            | Maximum value of the slider.                                                               | number        | 100     |- |
| min            | Minimum value of the slider.                                                               | number        | 0       |- |
| railStyle | Style for slide rail | CSSProperties | - |0.31.0|
| range          | Toggle whether it is allow to move slider from both sides                                  | boolean       | false   |- |
| step           | Increment between successive values                                                        | number        | 1       |- |
| tipFormatter   | Format Tooltip content, by default display current value                                   | (value: string \| number \| boolean \| (string \| number \| boolean)[]) => any      | v => v  |- |
| tooltipVisible | Toggle whether to display tooltip all the time                                             | boolean       | -       |- |
| value          | Set current value, used in controlled component                                            | number \| number[] |         |- |
| vertical       | Toggle whether to display slider vertically                                                | boolean       | false   |- |
| verticalReverse | Vertical but reverse direction >=1.29.0| boolean | false |-|
| onAfterChange  | Triggered when onmouseup is invoked, passed in current value as params                     | (value: number \| number[]) => void      | -       |- |
| onChange       | Callback function when slider value changes                                                | (value: number \| number[]) => void      | -       |- |

## Design Tokens
<DesignToken/>
