---
localeCode: en-US
order: 18
category: Input
title:  Checkbox
subTitle: Checkbox
icon: doc-checkbox
brief: Checkboxes allow the user to select one or more items from a set.
---


## When to use

-   When making multiple choices in a set of options;
-   Use independently to select from different states, similar to the Switch component. The difference is that switching the Switch triggers a state change directly, while Checkbox is generally used for tagging status and works with the submission.


## Demos

### How to import

```jsx import 
import { Checkbox, CheckboxGroup } from '@douyinfe/semi-ui';
```


### Basic Usage

When the Checkbox is used individually, you can control whether to check it through the `defaultChecked` and `checked` attributes.
When `checked` is passed in, it is controlled component.

```jsx live=true
import React from 'react';
import { Checkbox } from '@douyinfe/semi-ui';

() => (
  <Checkbox onChange={checked => console.log(checked)}>
    Semi Design
  </Checkbox>
)
```

```jsx live=true
import React from 'react';
import { Checkbox } from '@douyinfe/semi-ui';

() => (
  <Checkbox
    defaultChecked
    onChange={checked => console.log(checked)}
  >
    Semi Design
  </Checkbox>
)
```

You can use `extra` to add extra information. The extra information usually is longer and even has line changes.

```jsx live=true
import React from 'react';
import { Checkbox } from '@douyinfe/semi-ui';

() => (
    <>
      <Checkbox
        extra='Semi Design is a design system developed and maintained by IES Front-end Team and UED Team'
      >
        Semi Design
      </Checkbox>
      <br/>
      <Checkbox
        extra='Semi Design is a design system developed and maintained by IES Front-end Team and UED Team'
        style={{ width: 400 }}
      >
        Semi Design
      </Checkbox>
    </>
)
```

### Disabled

```jsx live=true
import React from 'react';
import { Checkbox } from '@douyinfe/semi-ui';

() => (
  <div>
    <Checkbox Default Checked={false} with>UnChecked Disabled</Checkbox>
    <br />
    <Checkbox defaultChecked disabled>Checked Disabled</Checkbox>
  </div>
)
```

### Checkbox Group in JSX

By placing the Checkbox element inside the CheckboxGroup, you can declare the Checkbox group
Using the Checkbox group, you can more conveniently control the selection of a group of Checkboxes through the `defaultValue` and `value` properties of the CheckboxGroup
At this time, Checkbox does not need to declare `defaultChecked` and `checked` attributes

```jsx live=true
import React from 'react';
import { Checkbox, CheckboxGroup } from '@douyinfe/semi-ui';

() => (
  <CheckboxGroup style={{ width: '100%' }} defaultValue={['A', 'B']}>
    <Checkbox value="A">A</Checkbox>
    <Checkbox value="B">B</Checkbox>
    <Checkbox value="C">C</Checkbox>
    <Checkbox value="D">D</Checkbox>
    <Checkbox value="E">E</Checkbox>
  </CheckboxGroup>
)
```


### Checkbox Group in options

You can pass an array using `options` to `CheckboxGroup` directly to generate a set of checkboxs.

```jsx live=true
import React from 'react';
import { CheckboxGroup } from '@douyinfe/semi-ui';

class App extends React.Component {

  render() {
    function onChange(checkedValues) {
      console.log('checked = ', checkedValues);
    }

    const plainOptions = ['semi', 'vigo', 'helo'];
    const options = [
      { label: 'Aim for the highest', value: '1', extra: "Raise the bar. Wait for bigger gains. Find the best solutions by widening your perspective. Be attentive. Distill ideas down to their fundamental truths. Keep learning and growing" },
      { label: 'Be grounded & courageous', value: '2', extra:"Make your own discoveries. Dive deep into facts. Stay level-headed. Focus on impact. Assume ownership, take risks, break the mold. Rapid iterations, multiple possibilities." },
      { label: 'Be open & humble', value: '3', extra: "Trust yourself, trust each other. Be willing to offer and ask for help. Collaboration creates value. Approach problems with the big picture in mind. Be mindful and check your ego; stay open to different ideas." },
      { label: 'Be candid & clear', value: '4', extra: "Dare to share your honest opinions. It's okay to make mistakes. Own it when you do. Stick to the facts, identify issues, and avoid \'leader-pleasing.\' Be accurate and forthright; be methodical and focused."}
    ];
    const optionsWithDisabled = [
      { label: 'Photography', value: 'Photography' },
      { label: 'Movies', value: 'Movies' },
      { label: 'Running', value: 'Running', disabled: false },
    ];
    return (
      <div>
        <CheckboxGroup options={plainOptions} defaultValue={['semi']} onChange={onChange} />
        <br/><br/>
        <CheckboxGroup options={options} defaultValue={[]} onChange={onChange} />
        <br/><br/>
        <CheckboxGroup
          options={optionsWithDisabled}
          disabled
          defaultValue={['Photography']}
          onChange={onChange}
        />
      </div>
    )
  }
}
```

