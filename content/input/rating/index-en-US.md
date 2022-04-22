---
localeCode: en-US
order: 26
category: Input
title: Rating
subTitle: Rating
icon: doc-rating
brief: Ratings provide insight regarding others’ opinions and experiences with a product.
---

## Demos

### How to import

```jsx import
import { Rating } from '@douyinfe/semi-ui';
```
### Basic Usage

Support two sizes: `default`, `small`.

**v >= 0.35.0** supports customized size if pass in a number. Refer to [Customize](#Customize)

```jsx live=true
import React from 'react';
import { Rating } from '@douyinfe/semi-ui';

() => (
    <div>
        <Rating Default Value={5} />
        <br />
        <br />
        <Rating size="small" defaultValue={5} />
    </div>
);
```

### Half Star

Use `allowHalf` to support selection of half stars. After `v0.28.0`, it also supports to **display** decimals ratings other than 0.5.

```jsx live=true
import React from 'react';
import { Rating } from '@douyinfe/semi-ui';

() => (
    <div>
        <Rating allowHalf defaultValue={3.5} />
        <br />
        <Rating allowHalf defaultValue={3.65} />
    </div>
);
```

### Disabled

Use `disabled` to disabled interaction.

```jsx live=true
import React from 'react';
import { Rating } from '@douyinfe/semi-ui';

() => (
    <Rating disabled defaultValue={3} />
);
```

### Click to Clear

`allowClear` Property allows you to clear the value when you click on the component again. By default it is set to `true`.

```jsx live=true
import React from 'react';
import { Rating } from '@douyinfe/semi-ui';

() => (
    <div>
        <span>Clear when clicking</span>
        <br />
        <Rating allowClear={true} defaultValue={3} />
        <br />
        <br />
        <span>Unable to clear when clicking</span>
        <br />
        <Rating allowClear={false} defaultValue={3} />
    </div>
);
```

### Text Description

Use `tooltips` to add description to Rating.

```jsx live=true
import React from 'react';
import { Rating } from '@douyinfe/semi-ui';

class Demo extends React.Component {
    constructor(props) {
        super();
        this.state = { value: 0 };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(value) {
        this.setState({ value });
    }

    render() {
        const { value } = this.state;
        const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];
        return (
            <div>
                <span>
                    How was the help you received:
                    {value ? <span>{desc[value - 1]}</span> : ''}
                </span>
                <br />
                <Rating tooltips={desc} onChange={this.handleChange} value={value} />
            </div>
        );
    }
}
```

### Customize

You can customize characters, numbers of rating and size.

> **v >= 0.35.0** Note that customized size could only work with customized characters.

```jsx live=true
import React from 'react';
import { Rating } from '@douyinfe/semi-ui';
import { IconLikeHeart } from '@douyinfe/semi-icons';

() => (
    <div>
        <Rating style={{ color: 'red' }} character={<IconLikeHeart size="extra-large" />} defaultValue={3} />
        <br />
        <br />
        <Rating
            style={{ color: 'red' }}
            size={48}
            allowHalf
            character={<IconLikeHeart style={{ fontSize: 48 }} />}
            defaultValue={3}
        />
        <br />
        <br />
        <Rating size={18} character={'S'} defaultValue={3} />
        <br />
        <br />
        <Rating Count={10} defaultValue={6} />
    </div>
);
```

## API Reference

| Properties    | Instructions                                                                          | type                    | Default                                  |
| ------------- | ------------------------------------------------------------------------------------- | ----------------------- | ---------------------------------------- |
| allowClear    | Toggle whether it is allowed to clear when clicking                                   | boolean                 | true                                     |
| allowHalf     | Toggle whether it is allowed to select half stars                                     | boolean                 | false                                    |
| autoFocus     | Automatically focus                                                                     | boolean                 | false                                    |
| character     | Custom characters to display rating                                                   | React Node              | `<IconStar size="extra-large"/>` |
| className     | Class name                                                                            | string                  | -                                        |
| count         | Number of stars or characters                                                         | number                  | 5                                        |
| defaultValue  | Default value                                                                         | number                  | 0                                        |
| disabled      | Read-only, disable interaction.                                                       | boolean                 | false                                    |
| onBlur        | Callback function when losing focus.                                                  | function()              | -                                        |
| onChange      | Callback function at the time of selection                                            | function(value: number) | -                                        |
| onFocus       | Callback function when getting focus                                                  | function()              | -                                        |
| onHoverChange | Callback function of numerical changes when the mouse hovers                          | function(value: number) | -                                        |
| onKeyDown     | Callback function when key down                                                       | function(e: event)      | -                                        |
| size          | Size, one of `default`, `small`, **v >= 0.35.0** could use number for customized size | string\| number         | `default`                                |
| style         | Inline style                                                                          | object                  | -                                        |
| tooltips      | Customize prompted information for each item                                          | String[]                | -                                        |
| value         | Controlled value                                                                      | number                  | -                                        |

##Accessibility

### ARIA

- Rating has aria-checked to indicate whether it is currently selected, aria-posinset to indicate the position in the list, and aria-setsize to indicate the length of the list

## Design Tokens
<DesignToken/>