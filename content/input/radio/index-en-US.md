---
localeCode: en-US
order: 25
category: Input
title: Radio
subTitle: Radio
icon: doc-radio
brief: Radio component allows the user to select one option from a relative small set.
---

## When to use

-   Used to select a single state among multiple options.
-   The difference from Select is that all available options in Radio are visible by default, making it easier for users to choose in comparison, so there should not be too many options.

## Demos

### How to import

```jsx import
import { Radio, RadioGroup } from '@douyinfe/semi-ui';
```

### Basic Usage

```jsx live=true
import React from 'react';
import { Radio } from '@douyinfe/semi-ui';

() => (
    <Radio aria-label="Radio demo">Radio</Radio>
);

```

### Extra Info

You can use `extra` to add extra information, which can be any type of ReactNode.

> `extra` >= v0.25.0

```jsx live=true
import React from 'react';
import { Radio } from '@douyinfe/semi-ui';


() => (
    <Radio extra="Semi Design is a design system developed and maintained by IES Front-end Team and UED Team" aria-label="Radio demo">
        Semi Design
    </Radio>
);
```

### Disabled

```jsx live=true
import React from 'react';
import { Radio, Button } from '@douyinfe/semi-ui';

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            disabled: true,
        };
        this.toggleDisabled = this.toggleDisabled.bind(this);
    }

    toggleDisabled() {
        this.setState({
            disabled: !this.state.disabled,
        });
    }

    render() {
        return (
            <div>
                <Radio defaultChecked={false} disabled={this.state.disabled} aria-label="Radio demo">
                    Disabled
                </Radio>
                <br />
                <Radio defaultChecked disabled={this.state.disabled} aria-label="Radio demo">
                    Disabled
                </Radio>
                <div style={{ marginTop: 20 }}>
                    <Button type="primary" onClick={this.toggleDisabled} aria-label="Radio demo">
                        Toggle disabled
                    </Button>
                </div>
            </div>
        );
    }
}
```

### Advanced Mode

You can set `mode='advanced'` to allow options be able to unchecked when clicked again.

```jsx live=true
import React from 'react';
import { Radio } from '@douyinfe/semi-ui';

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            checked: true,
        };
        this.onChange = this.onChange.bind(this);
    }

    onChange(e) {
        console.log('radio checked', e.target.checked);
        this.setState({
            checked: e.target.checked,
        });
    }

    render() {
        return (
            <div>
                <Radio checked={this.state.checked} mode="advanced" onChange={this.onChange} aria-label="Radio demo">
                    Click Again to Uncheck
                </Radio>
            </div>
        );
    }
}
```

### Mutually Exclusive Set

You can use `RadioGroup` to create a set of mutually exclusive options.

```jsx live=true
import React from 'react';
import { Radio, RadioGroup } from '@douyinfe/semi-ui';

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            value: 1,
        };
        this.onChange = this.onChange.bind(this);
    }
    onChange(e) {
        console.log('radio checked', e.target.value);
        this.setState({
            value: e.target.value,
        });
    }

    render() {
        return (
            <RadioGroup onChange={this.onChange} value={this.state.value} aria-label="RadioGroup demo">
                <Radio value={1}>A</Radio>
                <Radio value={2}>B</Radio>
                <Radio value={3}>C</Radio>
                <Radio value={4}>D</Radio>
            </RadioGroup>
        );
    }
}
```

### Button Style

version: >=1.26.0

You can use `type='button'` to set the button style type radio, and the button type radio supports three sizes.

It should be noted that the button type radio selector does not support auxiliary text (`extra`) and vertical arrangement (`direction='vertical'`).

```jsx live=true dir="column"
import React from 'react';
import { Radio, RadioGroup, Space } from '@douyinfe/semi-ui';

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            value1: 1,
            value2: 1,
            value3: 1,
        };
        this.onChange1 = this.onChange1.bind(this);
        this.onChange2 = this.onChange2.bind(this);
        this.onChange3 = this.onChange3.bind(this);
    }

    onChange1(e) {
        this.setState({
            value1: e.target.value,
        });
    }

    onChange2(e) {
        this.setState({
            value2: e.target.value,
        });
    }

    onChange3(e) {
        this.setState({
            value3: e.target.value,
        });
    }

    render() {
        return (
            <Space vertical spacing="loose" align="start">
                <RadioGroup type="button" buttonSize="small" onChange={this.onChange1} value={this.state.value1} aria-label="RadioGroup demo">
                    <Radio value={1}>Instant push</Radio>
                    <Radio value={2}>Timed push</Radio>
                    <Radio value={3}>Dynamic push</Radio>
                </RadioGroup>
                <RadioGroup type="button" buttonSize="middle" onChange={this.onChange2} value={this.state.value2} aria-label="RadioGroup demo">
                    <Radio value={1}>Instant push</Radio>
                    <Radio value={2}>Timed push</Radio>
                    <Radio value={3}>Dynamic push</Radio>
                </RadioGroup>
                <RadioGroup type="button" buttonSize="large" onChange={this.onChange3} value={this.state.value3} aria-label="RadioGroup demo">
                    <Radio value={1}>Instant push</Radio>
                    <Radio value={2}>Timed push</Radio>
                    <Radio value={3}>Dynamic push</Radio>
                </RadioGroup>
            </Space>
        );
    }
}
```

### Card Style

version: >=1.30.0