### Layout Direction

By setting `direction` to `horizontal` or `vertical`, You can adjust the layout within the Checkbox Group.

```jsx live=true
import React from 'react';
import { CheckboxGroup } from '@douyinfe/semi-ui';

() => {
  const options = [
    { label: 'semi', value: 'semi' },
    { label: 'hotsoon', value: 'hotsoon' },
    { label: 'pipixia', value: 'pipixia' },
    { label: 'toutiao', value: 'toutiao' }
  ];
  return (
    <CheckboxGroup options={options} direction='horizontal' />
  )
}
```

### Controlled Component

Used as a controlled component.

```jsx live=true
import React from 'react';
import { Checkbox, Button } from '@douyinfe/semi-ui';

class App extends React.Component {

  constructor() {
    super();
    this.state = {
      checked: true,
      disabled: false,
    }
    this.toggleChecked = this.toggleChecked.bind(this);
    this.toggleDisable = this.toggleDisable.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  toggleChecked () {
    this.setState({ checked: !this.state.checked });
  };

  toggleDisable () {
    this.setState({ disabled: !this.state.disabled });
  };

  onChange (e) {
    console.log('checked = ', e.target.checked);
    this.setState({
      checked: e.target.checked,
    });
  };

  render() {
    const label = `${this.state.checked ? 'Checked' : 'Unchecked'} ${
      this.state.disabled ? 'Disabled' : 'Enabled'
    }`;
    return (
      <div>
        <p style={{ marginBottom: '20px' }}>
          <Checkbox
            checked={this.state.checked}
            disabled={this.state.disabled}
            onChange={this.onChange}
          >
            {label}
          </Checkbox>
        </p>
        <p>
          <Button type="primary" size="small" onClick={this.toggleChecked}>
            {!this.state.checked ? 'Check' : 'Uncheck'}
          </Button>
          <Button
            style={{ marginLeft: '10px' }}
            type="primary"
            size="small"
            onClick={this.toggleDisable}
          >
            {!this.state.disabled ? 'Disable' : 'Enable'}
          </Button>
        </p>
      </div>
    );
  }
}

```

### Checkbox State

You may use the `indeterminate` property to set the state to indeterminate.

```jsx live=true
import React, { useState } from 'react';
import { Checkbox, CheckboxGroup } from '@douyinfe/semi-ui';

() => {
    const plainOptions = ['Photography', 'Movies', 'Running'];
    const [checkedList, setCheckedList] = useState(['Photography', 'Running']);
    const [indeterminate, setIndeterminate] = useState(true);
    const [checkAll, setCheckall] = useState(false);
    const onChange = (checkedList) => {
      setCheckedList(checkedList);
      setIndeterminate(!!checkedList.length && checkedList.length < plainOptions.length);
      setCheckall(checkedList.length === plainOptions.length);
    }
    const onCheckAllChange = (e) => {
      console.log(e);
      setCheckedList(e.target.checked ? plainOptions : []);
      setIndeterminate(false);
      setCheckall(e.target.checked);
    }

    return (
        <div>
          <div style={{ paddingBottom: 8, borderBottom: '1px solid var(--semi-color-border)' }}>
            <Checkbox
              indeterminate={indeterminate}
              onChange={onCheckAllChange}
              checked={checkAll}
            >
              Check all
            </Checkbox>
          </div>
          <CheckboxGroup
            style={{marginTop:6}}
            options={plainOptions}
            value={checkedList}
            onChange={onChange}
          />
        </div>
    )
}

```

### Card Style

version: >=1.30.0

You can set `type='card'` to CheckboxGroup to realize card style with background.

