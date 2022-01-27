---
localeCode: en-US
order: 30
category: Input
title: TimePicker
subTitle: TimePicker
icon: doc-timepicker
brief: Users can easily select a compliant, formatted point of time using the time selector.
---

## When to Use

When users need to enter a time, they can click on the standard input box and pop up the time panel to select.

## Demos

### How to import

```jsx import
import { TimePicker } from '@douyinfe/semi-ui';
```

### Basic Usage

Click TimePicker, and then you can select or enter a time in the floating layer.

```jsx live=true
import React from 'react';
import { TimePicker } from '@douyinfe/semi-ui';

function Demo() {
    return <TimePicker />;
}
```

### With an Embedded Label

```jsx live=true
import React from 'react';
import { TimePicker } from '@douyinfe/semi-ui';

function Demo() {
    return <TimePicker insetLabel="Time" />;
}
```

### Controlled Component

When using `value` And not. `defaultValue` When used as a controlled component.`value` and `onChange` It needs to be used in conjunction.

```jsx live=true
import React from 'react';
import { TimePicker } from '@douyinfe/semi-ui';

class Demo extends React.Component {
    constructor() {
        super();
        this.state = {
            value: null,
        };
        this.onChange = this.onChange.bind(this);
    }

    onChange(time) {
        console.log(time);
        this.setState({ value: time });
    }

    render() {
        return <TimePicker value={this.state.value} onChange={this.onChange} />;
    }
}
```

### Different Format

The columns in the TimePicker float will follow `format` Change, when omitted `format` At some point, the corresponding column in the floating layer will also disappear.

NOTE: `format` Follow the date-fns `format` Format. https://date-fns.org/v2.0.0/docs/format

```jsx live=true
import React from 'react';
import { TimePicker } from '@douyinfe/semi-ui';

function Demo() {
    return <TimePicker format={'HH:mm'} defaultValue={'10:24'} />;
}
```

### Set Panel Header and Footer

```jsx live=true
import React, { useState } from 'react';
import { TimePicker, Button } from '@douyinfe/semi-ui';

function Demo() {
    const [open, setOpen] = useState(false);
    const closePanel = () => setOpen(false);
    const onOpenChange = open => {
        setOpen(open);
        console.log(open);
    };

    return (
        <TimePicker
            open={open}
            onOpenChange={onOpenChange}
            panelHeader={'Time Select'}
            panelFooter={<Button onClick={closePanel}>close</Button>}
        />
    );
}
```

### Disable Time Selection

```jsx live=true
import React from 'react';
import { TimePicker } from '@douyinfe/semi-ui';

function Demo() {
    return <TimePicker defaultValue={'12:08:23'} disabled />;
}
```

### Set Step Length

Available `Hour Step`, `Minute Step`, `Second Step` Show the optional minutes and seconds by step.

```jsx live=true
import React from 'react';
import { TimePicker } from '@douyinfe/semi-ui';

function Demo() {
    return <TimePicker minuteStep={15} secondStep={10} />;
}
```

### 12-hour System