You can set `type='card'` to `RadioGroup` to achieve card style with background.

```jsx live=true dir="column"
import React from 'react';
import { RadioGroup, Radio } from '@douyinfe/semi-ui';

() => (
    <RadioGroup type='card' defaultValue={1} direction='vertical' aria-label="RadioGroup demo">
        <Radio value={1} extra='Radio description' style={{width:280}}>
            Radio Title
        </Radio>
        <Radio value={2} disabled extra='Radio description' style={{width:280}}>
            Radio Title
        </Radio>
        <Radio value={3} extra='Radio description' style={{width:280}}>
            Radio Title
        </Radio>
    </RadioGroup>
);
```


### Pure Card Style

version: >=1.30.0

You can set `type='pureCard'` to `RadioGroup` to achieve a pure card style with background and no radio.

```jsx live=true dir="column"
import React from 'react';
import { RadioGroup, Radio } from '@douyinfe/semi-ui';

() => (
    <RadioGroup type='pureCard' defaultValue={1} direction='vertical' aria-label="RadioGroup demo">
        <Radio value={1} extra='Radio description' style={{width:280}}>
            Radio Title
        </Radio>
        <Radio value={2} disabled extra='Radio description' style={{width:280}}>
            Radio Title
        </Radio>
        <Radio value={3} extra='Radio description' style={{width:280}}>
            Radio Title
        </Radio>
    </RadioGroup>
);
```

### Options Configuration

You can pass an array of options to `RadioGroup` using `options` property to create a set.

```jsx live=true
import React from 'react';
import { RadioGroup } from '@douyinfe/semi-ui';

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
            <div>
                <RadioGroup options={this.plainOptions} onChange={this.onChange1} value={this.state.value1} aria-label="RadioGroup demo" />
                <br />
                <br />
                <RadioGroup options={this.optionsWithDisabled} onChange={this.onChange3} value={this.state.value3} aria-label="RadioGroup demo" />
                <br />
                <br />
                <RadioGroup options={this.options} onChange={this.onChange2} value={this.state.value2} aria-label="RadioGroup demo" />
            </div>
        );
    }
}
```

## API Reference

### Radio

| PROPERTIES | Instructions | Type | Default |
| --- | --- | --- | --- |
| addonClassName | classname of content wrapper<br/>**provided after v1.16.0** | string |  |
| addonId | id of addon node, aria-labelledby refers to this id, if not set, it will generate an id randomly  **provided after v2.11.0**                                 | string            |       |
| addonStyle | inline style of content wrapper<br/>**provided after v1.16.0** | object |  |
| aria-label      | Label of Radio                                                            | string           | -  |
| autoFocus | Automatically focus the form control when the page is loaded | boolean | false |
| checked | Specify whether it is currently selected | boolean | false |
| className | Class name | string |  |
| defaultChecked | Checked by default | boolean | false |
| disabled | Disable the radio | boolean | false |
| extra | Extra information displayed <br/>**provided after v0.25.0** | ReactNode | - |
| extraId        | id of extra node. aria-describedby refers to this id, if not set, it will randomly generate an id <br/>**provided after v2.11.0**                     | ReactNode         | -      |
| mode | In advanced mode, options can be clicked to uncheck, one of `advanced` | string | - |
| style | Inline style | CSSProperties |  |
| value | Compared based on value to determine whether the option is selected | string \| number | - |
| onChange | Callback function when the selected option changes | Function (e: Event) | - |
| onMouseEnter | The callback function when the mouse moves into the option   | function(e:Event) | -   |
| onMouseLeave | The callback function when the mouse moves out the option   | function(e:Event) | -   |
### RadioGroup

| PROPERTIES | Instructions | Type | Default |
| --- | --- | --- | --- |
| aria-label      | Label of RadioGroup                                                            | string           | -  |
| buttonSize | The size of the button type radio， one of `small`、`middle`、`large` <br/>**Provided after v1.26.0** | string | `middle` |
| className | Class name | string |  |
| defaultValue | Options selected by default | string \| number | - |
| direction | Arrangement direction of Radio, optional 'horizontal' / 'vertical', <br/>**provided after v0.31.0** | string | 'horizontal' |
| disabled | Disable the entire group | boolean | false |
| mode | In advanced mode, options can be clicked to uncheck, one of `advanced`<br/>**provided after v1.9.0** | string | - |
| name | The `name` attribute for all `input[type="radio"]` in RadioGroup | string | - |
| options | Set child options through configuration | Array | - |
| style | Inline style | CSSProperties |  |
| value | Used to set the currently selected value | string \| number | - |
| type | Set the type of radio, one of `default`, `button`, `card`, `pureCard` <br/>**This api is provided after v1.26.0, and card and pureCard are in v1.30.0 Provided after ** | string | `default` |
| onChange | Callback function when the selected option changes | Function (e: Event) | - |
## Method

### Radio

| Name    | Description  |
| ------- | ------------ |
| blur()  | Remove focus |
| focus() | Get focus    |

## Accessibility

### Keyboard and Focus

- Card type and button type Radio group can be selected by arrow switch

### ARIA

- `aria-label`: used to explain the role of Radio or RadioGroup
- `aria-labelledby` points to the addon node, used to explain the content of Radio
- `aria-describedby` points to the extra node, which is used to explain the content of Radio

<!-- ## Related Material

```material
123
``` -->

## Design Tokens

<DesignToken/>
