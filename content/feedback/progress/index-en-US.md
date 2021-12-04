---
localeCode: en-US
order: 63
category: Feedback
title:  Progress
subTitle: Progress
icon: doc-progress
width: 60%
brief: Show the current progress of the operation.
---


## When to use

Display the current progress and state of the operation for the user when the operation takes a long time to complete

## Demos

### How to import

```jsx
import { Progress } from '@douyinfe/semi-ui';
```
### Standard progress bar

Use `stroke` Property to control the filling color of the progress bar  
Use `Percent` Property to control completed progress  
Use `size` Property control progress bar size  
If the preset size is not satisfied, You can pass height to customize the height of the progress bar through `style` property.

```jsx live=true
import React from 'react';
import { Progress } from '@douyinfe/semi-ui';

() => (
    <div style={{ width: 200 }}>
        <Progress percent={10} stroke='#fc8800' />
        <br/>
        <Progress percent={25} stroke='#f93920' />
        <br/>
        <Progress percent={50} />
        <br/>
        <Progress percent={80} />
        <br/>
        <Progress percent={80} size='large' />
        <br/>
        <Progress percent={80} style={{ height: '8px' }}/>
    </div>
);
```

### Show percentage text

You can control whether to show percentage number through the `showInfo` property
In addition, you can format the percentage text show through `format`.

```jsx live=true
import React from 'react';
import { Progress } from '@douyinfe/semi-ui';

() => (
    <div style={{ width: 200 }}>
        <Progress percent={10} stroke='#fc8800' showInfo={true}/>
        <br/>
        <Progress percent={25} stroke='#f93920' showInfo={true}/>
        <br/>
        <Progress percent={50} showInfo={true}/>
        <br/>
        <Progress percent={50} showInfo={true} format={percent => (percent*10) + '‰'}/>
    </div>
);
```

### Vertical progress bar

You can use vertical progress bar by setting `direction='vertical'`
If preset width is not satisfied, you can pass width to customize the width of the vertical progress bar through `style` property.

```jsx live=true
import React from 'react';
import { Progress } from '@douyinfe/semi-ui';

() => (
    <div style={{ height: 100, display: 'flex' }}>
        <Progress percent={10} direction='vertical'/>
        <Progress percent={25} direction='vertical' />
        <Progress percent={50} direction='vertical' />
        <Progress percent={80} direction='vertical' size='large' />
        <Progress percent={80} direction='vertical' style={{ width: '8px' }}/>
    </div>
);
```

### Circular progress bar

Set type to`circle`, the progress bar will be displayed in a ring shape. The default size of the progress bar is 72 x 72

```jsx live=true
import React from 'react';
import { Progress } from '@douyinfe/semi-ui';

() => (
    <div>
        <Progress percent={10} type='circle' style={{ margin: 5 }} />
        <Progress percent={25} type='circle' style={{ margin: 5 }} />
        <Progress percent={50} type='circle' style={{ margin: 5 }} />
        <Progress percent={80} type='circle' style={{ margin: 5 }} />
    </div>
);
```

You can modify it's `width` to control the size of the circular progress bar.

```jsx live=true
import React from 'react';
import { Progress } from '@douyinfe/semi-ui';

() => (
    <React.Fragment>
        <div>
            <Progress percent={100} type='circle' width={100} style={{ margin: 5 }} />
        </div>
        <div>
            <Progress percent={100} type='circle' width={100} style={{ margin: 5 }} stroke='#f93920' />
        </div>
    </React.Fragment>
);
```

### Small circular progress bar

Small progress bar default size is 24 x 24.

```jsx live=true
import React from 'react';
import { Progress } from '@douyinfe/semi-ui';

() => (
    <React.Fragment>
        <Progress percent={10} type='circle' size='small' style={{ margin: 5 }} />
        <Progress percent={25} type='circle' size='small' style={{ margin: 5 }} />
        <Progress percent={50} type='circle' size='small' style={{ margin: 5 }} />
        <Progress percent={80} type='circle' size='small' style={{ margin: 5 }} />
    </React.Fragment>
);
```

