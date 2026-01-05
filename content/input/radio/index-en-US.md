---
localeCode: en-US
order: 44
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
    <Radio aria-label="Radio demo" name="demo-radio">Radio</Radio>
);

```

### Extra Info

You can use `extra` to add extra information, which can be any type of ReactNode.

```jsx live=true
import React from 'react';
import { Radio } from '@douyinfe/semi-ui';


() => (
    <Radio extra="Semi Design is a design system developed and maintained by IES Front-end Team and UED Team" aria-label="Radio demo" name="demo-radio-extra">
        Semi Design
    </Radio>
);
```

### Disabled

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
            <Radio defaultChecked={false} disabled={disabled} aria-label="Radio demo" name="demo-radio-disabled">
                Disabled
            </Radio>
            <br />
            <Radio defaultChecked disabled={disabled} aria-label="Radio demo" name="demo-radio-defaultChecked-disabled">
                Disabled
            </Radio>
            <div style={{ marginTop: 20 }}>
                <Button type="primary" onClick={toggleDisabled} aria-label="Radio demo">
                    Toggle disabled
                </Button>
            </div>
        </div>
    );
};
```

### Advanced Mode

You can set `mode='advanced'` to allow options be able to unchecked when clicked again.

```jsx live=true
import React, { useState } from 'react';
import { Radio } from '@douyinfe/semi-ui';

() => {
    const [checked, setChecked] = useState(true);

    const onChange = (e) => {
        console.log('radio checked', e.target.checked);
        setChecked(e.target.checked);
    };

    return (
        <div>
            <Radio checked={checked} mode="advanced" onChange={onChange} aria-label="Radio demo" name="demo-radio-advanced">
                Click Again to Uncheck
            </Radio>
        </div>
    );
};
```

### Mutually Exclusive Set

You can use `RadioGroup` to create a set of mutually exclusive options.

```jsx live=true
import React, { useState } from 'react';
import { Radio, RadioGroup } from '@douyinfe/semi-ui';

() => {
    const [value, setValue] = useState(1);
    
    const onChange = (e) => {
        console.log('radio checked', e.target.value);
        setValue(e.target.value);
    };

    return (
        <RadioGroup onChange={onChange} value={value} aria-label="RadioGroup demo" name="demo-radio-group">
            <Radio value={1}>A</Radio>
            <Radio value={2}>B</Radio>
            <Radio value={3}>C</Radio>
            <Radio value={4}>D</Radio>
        </RadioGroup>
    );
};
```

### vertical arrangement

The radio elements in the group can be arranged horizontally or vertically by setting the `direction` property to the RadioGroup

```jsx live=true
import React from 'react';
import { RadioGroup, Radio } from '@douyinfe/semi-ui';

() => (
    <RadioGroup direction="vertical" aria-label="RadioGroup demo" name="demo-radio-group-vertical">
        <Radio value={1}>A</Radio>
        <Radio value={2}>B</Radio>
        <Radio value={3}>C</Radio>
        <Radio value={4}>D</Radio>
    </RadioGroup>
);
```

### Button Style


You can use `type='button'` to set the button style type radio, and the button type radio supports three sizes.

It should be noted that the button type radio selector does not support auxiliary text (`extra`) and vertical arrangement (`direction='vertical'`).

```jsx live=true dir="column"
import React, { useState } from 'react';
import { Radio, RadioGroup, Space } from '@douyinfe/semi-ui';

() => {
    const [value1, setValue1] = useState(1);
    const [value2, setValue2] = useState(1);
    const [value3, setValue3] = useState(1);

    const onChange1 = (e) => {
        setValue1(e.target.value);
    };

    const onChange2 = (e) => {
        setValue2(e.target.value);
    };

    const onChange3 = (e) => {
        setValue3(e.target.value);
    };

    return (
        <Space vertical spacing="loose" align="start">
            <RadioGroup type="button" buttonSize="small" onChange={onChange1} value={value1} aria-label="RadioGroup demo" name="demo-radio-small">
                <Radio value={1}>Instant push</Radio>
                <Radio value={2}>Timed push</Radio>
                <Radio value={3}>Dynamic push</Radio>
            </RadioGroup>
            <RadioGroup type="button" buttonSize="middle" onChange={onChange2} value={value2} aria-label="RadioGroup demo" name="demo-radio-middle">
                <Radio value={1}>Instant push</Radio>
                <Radio value={2}>Timed push</Radio>
                <Radio value={3}>Dynamic push</Radio>
            </RadioGroup>
            <RadioGroup type="button" buttonSize="large" onChange={onChange3} value={value3} aria-label="RadioGroup demo" name="demo-radio-large">
                <Radio value={1}>Instant push</Radio>
                <Radio value={2}>Timed push</Radio>
                <Radio value={3}>Dynamic push</Radio>
            </RadioGroup>
        </Space>
    );
};
```