12-hour time selector, default `format` for `h:mm:ss a`, an incoming `format` The format must be in [dateFns date format](https://date-fns.org/v2.0.0/docs/format)Within range.

> For example, the default 12-hour format string is:`a h:mm:ss`, if passed in `A h:mm:ss` This will result in an inability to format correctly.

```jsx live=true
import React from 'react';
import { TimePicker } from '@douyinfe/semi-ui';

function Demo() {
    return (
        <div>
            <TimePicker use12Hours />
            <br />
            <br />
            <TimePicker use12Hours format="a h:mm" />
        </div>
    );
}
```

### Time Range

**Version:** > = 0.23.0

Pass type = "timeRange" to enable time range selection.

```jsx live=true
import React from 'react';
import { TimePicker } from '@douyinfe/semi-ui';

function Demo() {
    return (
        <div>
            <TimePicker type="timeRange" defaultValue={['10:23:15', '12:38:32']} />
            <br />
            <br />
            <TimePicker type="timeRange" use12Hours format="a h:mm" defaultValue={['AM 08:11', 'PM 11:21']} />
        </div>
    );
}
```

### Custom Trigger

**Version:** >=0.34.0

By default we use the `Input` component as the trigger for the `DatePicker` component. You can customize this trigger by passing the `triggerRender` method.

```jsx live=true hideInDSM
import React, { useState, useMemo } from 'react';
import * as dateFns from 'date-fns';
import { TimePicker, Button } from '@douyinfe/semi-ui';
import { IconChevronDown, IconClose } from '@douyinfe/semi-icons';

function Demo() {
    const formatToken = 'HH:mm:ss';
    const [time, setTime] = useState(new Date());
    const triggerIcon = useMemo(() => {
        return time ? (
            <IconClose
                onClick={e => {
                    e && e.stopPropagation();
                    setTime();
                }}
            />
        ) : (
            <IconChevronDown />
        );
    }, [time]);

    return (
        <TimePicker
            value={time}
            format={formatToken}
            onChange={time => setTime(time)}
            triggerRender={({ placeholder }) => (
                <Button theme={'light'} icon={triggerIcon} iconPosition={'right'}>
                    {time ? dateFns.format(time, formatToken) : placeholder}
                </Button>
            )}
        />
    );
}
```

## TimeZone Config

Semi All configuration about time zone is converged in [ConfigProvider](/en-US/other/configprovider)

```jsx live=true hideInDSM
import React, { useMemo, useState } from 'react';
import { ConfigProvider, Select, TimePicker } from '@douyinfe/semi-ui';

function Demo(props = {}) {
    const [timeZone, setTimeZone] = useState('GMT+08:00');
    const defaultTimestamp = 1581599305265;
    const gmtList = useMemo(() => {
        const list = [];
        for (let hourOffset = -11; hourOffset <= 14; hourOffset++) {
            const prefix = hourOffset >= 0 ? '+' : '-';
            const hOffset = Math.abs(parseInt(hourOffset, 10));
            list.push(`GMT${prefix}${String(hOffset).padStart(2, '0')}:00`);
        }
        return list;
    }, []);

    return (
        <ConfigProvider timeZone={timeZone}>
            <div style={{ width: 300 }}>
                <h5 style={{ margin: 10 }}>Select Time Zone:</h5>
                <Select
                    placeholder={'Please Choose TimeZone'}
                    style={{ width: 300 }}
                    value={timeZone}
                    showClear={true}
                    onSelect={value => setTimeZone(value)}
                >
                    {gmtList.map(gmt => (
                        <Select.Option key={gmt} value={gmt}>
                            {gmt}
                        </Select.Option>
                    ))}
                </Select>
                <br />
                <br />
                <h5 style={{ margin: 10 }}>TimePicker:</h5>
                <TimePicker
                    defaultValue={defaultTimestamp}
                    onChange={(date, dateString) => console.log('DatePicker changed: ', date, dateString)}
                />
            </div>
        </ConfigProvider>
    );
}
```

## API Reference

| Parameters | Instructions | Type | Default | Version |
| --- | --- | --- | --- | --- |
| autoAdjustOverflow | Whether the floating layer automatically adjusts its direction when it is blocked | boolean | true | **0.34.0** |
| autoFocus | Automatic access to focus | boolean | false |
| className | Outer style name | string |  |
| clearText | Clear button prompt copy | string | Clear |
| defaultOpen | Whether the panel is open by default | boolean |  | **0.19.0** |
| defaultValue | Default time | Date\|timeStamp\|string (array when type = "timeRange") |  |
| disabled | Disable all operations | boolean | false |
| disabledHours | Prohibited selection of partial hour options | () => number [] |  |
| disabledMinutes | Prohibited to select some minute options | (selectedHour: number) => number[] |  |
| disabledSeconds | Unable to select partial second option | (selectedHour: number, selectedMinute: number) => number[] |  |
| focusOnOpen     | Whether to open the panel and focus the input box when mounting                         | boolean                                                                            | false                                                     |                    |
| format | Time format of presentation | string | "HH: mm: ss." |  |
| getPopupContainer | Specifies the container and the floating layer will be rendered into the element, you need to set 'position: relative` | () => HTMLElement | () => document.body |
| hideDisabledOptions | Hide the option of forbidden selection | boolean | false |
| hourStep | Hour option interval | number | 1 |
| inputReadOnly | Set the input box to read-only (avoid opening a virtual keyboard on a mobile device) | boolean | false |
| insetLabel | Prefix label, lower priority than `prefix` | string\|ReactNode |  |  |
| minuteStep | Minute option interval | number | 1 |
| motion | Whether to display the pop-up layer animation | boolean | true |  |
| open | Controlled property of whether the panel is open | boolean |  |
| panelFooter | Addon at the bottom of the panel | ReactNode\|string |  |
| panelHeader | Panel head addon | ReactNode\|string |  |
| placeholder | What's displayed when it's not worth it. | string | "Select time" |
| popupClassName | Pop-up class name | string | '' |
| popupStyle | Pop-up layer style object | object | - |
| position | Floating position | string | type="timeRange" => "bottom"<br/>type="time" => "bottomLeft" |
| prefixCls | Prefix content | string\|ReactNode |  |  |
| rangeSeparator | time range delimiter | string | "~" |
| scrollItemProps | The props passed through to ScrollItem. The optional values are the same as [ScrollList#API](/zh-CN/show/scrolllist#ScrollItem) | object |  | **0.31.0** |
| secondStep | Second option interval | number | 1 |
| showClear | Do you show the clear button? **v>=0.35.0** | boolean | true |
| size  | Size of input box, one of 'default', 'small' and 'large'          | string                                                                   | 'default'                                                              |                    |
| triggerRender | Custom trigger rendering method | ({ placeholder: string }) => ReactNode |  | **0.34.0** |
| type | type | "time"\|"timeRange" | "time" |
| use12Hours | Using a 12-hour system, `format` default to `h: mm: ssa` when true | boolean | false |
| value | Current time | Date\|timeStamp\|string (array when type = "timeRange") |  |
| onBlur | Callback when focus is lost | (e: domEvent) => void | () => {} | **1.0.0** |
| onChange | A callback in time. | (time: Date\|Date[], timeString: string\|string[]) => void |  |
| onChangeWithDateFirst | Set the order of parameter in `onChange`, `true`: (string, Date); `false`: (Date, string) | boolean | true | **2.4.0** |
| onFocus | Callback when focus is obtained | (e: domEvent) => void | () => {} | **1.0.0** |
| onOpenChange | A callback when the panel is on / off | (isOpen: boolean) => void |  |

## Method

| Name    | Description   |
| ------- | ------------- |
| blur()  | Remove focus  |
| focus() | Get the focus |

## Design Tokens

<DesignToken/>