### Dynamic change percent

```jsx live=true
import React from 'react';
import { Progress, Button } from '@douyinfe/semi-ui';
import { IconChevronLeft, IconChevronRight } from '@douyinfe/semi-icons';

() => {
    const [percent, setPercent] = useState(40);
    return (
        <>
            <div>
                <Progress percent={percent} showInfo/>
                <Button icon={<IconChevronLeft />} theme="light" onClick={()=> {setPercent(percent - 10);}} disabled={percent === 0} />
                <Button icon={<IconChevronRight />} theme="light" onClick={()=> {setPercent(percent + 10);}} disabled={percent >=100 } />
            </div>

        </>
    );
};
```

```jsx live=true
import React from 'react';
import { Progress, Button } from '@douyinfe/semi-ui';
import { IconChevronLeft, IconChevronRight } from '@douyinfe/semi-icons';

() => {
    const [cirPerc, setCirPerc] = useState(40);
    return (
        <div>
            <div><Progress percent={cirPerc} type='circle'/></div>
            <Button icon={<IconChevronLeft />} theme="light" onClick={()=> {setCirPerc(cirPerc - 10);}} disabled={cirPerc === 0}/>
            <Button icon={<IconChevronRight />} theme="light" onClick={()=> {setCirPerc(cirPerc + 10);}} disabled={cirPerc >=100 }/>
        </div>
    );
};
```

### Custom central text content

You can customize the central text by passing `format` function, and the argument of the format is the current percentage  
If you don't need central text content, you can set `showInfo` to false or return an empty string directly in `format`

```jsx live=true
import React from 'react';
import { Progress } from '@douyinfe/semi-ui';

() => (
    <React.Fragment>
        <Progress percent={75} showInfo type='circle' format={(per) => per + 'Days'} style={{ margin:10 }}/>
        <Progress percent={100} showInfo type='circle' format={(per) => 'Done'} style={{ margin:10 }}/>
        <Progress percent={50} type='circle' showInfo={false} style={{ margin:10 }}/>
    </React.Fragment>
);
```

### Round / square edges

With the `strokeLinecap` property, you can control the edge shape of the ring progress bar.

```jsx live=true
import React from 'react';
import { Progress } from '@douyinfe/semi-ui';

() => (
    <React.Fragment>
        <Progress percent={50} strokeLinecap='round' type='circle' style={{ margin: 10 }} />
        <Progress percent={50} strokeLinecap='square' type='circle' style={{ margin:10 }} />
    </React.Fragment>
);
```

## API Reference

| PROPERTIES | Instructions | Type | Default |
|--- | --- | --- | --- |
|className | style class name | string | |
|direction | The direction of the bar progress bar `horizontal`, `vertical` | string |'horizontal' |
|format | Formatting function, the input parameter is the current percentage, the result of return will be directly rendered in the center of the circular progress bar | (percent: number) => ReactNode | (percent) => percent +'%' |
|orbitStroke | Progress bar track fill color<br/>**provided after v1.0.0** | string |'var(--semi-color-fill-0)' |
|percent | percentage of progress | number | |
|showInfo | Whether to display the middle text in the circular progress bar, and whether to display the text on the right side of the bar-shaped progress bar | boolean | false |
|size | size, optional `default`, `small` (only type=circle is effective), `large` (only type=line is effective) | string |'default' |
|stroke | Fill color of progress bar | string |'var(--semi-color-success)' |
|strokeLinecap | round corner `round`/square corner `square` (only effective in type='circle' mode) | string |'round' |
|strokeWidth | When type is `line`, this property controls the height of the progress bar; when type is `circle`, this property controls the width of the progress bar | number | 4 |
|style | style | CSSProperties | |
|type | type, optional `line`, `circle` | string |'line' |
|width | Width of circular progress bar | number | 72 when size='default', 24 for 'small' |

## Design Tokens
<DesignToken/>