### Card Style


You can set `type='card'` to `RadioGroup` to achieve card style with background.

```jsx live=true dir="column"
import React from 'react';
import { RadioGroup, Radio } from '@douyinfe/semi-ui';

() => (
    <RadioGroup type='card' defaultValue={1} direction='vertical' aria-label="RadioGroup demo" name="demo-radio-group-card">
        <Radio value={1} extra='Radio description' style={{ width: 280 }}>
            Radio Title
        </Radio>
        <Radio value={2} disabled extra='Radio description' style={{ width: 280 }}>
            Radio Title
        </Radio>
        <Radio value={3} extra='Radio description' style={{ width: 280 }}>
            Radio Title
        </Radio>
    </RadioGroup>
);
```


### Pure Card Style


You can set `type='pureCard'` to `RadioGroup` to achieve a pure card style with background and no radio.

```jsx live=true dir="column"
import React from 'react';
import { RadioGroup, Radio } from '@douyinfe/semi-ui';

() => (
    <RadioGroup type='pureCard' defaultValue={1} direction='vertical' aria-label="RadioGroup demo" name="demo-radio-group-pureCard">
        <Radio value={1} extra='Radio description' style={{ width: 280 }}>
            Radio Title
        </Radio>
        <Radio value={2} disabled extra='Radio description' style={{ width: 280 }}>
            Radio Title
        </Radio>
        <Radio value={3} extra='Radio description' style={{ width: 280 }}>
            Radio Title
        </Radio>
    </RadioGroup>
);
```

### Options Configuration

You can pass an array of options to `RadioGroup` using `options` property to create a set.

```jsx live=true
import React, { useState } from 'react';
import { RadioGroup } from '@douyinfe/semi-ui';

() => {
    const [value1, setValue1] = useState('Guest');
    const [value2, setValue2] = useState('Developer');
    const [value3, setValue3] = useState('Maintainer');
    const plainOptions = ['Guest', 'Developer', 'Maintainer'];
    const options = [
        { label: 'Guest', value: 'Guest', extra: 'Semi Design', style: { width: 120 } },
        { label: 'Developer', value: 'Developer', extra: 'Semi Design', style: { width: 120 } },
        { label: 'Maintainer', value: 'Maintainer', extra: 'Semi Design', style: { width: 120 } },
    ];
    const optionsWithDisabled = [
        { label: 'Guest', value: 'Guest' },
        { label: 'Developer', value: 'Developer' },
        { label: 'Maintainer', value: 'Maintainer', disabled: true },
    ];
    
    const onChange1 = (e) => {
        console.log('radio1 checked', e.target.value);
        setValue1(e.target.value);
    };

    const onChange2 = (e) => {
        console.log('radio2 checked', e.target.value);
        setValue2(e.target.value);
    };

    const onChange3 = (e) => {
        console.log('radio3 checked', e.target.value);
        setValue3(e.target.value);
    };

    return (
        <div>
            <RadioGroup options={plainOptions} onChange={onChange1} value={value1} aria-label="RadioGroup demo" name="demo-radio-group-1"/>
            <br />
            <br />
            <RadioGroup options={optionsWithDisabled} onChange={onChange2} value={value2} aria-label="RadioGroup demo" name="demo-radio-group-2"/>
            <br />
            <br />
            <RadioGroup options={options} onChange={onChange3} value={value3} aria-label="RadioGroup demo" name="demo-radio-group-3"/>
        </div>
    );
};
```

## API Reference

### Radio