```jsx live=true dir="column"
import React from 'react';
import { CheckboxGroup, Checkbox } from '@douyinfe/semi-ui';

() => (
    <CheckboxGroup type='card' defaultValue={['1', '3']} direction='vertical'>
        <Checkbox value={'1'} disabled extra='Checkbox Description' style={{width:280}}>
            Checkbox Title
        </Checkbox>
        <Checkbox value={'2'} disabled extra='Checkbox Description' style={{width:280}}>
            Checkbox Title
        </Checkbox>
        <Checkbox value={'3'} extra='Checkbox Description' style={{width:280}}>
            Checkbox Title
        </Checkbox>
        <Checkbox value={'4'} extra='Checkbox Description' style={{width:280}}>
            Checkbox Title
        </Checkbox>
    </CheckboxGroup>
);
```
### Pure Card Style

version: >=1.30.0

You can set `type='pureCard'` to CheckboxGroup to realize a pure card style with background and no checkbox.

```jsx live=true dir="column"
import React from 'react';
import { CheckboxGroup, Checkbox } from '@douyinfe/semi-ui';

() => (
    <CheckboxGroup type='pureCard' defaultValue={['1', '3']} direction='vertical'>
        <Checkbox value={'1'} disabled extra='Checkbox Description' style={{width:280}}>
            Checkbox Title
        </Checkbox>
        <Checkbox value={'2'} extra='Checkbox Description' style={{width:280}}>
            Checkbox Title
        </Checkbox>
        <Checkbox value={'3'} extra='Checkbox Description' style={{width:280}}>
            Checkbox Title
        </Checkbox>
    </CheckboxGroup>
);
```

### Using with Grid

Use `Checkbox.Group` with `Grid` to achieve flexible layouts.

```jsx live=true
import React from 'react';
import { CheckboxGroup, Checkbox, Row, Col } from '@douyinfe/semi-ui';

() => (
  <CheckboxGroup style={{ width: '100%' }}>
    <Row>
      <Col span={8}>
        <Checkbox value="A">A</Checkbox>
      </Col>
      <Col span={8}>
        <Checkbox value="B">B</Checkbox>
      </Col>
      <Col span={8}>
        <Checkbox value="C">C</Checkbox>
      </Col>
      <Col span={8}>
        <Checkbox value="D">D</Checkbox>
      </Col>
      <Col span={8}>
        <Checkbox value="E">E</Checkbox>
      </Col>
    </Row>
  </CheckboxGroup>
)
```

## API Reference

### Checkbox

| PROPERTIES     | Instructions                                                 | type               | Default |
| -------------- | ------------------------------------------------------------ | ------------------ | ------- |
| checked        | Specify whether the current Checkbox is selected (it is invalid when used in Group)                     | boolean            | false   |
| defaultChecked | Whether Checked by default (it is invalid when used in Group)                                           | boolean            | false   |
| disabled       | Disabled state                                               | boolean            | false   |
| extra          | Provide extra information <br/>**>= v0.25.0**                | reactNode          | -       |
| value          | The value that the checkbox represents in the CheckboxGroup  | any | - |
| indeterminate  | Set to indeterminate state, style control only               | boolean            | false   |
| onChange       | Callback function when change                                | function(e: Event) | -       |

### CheckboxGroup

| PROPERTIES   | Instructions                                                            | type                   | Default    |
| ------------ | ----------------------------------------------------------------------- | ---------------------- | ---------- |
| defaultValue | Options selected by default                                             | string\string[]        | \[]        |
| direction    | Layout of checkbox within a group, one of `vertical`, `horizontal`      | string                 | `vertical` |
| disabled     | Disable the entire group                                                | boolean                | false      |
| name         | The `name` attribute for all `input[type="checkbox"]` in Checkbox Group | string                 | -          |
| options      | Specify optional                                                        | any\[]              | \[]        |
| type         | Set the type of checkboxes, one of: `default`、`card`、`pureCard` **provided after v1.30.0**	| string        | `default`  |
| value        | Specify selected options                                                | any\[]              | \[]        |
| onChange     | Callback function when selected options change                          | function(checkedValue) | -          |

### Method

#### Checkbox

| Name    | Description  |
| ------- | ------------ |
| blur()  | Remove focus |
| focus() | Get focus    |

## Design Tokens
<DesignToken/>

<!-- ## Related Material
```material
45, 64, 73, 89, 123
``` -->