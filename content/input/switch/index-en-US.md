---
localeCode: en-US
order: 27
category: Input
title:  Switch
subTitle: Switch
icon: doc-switch
width: 60%
brief: Switch is an interactive form used to switch two mutually exclusive states.
---

## Demos
### How to import

```jsx import
import { Switch } from '@douyinfe/semi-ui';
```
### Basic Usage

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

### Size

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

### Disabled

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

### With text

Can pass `checkedText` with `uncheckedText` Text when setting the switch  
The long text is recommended to be placed directly on the outside.  
Note: This does not work with the smallest switch (size = 'small')

```jsx live=true
import React from 'react';
import { Switch } from '@douyinfe/semi-ui';

() => (
    <div>
        <Switch checkedText='on' uncheckedText='off' />
        <Switch checkedText='｜' uncheckedText='〇' style={{marginLeft:5}}/>
        <br/><br/>
        <Switch defaultChecked checkedText='on' uncheckedText='off' />
        <Switch defaultChecked checkedText='｜' uncheckedText='〇' style={{marginLeft:5}}/>
        <br/><br/>
        <Switch checkedText='on' uncheckedText='off' size='large' />
        <Switch checkedText='｜' uncheckedText='〇' size='large' style={{marginLeft:5}}/>
        <br/><br/>
        <Switch defaultChecked checkedText='on' uncheckedText='off' size='large' />
        <Switch defaultChecked checkedText='｜' uncheckedText='〇' size='large' style={{marginLeft:5}}/>
    </div>
);
```

Compared to setting the embedded text through checkedText and uncheckedText, we recommend placing the text description outside the Switch
```jsx live=true
import React, { useState } from 'react';
import { Switch, Typography } from '@douyinfe/semi-ui';

() => {
    const [open, setOpen] = useState();
    const { Title } = Typography;
    return (
        <div style={{display:'flex', alignItems: 'center'}}>
            <Title heading={6} style={{margin: 8}}>{open?'Open':'Closed'}</Title>
            <Switch checked={open} onChange={setOpen}/>
        </div>
    );
};
```

### Controlled component

Whether the component is selected depends entirely on the incoming checked value, used with `onChange`

```jsx live=true
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

### loading

version: >= 1.29.0

You can turn on the loading state by setting loading="true".

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

## API reference

| Properties     | Instructions                                              | Type                        | Default   | version|
| -------------- | --------------------------------------------------------- | --------------------------- | --------- | ------ |
| className      | The CSS class name of the wrapper element                 | string                      |           ||
| checked        | Indicates whether currently selected, used with onchange  | boolean                     | false     ||
| checkedText    | Content displayed when open, invalid when size is small   | React Node                  |           |0.25.0|
| defaultChecked | Whether selected when component mounted                   | boolean                     | false     ||
| disabled       | If true, the switch will be disabled.                     | boolean                     | false     ||
| loading        | Turn on loading status                                    | boolean                     | false     |1.29.0|
| onChange       | Callback function when changing                           | function (checked: boolean) |           ||
| onMouseEnter   | A callback when the mouse moves in                        | function ()                 |           ||
| onMouseLeave   | A callback when the mouse moves out                       | function ()                 |           ||
| size           | Size, optional value `large`, `default`, `small`          | string                      | 'default' ||
| style          | Inline style                                              | object                      | {}        ||
| uncheckedText  | Content displayed when closed, invalid when size is small | React Node                  |           |0.25.0|

## Design Tokens
<DesignToken/>