| PROPERTIES | Instructions | Type | Default |
| --- | --- | --- | --- |
| addonClassName | classname of content wrapper | string |  |
| addonId | id of addon node, aria-labelledby refers to this id, if not set, it will generate an id randomly  <br/>**provided after v2.11.0**                                 | string            |       |
| addonStyle | inline style of content wrapper | object |  |
| aria-label      | Label of Radio                                                            | string           | -  |
| autoFocus | Automatically focus the form control when the page is loaded | boolean | false |
| checked | Specify whether it is currently selected | boolean | false |
| className | Class name | string |  |
| defaultChecked | Checked by default | boolean | false |
| disabled | Disable the radio | boolean | false |
| extra | Extra information displayed | ReactNode | - |
| extraId        | id of extra node. aria-describedby refers to this id, if not set, it will randomly generate an id <br/>**provided after v2.11.0**                     | ReactNode         | -      |
| mode | In advanced mode, options can be clicked to uncheck, one of `advanced` | string | - |
| name | The `name` attribute passed to `input[type="radio"]` in the Radio component, Radios with the same `name` belong to the same RadioGroup,The `name` attribute can refer to [MDN Radio](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input/radio#value)   | string         | -  |
| preventScroll | Indicates whether the browser should scroll the document to display the newly focused element, acting on the focus method inside the component, excluding the component passed in by the user | boolean |  |  |
| style | Inline style | CSSProperties |  |
| type | Set the type of radio, one of `default`, `button`, `card`, `pureCard` <br/>**This api is provided after v2.18.0**| string | `default` |
| value | Compared based on value to determine whether the option is selected | string \| number | - |
| onChange | Callback function when the selected option changes | Function (e: Event) | - |
| onMouseEnter | The callback function when the mouse moves into the option   | function(e:Event) | -   |
| onMouseLeave | The callback function when the mouse moves out the option   | function(e:Event) | -   |
### RadioGroup

| PROPERTIES | Instructions | Type | Default |
| --- | --- | --- | --- |
| aria-label      | Label of RadioGroup                                                            | string           | -  |
| buttonSize | The size of the button type radio， one of `small`、`middle`、`large` | string | `middle` |
| className | Class name | string |  |
| defaultValue | Options selected by default | string \| number | - |
| direction | Arrangement direction of Radio, optional 'horizontal' / 'vertical' | string | 'horizontal' |
| disabled | Disable the entire group | boolean | false |
| mode | In advanced mode, options can be clicked to uncheck, one of `advanced` | string | - |
| name | The `name` attribute for all `input[type="radio"]` in RadioGroup | string | - |
| options | Set child options through configuration | Array | - |
| style | Inline style | CSSProperties |  |
| value | Used to set the currently selected value | string \| number | - |
| type | Set the type of radio, one of `default`, `button`, `card`, `pureCard` | string | `default` |
| onChange | Callback function when the selected option changes | Function (e: Event) | - |
## Methods

### Radio

| Name    | Description  |
| ------- | ------------ |
| blur()  | Remove focus |
| focus() | Get focus    |

## Accessibility

### ARIA

- `aria-label`: used to explain the role of Radio or RadioGroup
- `aria-labelledby` points to the addon node, used to explain the content of Radio
- `aria-describedby` points to the extra node, which is used to explain the content of Radio

### Keyboard and focus
WAI-ARIA: https://www.w3.org/WAI/ARIA/apg/patterns/radiobutton/

- RadioGroup can be focused, the initial focus acquisition rules are as follows：
  - When there is no selected item in the RadioGroup, the initial focus is on the first Radio item;
  - When there are selected items in the RadioGroup, the initial focus is on the selected Radio item.
- For radios belonging to the same radiogroup:
  - You can use `Right arrow` or `Down arrow` to move the focus to the next Radio item, uncheck the previously focused Radio item, and select the currently focused Radio item;
  - You can Use `Left Arrow` or `Up Arrow` to move the focus to the previous Radio item, at the same time uncheck the previously focused Radio item, and select the currently focused Radio item.
- If there is no item selected in the RadioGroup, you can use the `Space` key to select the initial focus.

<!-- ## Related Material

```material
123
``` -->

## Related Material
<semi-material-list code="123"></semi-material-list>

## Content Guidelines

- Capitalize the first letter
- No punctuation

## Design Tokens

<DesignToken/>
