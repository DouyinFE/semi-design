---
localeCode: en-US
order: 37
category: Input
title:  InputNumber
subTitle: InputNumber
icon: doc-inputnumber
brief: Through the mouse or keyboard, input the value in the range. Unlike Input, it has a stepper operation area for digital scenes, and it can display more complex content formats when used with Parser.
---


## When to Use

When you need to get a standard value.

## Demos

### How to import

```jsx import 
import { InputNumber } from '@douyinfe/semi-ui';
```


### Basic Input Box

```jsx live=true
import React from 'react';
import { InputNumber } from '@douyinfe/semi-ui';

class App extends React.Component {
    render() {
        return (
            <div style={{ width: 280 }}>
                <label>Simple</label>
                <InputNumber />
                <br/><br/>

                <label>Set step to 2 </label>
                <InputNumber step={2} />
                <br/><br/>

                <label>Press shift key and click the button to increase/decrease the step size </label>
                <InputNumber shiftStep={100} />
                <br/><br/>

                <label>Set min to 1, max to 10</label>
                <InputNumber min={1} max={10} Default Value={1} />
                <br/><br/>
            </div>
        );
    }
}
```

```jsx live=true
import React from 'react';
import { InputNumber } from '@douyinfe/semi-ui';

class App extends React.Component {
    render() {
        return (
            <div style={{ width: 280 }}>
                <label>Set defaultValue to 1 </label>
                <InputNumber defaultValue={1} />
                <br/><br/>

                <label>Set disabled to true</label>
                <InputNumber defaultValue={2} disabled />
                <br/><br/>

                <label>Set precision to 2 </label>
                <InputNumber precision={2} defaultValue={1.234} />
                <br/><br/>

                <label>Set innerButtons=true </label>
                <InputNumber innerButtons={true} suffix={'Hour'} defaultValue={1} style={{ width: 190 }} />
                <br/>

            </div>
        );
    }
}
```


### Inner Buttons

With `innerButtons`, you can hide the buttons on the right into the interior, which will only be displayed when hover occurs

```jsx live=true
import React from 'react';
import { InputNumber } from '@douyinfe/semi-ui';

() => (
    <InputNumber innerButtons style={{ width: 190 }} />
);
```

Set `hidebuttons` to `true` to hide the buttons completely

```jsx live=true
import React from 'react';
import { InputNumber } from '@douyinfe/semi-ui';

() => (
    <InputNumber hideButtons style={{ width: 190 }} />
);

```

### Size

```jsx live=true
import React from 'react';
import { InputNumber } from '@douyinfe/semi-ui';

class App extends React.Component {
    render() {
        return (
            <div style={{ width: 180 }}>
                <label>size=default</label>
                <InputNumber />
                <br/><br/>

                <label>size=large</label>
                <InputNumber size="large" />
                <br/><br/>

                <label>size=small</label>
                <InputNumber size="small" />
                <br/>

            </div>
        );
    }
}
```

### Custom Display Format and Resolution

> A pair of methods for `formatter` and `parser`, which generally need to be set at the same time, otherwise the value cannot be resolved correctly.

```jsx live=true
import React from 'react';
import { InputNumber } from '@douyinfe/semi-ui';

class App extends React.Component {
    log(v) {
        console.log(`Changed to: [${typeof v}] ${v}`);
    }

    render() {
        return (
            <div style={{ width: 180 }}>
                <label>RMB</label>
                <InputNumber
                    onChange={this.log}
                    defaultValue={1000}
                    min={0}
                    formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\￥\s?|(,*)/g, '')}
                />
                <br/><br/>

                <label>Custom string</label>
                <InputNumber
                    onChange={this.log}
                    defaultValue={1111}
                    formatter={value => String(value).split('').join('-')}
                    parser={value => value.replace(/\-/g, '')}
                />
                <br/>

            </div>
        );
    }
}
```

### Can Only Enter Numbers
With formatter and onNumberChange(**>=v1.9.0**), a pure digital input box can be implemented.

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

## API Reference

| Properties   | Instructions                                                                                    | type                              | Default   | Version    |
| ------------ | ----------------------------------------------------------------------------------------------- | --------------------------------- | --------- | ---------- |
| autofocus    | Automatic access to focus                                                                       | boolean                           | false     |            |
| className    | class name of InputNumber                                                               | string  | -      |
| clearIcon    | Can be used to customize the clear button, valid when showClear is true                       | ReactNode                       |     | 2.25.0 |
| defaultValue | Default                                                                                         | number                            |           |            |
| disabled     | Disabled status                                                                                 | boolean                           | false     |            |
| formatter    | Specifies the format of the input box to display the value                                      | (value: number\|string) => string | -         |            |
| hideButtons  | Hide the "up/down" button when passing `true`                                                   | boolean                           | false     | **1.0.0**  |
| innerButtons  | Show the "up/down" button in input box when passing `true`                                 | boolean                           | false         | **1.5.0** |
| insetLabel   | Prefix label, lower priority than `prefix`                                                      | string\|ReactNode                 |           |            |
| keepFocus    | Keep the input box focused when you click the button                                        | boolean                 |     false               | **1.10.0** |
| max          | Limit maximum value                                                                             | number                            | Infinity  |            |
| min          | Limit minimum value                                                                             | number                            | -Infinity |            |
| parser       | Specifies how to convert back number string from formatter and use them in conjunction with formatter | (value: string) => string         | -         |      |
| precision    | Numerical precision                                                                             | number                            | -         |            |
| prefix    | Prefix content                                                                                  | string\|ReactNode                 |           |            |
| pressInterval| How often will the click event be triggered when the button is long pressed, in milliseconds                                   | number                 |   250        |           |
| pressTimeout | When the button is long pressed, how long will the click event be triggered after the delay, in milliseconds                                               | number                 |     250      |           |
| preventScroll | Indicates whether the browser should scroll the document to display the newly focused element, acting on the focus method inside the component, excluding the component passed in by the user | boolean |  |  |
| shiftStep    | Step size for pressing the shift key, it can be a decimal. The default value was adjusted from 1 to 10 in v2.13                     | number                            | 10         | **1.5.0** |
| showClear    | Do you show the clear button?                                                                   | boolean                           | false     | **0.35.0** |
| size         | Enter box size, optional value: "default"\|"small"\|"large"                                     | string                            | 'default' |            |
| step         | Each time you change the number of steps, it can be a decimal.                                  | number                            | 1         |            |
| style        | Inline style of InputNumber                                                             | CSSProperties  | -      |
| suffix       | Custom suffix                                                                                   | ReactNode                         |           |            |
| value        | Current value                                                                                   | number                            |           |            |
| onBlur       | Callback when focus is lost                                                                     | (e: domEvent) => void             | () => {}  | **1.0.0**  |
| onChange     | Change callback                                                                                 | (value: number\|string) => void   | -         |            |
| onFocus      | Callback when focus is obtained                                                                 | (e: domEvent) => void             | () => {}  | **1.0.0**  |
| onNumberChange | Number change callback                                                 | (value: number) => void   |   -         |     **1.9.0**      |

## Methods

Some internal methods provided by InputNumber can be accessed through ref:

| Name    | Description     |
| ------- | --------------- |
| blur()  | Move the focus. |
| focus() | Get the focus.  |

## Accessibility

Guideline: https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/

### ARIA

- InputNumber has `spinbutton` role
- spinbutton uses `aria-valuenow` for current value, `aria-valuemax` for acceptable maximum value, and `aria-valuemin` for acceptable minimum value
- When InputNumber is used in Form, the value of the input box's `aria-labeledby` reference is Field label

### Keyboard and Focus

- InputNumber can get focus, keyboard users can use `Tab` and `Shift + Tab` to switch focus (Increase and decrease buttons are not focusable)
- Keyboard users can press up key ⬆️ or down key ⬇️ and the input value will increase or decrease by `step` (default is 1)
- Hold down Shift + Up ⬆️ or Down ⬇️ , the input value will increase or decrease by `shiftStep` (default is 10)

## Design Tokens
<DesignToken/>