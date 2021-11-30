---
localeCode: en-US
order: 19
category: Input
title: DatePicker
subTitle: Date Selector
icon: doc-datepicker
brief: The date selector is used to help the user select a compliant, formatted date (time) or date (time) range.
---

## When to Use

When the user needs to enter a date, you can click on the standard input box and pop up the date panel to select.

## Demos

### How to import

```jsx import 
import { DatePicker } from '@douyinfe/semi-ui';
```


### Basic Use

```jsx live=true
import React from 'react';
import { DatePicker } from '@douyinfe/semi-ui';

class App extends React.Component {
    render() {
        return <DatePicker onChange={(date, dateString) => console.log(dateString)} style={{ width: 240 }} />;
    }
}
```

### Picker Density

The density can be used to control the size of the picker panel. The `compact` is the small size and the `default` is the default size. Support after v1.17.0.

```jsx live=true
import React from 'react';
import { DatePicker } from '@douyinfe/semi-ui';

function Demo() {
    return (
        <div>
            <DatePicker type="dateTime" density='compact' /><br /><br />
            <DatePicker type="dateRange" density='compact' style={{ width: 260 }} />
        </div>
    );
}
```

### With an Embedded Label

```jsx live=true
import React from 'react';
import { DatePicker } from '@douyinfe/semi-ui';

function Demo() {
    return <DatePicker insetLabel="End date" style={{ width: 240 }} />;
}
```

### Multiple Date Selection

Set `Multiple` to `true`, can choose multiple dates.

```jsx live=true
import React from 'react';
import { DatePicker } from '@douyinfe/semi-ui';

class App extends React.Component {
    render() {
        return <DatePicker multiple={true} style={{ width: 240 }} />;
    }
}
```

### Date and Time Selection

Set `type` to `dateTime`, can choose date and time.  
If you want to remove the infinite loop scrolling interaction of TimePicker, you can pass timePickerOpts into a specific configuration to close it.

```jsx live=true
import React from 'react';
import { DatePicker } from '@douyinfe/semi-ui';

class App extends React.Component {
    render() {
        return (
            <>
                <h4>Default date and time selection</h4>
                <DatePicker type="dateTime" />
                <br />
                <br />
                <h4>Turn off cycled mode</h4>
                <DatePicker type="dateTime" timePickerOpts={{ scrollItemProps: { cycled: false } }} />
            </>
        );
    }
}
```

### Date Range Selection

Set `type` to `dateRange`, can choose the date range.

```jsx live=true
import React from 'react';
import { DatePicker } from '@douyinfe/semi-ui';

class App extends React.Component {
    render() {
        return <DatePicker type="dateRange" style={{ width: 260 }} onChange={console.log} />;
    }
}
```

<Notice type="primary" title="Note">
    <div>When you use range selection, if only one date is selected, onChange will not be triggered at this time. Only when both the start date and the end date are selected will onChange be triggered.</div>
</Notice>

### Date Time Range Selection

Set `type` to `dateTimeRange`, can choose the date range and choose time;

```jsx live=true
import React from 'react';
import { DatePicker } from '@douyinfe/semi-ui';

class App extends React.Component {
    render() {
        return <DatePicker type="dateTimeRange" style={{ width: 380 }} onChange={console.log} />;
    }
}
```

### Synchronously switch months

version：>= 1.28.0

In the scenario of range selection, turning on `syncSwitchMonth` means to switch the two panels simultaneously. The default is false.

```jsx live=true
import React from 'react';
import { DatePicker } from '@douyinfe/semi-ui';

class App extends React.Component {
    render() {
        return (
            <DatePicker
                syncSwitchMonth={true}
                type="dateTimeRange"
                style={{ width: 380 }}
            />
        );
    }
}
```

### Panel Change Callback

version：>=1.28.0

`onPanelChange` will be called when the month or year of the panel is changed.

```jsx live=true
import React from 'react';
import { DatePicker } from '@douyinfe/semi-ui';

class App extends React.Component {
    render() {
        return (
            <DatePicker
                syncSwitchMonth={true}
                type="dateTimeRange"
                style={{ width: 380 }}
                onPanelChange={(date, dateString) => console.log(date, dateString)}
            />
        );
    }
}
```

### Select Week

`daterange` is used with `startDateOffset` and `endDateOffset` to select range with single click, such as weekly selection and biweekly selection. Support after v1.10.0.

```jsx live=true
import React from 'react';
import { DatePicker } from '@douyinfe/semi-ui';

function Demo() {
    const handleChange = date => {
        console.log('date changed', date);
    };

    return (
        <div>
            <h4>Choose a week</h4>
            <DatePicker
                style={{ width: 260 }}
                type="dateRange"
                weekStartsOn={1}
                startDateOffset={date => dateFns.startOfWeek(date, { weekStartsOn: 1 })}
                endDateOffset={date => dateFns.endOfWeek(date, { weekStartsOn: 1 })}
                onChange={handleChange}
            />
            <br />
            <br />
            <h4>Choose two weeks</h4>
            <DatePicker
                style={{ width: 260 }}
                type="dateRange"
                weekStartsOn={1}
                startDateOffset={date => dateFns.startOfWeek(date, { weekStartsOn: 1 })}
                endDateOffset={date => dateFns.add(dateFns.endOfWeek(date, { weekStartsOn: 1 }), { days: 7 })}
                onChange={handleChange}
            />
            <br />
            <br />
            <h4>Select the current day and the next 6 days</h4>
            <DatePicker
                style={{ width: 260 }}
                type="dateRange"
                weekStartsOn={1}
                endDateOffset={date => dateFns.add(date, { days: 6 })}
                onChange={handleChange}
            />
            <br />
            <br />
        </div>
    );
}
```

### Selection

**Version:** > = 0.21.0

Set `type` to `month`, can make year-to-month selection.

```jsx live=true
import React from 'react';
import { DatePicker } from '@douyinfe/semi-ui';

class App extends React.Component {
    render() {
        return <DatePicker defaultValue={new Date()} type="month" style={{ width: 140 }} />;
    }
}
```

### Confirm Date and Time Selection

**Version: > = 0.18.0**

For the selection of "datetime" (type = "dateTime") or "datetime range" (type = "dateTimeRange"), you can confirm it before writing the value into the input box. You can pass `NeedConfirm` = true to enable this behavior.

At the same time, the click callbacks of the "onConfirm" and "onCancel" buttons are supported.

The following example binds three callbacks: `onChange`, `onConfirm` and `onCancel`, and you can open the console to see the difference in print information.

```jsx live=true
import React from 'react';
import { DatePicker } from '@douyinfe/semi-ui';

class App extends React.Component {
    render() {
        return (
            <DatePicker
                type="dateTime"
                needConfirm={true}
                onConfirm={(...args) => {
                    console.log('Confirmed: ', ...args);
                }}
                onCancel={(...args) => {
                    console.log('Canceled: ', ...args);
                }}
                onChange={(...args) => {
                    console.log('Changed: ', ...args);
                }}
            />
        );
    }
}
```

### Date and Time Selection with Shortcuts

Pass parameter `Presets` to set shortcuts for date selection.

```jsx live=true
import React from 'react';
import { DatePicker } from '@douyinfe/semi-ui';

class App extends React.Component {
    constructor() {
        this.presets = [
            {
                text: 'Today',
                start: new Date(),
                end: new Date(),
            },
            () => ({
                text: 'Tomorrow',
                start: new Date(new Date().valueOf() + 1000 * 3600 * 24),
                end: new Date(new Date().valueOf() + 1000 * 3600 * 24),
            }),
        ];
    }

    render() {
        return <DatePicker type="dateTime" presets={this.presets} />;
    }
}
```

### Render TopSlot/BottomSlot

With `topSlot` and `bottomSlot`, you can customize the rendering of the top and bottom extra areas.

```jsx live=true
import React, { useState, useMemo } from 'react';
import { DatePicker, Typography, Tabs, TabPane, Space } from '@douyinfe/semi-ui';
import { IconBulb } from '@douyinfe/semi-icons';

function Demo() {
    const { Text } = Typography;

    const [activeTab, setActiveTab] = useState('1');
    const [date, setDate] = useState();
    const uedDisabledDate = currentDate => currentDate && currentDate.getDate() > 10 && currentDate.getDate() < 15;
    const testDisabledDate = currentDate => currentDate && currentDate.getDate() > 15 && currentDate.getDate() < 25;

    const handleTabChange = tab => {
        setActiveTab(tab);
        setDate();
    };

    const handleDateChange = value => {
        setDate(value);
    };

    const disabledDate = useMemo(() => (activeTab === '1' ? uedDisabledDate : testDisabledDate), [activeTab]);

    const TopSlot = function (props) {
        const { style } = props;
        return (
            <Tabs size="small" onChange={handleTabChange} activeKey={activeTab} style={{ padding: '12px 20px 0', ...style }}>
                <TabPane tab="UED Schedule" itemKey="1" />
                <TabPane tab="Test schedule" itemKey="2" />
            </Tabs>
        );
    };

    const BottomSlot = function (props) {
        const { style } = props;
        return (
            <Space style={{ padding: '12px 20px', ...style }}>
                <IconBulb style={{ color: 'rgba(var(--semi-amber-5), 1)' }} />
                <Text strong style={{ color: 'var(--semi-color-text-2)' }}>
                    Please read before finalizing
                </Text>
                <Text link={{ href: 'https://semi.design/', target: '_blank' }}>Release notice</Text>
            </Space>
        );
    };

    const MonthBottomSlot = function (props) {
        const { style } = props;
        return (
            <Space style={{ padding: '12px 20px', ...style }}>
                <IconBulb style={{ color: 'rgba(var(--semi-amber-5), 1)' }} />
                <Text strong style={{ color: 'var(--semi-color-text-2)' }}>
                    please read
                </Text>
                <Text link={{ href: 'https://semi.design/', target: '_blank' }}>Notice</Text>
            </Space>
        );
    };

    return (
        <div>
            <DatePicker 
                topSlot={<TopSlot />}
                disabledDate={disabledDate}
                value={date}
                onChange={handleDateChange}
                dropdownClassName="components-datepicker-demo-slot"
                placeholder="Please select a schedule"
            />
            <br /><br />
            <DatePicker
                bottomSlot={<BottomSlot />}
                placeholder="Please select release time"
            />
            <br /><br />
            <DatePicker
                type="month"
                bottomSlot={<MonthBottomSlot />}
                placeholder="Please select month"
            />
            <br /><br />
            <DatePicker 
                topSlot={<TopSlot style={{ padding: '8px 12px 0' }} />} 
                bottomSlot={<BottomSlot style={{ padding: '8px 12px' }} />} 
                density="compact"
                dropdownClassName="components-datepicker-demo-slot"
            />
            <br /><br />
            <DatePicker 
                type="dateTimeRange"
                bottomSlot={<BottomSlot />}
                style={{ width: 380 }}
                placeholder="Please select a time range"
            />
        </div>
    );
}
```

```css
.components-datepicker-demo-slot {
    
    .semi-tabs-content {
        padding: 0;
    }
    
    .semi-tabs-bar-line.semi-tabs-bar-top {
        border-bottom: none;
    }
}
```

### Disable Date Selection

```jsx live=true
import React from 'react';
import { DatePicker } from '@douyinfe/semi-ui';

class App extends React.Component {
    render() {
        return <DatePicker disabled type="dateTime" defaultValue={new Date()} />;
    }
}
```

### Disable Partial Date or Time

Pass in `disabledDate` to disable the specified date, pass in `disabledTime` to disable the specified time, and with `defaultPickerValue` you can specify the year and month when the panel is opened.

`disabledDate` and`disabledTime`, the accepted input parameters are the current date, the former returns a `boolean` value, the latter returns an [object](/en-US/input/timepicker#API_Reference) It will be directly passed to the `TimePicker` component.

<Notice type="primary" title="Note">
    <div>When you use timeZone, the Date of the first parameter is the time under the time zone you choose (similar to the first return value of onChange)</div>
</Notice>

```jsx live=true
import React from 'react';
import { DatePicker } from '@douyinfe/semi-ui';
import * as dateFns from 'date-fns';
import { range } from 'lodash-es';

class App extends React.Component {
    constructor(props = {}) {
        super(props);

        this.today = () => new Date();

        this.nextValidMonth = () => {
            const nextValidDate = this.today();
            nextValidDate.setMonth((nextValidDate.getMonth() + 1) % 12);
            return nextValidDate;
        };

        this.disabledTime = date =>
            dateFns.isToday(date)
                ? {
                    disabledHours: () => [17, 18],
                    disabledMinutes: hour => (19 === hour ? range(0, 10, 1) : []),
                    disabledSeconds: (hour, minute) => (hour === 20 && minute === 20 ? range(0, 20, 1) : []),
                }
                : null;

        this.disabledTime2 = (date, panelType) => {
            if (panelType === 'left') {
                return { disabledHours: () => [17, 18] };
            } else {
                return { disabledHours: () => [12, 13, 14, 15, 16, 17, 18] };
            }
        };

        this.disabledDate = date => {
            const deadDate = this.today();
            const month = deadDate.getMonth();
            deadDate.setDate(28);
            deadDate.setMonth((month + 1) % 12);
            return date.getTime() < deadDate.getTime();
        };
    }

    render() {
        return (
            <div>
                <div>
                    <h4>Disabled 17:00:00-18:00:00 today</h4>
                    <DatePicker type="dateTime" hideDisabledOptions={false} disabledTime={this.disabledTime} />
                </div>
                <div>
                    <h4>Two panels disable different times</h4>
                    <DatePicker
                        type="dateTimeRange"
                        hideDisabledOptions={false}
                        disabledTime={this.disabledTime2}
                        style={{ width: 380 }}
                    />
                </div>
                <div>
                    <h4>Disable time before the 28th of next month</h4>
                    <DatePicker
                        type="dateTimeRange"
                        disabledDate={this.disabledDate}
                        defaultPickerValue={this.nextValidMonth()}
                        style={{ width: 380 }}
                    />
                </div>
            </div>
        );
    }
}
```

When `type` contains `range`, the date can be disabled dynamically according to the rangeStart. The `options` parameter is supported after 1.9.0

```jsx live=true
import React from 'react';
import { DatePicker } from '@douyinfe/semi-ui';
import * as dateFns from 'date-fns';

class App extends React.Component {
    render() {
        return (
            <div>
                <h4>Prohibit selection of previous dates</h4>
                <DatePicker
                    type={'dateRange'}
                    disabledDate={(date, options) => {
                        const { rangeStart } = options;
                        const startDate = dateFns.parseISO(rangeStart);
                        return dateFns.isBefore(date, startDate);
                    }}
                    style={{ width: 260 }}
                />
            </div>
        );
    }
}
```

### Custom Display Format

Pass parameter `format` to custom display format.

```jsx live=true
import React from 'react';
import { DatePicker } from '@douyinfe/semi-ui';

class App extends React.Component {
    render() {
        return <DatePicker format="yyyy-MM-dd HH:mm" type="dateTime" defaultValue={new Date()} />;
    }
}
```

### Custom Trigger

**Version:** >=0.34.0

By default we use the `Input` component as the trigger for the `DatePicker` component. You can customize this trigger by passing the `triggerRender` method.

```jsx live=true
import React, { useState, useCallback, useMemo } from 'react';
import * as dateFns from 'date-fns';
import { DatePicker, Button } from '@douyinfe/semi-ui';
import { IconClose, IconChevronDown } from '@douyinfe/semi-icons';

function Demo() {
    const [date, setDate] = useState(new Date());
    const formatToken = 'yyyy-MM-dd';
    const onChange = useCallback(date => {
        setDate(date);
    }, []);
    const onClear = useCallback(e => {
        e && e.stopPropagation();
        setDate(null);
    }, []);

    const closeIcon = useMemo(() => {
        return date ? <IconClose onClick={onClear} /> : <IconChevronDown />;
    }, [date]);

    return (
        <DatePicker
            onChange={onChange}
            value={date}
            format={formatToken}
            triggerRender={({ placeholder }) => (
                <Button theme={'light'} icon={closeIcon} iconPosition={'right'}>
                    {(date && dateFns.format(date, formatToken)) || placeholder}
                </Button>
            )}
        />
    );
}
```

### Custom Render Date Content

**Version：**>=1.4.0

`renderDate: (dayNumber: number, fullDate: string) => ReactNode`

-   `dayNumber`: such as `13`.
-   `fullDate`: such as `2020-08-13`.

```jsx live=true
import React from 'react';
import { DatePicker, Tooltip } from '@douyinfe/semi-ui';

function Demo() {
    const dateStyle = {
        width: '100%',
        height: '100%',
        border: '1px solid var(--semi-color-primary)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    };
    const renderDate = (dayNumber, fullDate) => {
        if (dayNumber === 1) {
            return (
                <Tooltip content={'Always Day 1'}>
                    <div style={dateStyle}>
                        {dayNumber}
                    </div>
                </Tooltip>
            );
        }
        return dayNumber;
    };
    return <DatePicker renderDate={renderDate} />;
}
```

### Custom Render Date Box

**Version：**>=1.4.0

`renderFullDate: (dayNumber: number, fullDate: string, dayStatus: object) => ReactNode`

`dayStatus` is this status of current date box. The included keys are as follows.

```tsx
type DayStatusType = {
    isToday?: boolean,
    isSelected?: boolean,
    isDisabled?: boolean,
    isSelectedStart?: boolean,
    isSelectedEnd?: boolean,
    isInRange?: boolean,
    isHover?: boolean,
    isOffsetRangeStart?: boolean,
    isOffsetRangeEnd?: boolean,
    isHoverInOffsetRange?: boolean,
}
```

```jsx live=true
import React from 'react';
import { DatePicker } from '@douyinfe/semi-ui';
import classNames from 'classnames';

function Demo() {
    const renderFullDate = (dayNumber, fullDate, dayStatus) => {
        const { isInRange, isHover, isSelected, isSelectedStart, isSelectedEnd } = dayStatus;
        const prefix = 'components-datepicker-demo';

        const dateCls = classNames({
            [`${prefix}-day-inrange`]: isInRange,
            [`${prefix}-day-hover`]: isHover,
            [`${prefix}-day-selected`]: isSelected,
            [`${prefix}-day-selected-start`]: isSelectedStart,
            [`${prefix}-day-selected-end`]: isSelectedEnd,
        });

        const dayStyle = {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80%',
            height: '80%',
            borderRadius: '50%',
        };

        return (
            <div style={dayStyle} className={dateCls}>
                {dayNumber}
            </div>
        );
    };

    return <DatePicker style={{ width: 260 }} type={'dateRange'} renderFullDate={renderFullDate} />;
}
```

```css
.components-datepicker-demo-day-inrange,
.components-datepicker-demo-day-hover {
    background: var(--semi-color-primary-light-hover);
}

.components-datepicker-demo-day-selected,
.components-datepicker-demo-day-selected-start,
.components-datepicker-demo-day-selected-end {
    color: var(--semi-color-bg-2);
    background: var(--semi-color-primary);
}
```

## API Reference

| Properties         | Instructions                                                                                                                                                                              | Type                                             | Default | Version    |
|--------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------|---------|------------|
| autoAdjustOverflow | Whether the floating layer automatically adjusts its direction when it is blocked                                                                                                         | boolean                                          | true    | **0.34.0** |
| autoFocus          | Automatic access to focus                                                                                                                                                                 | boolean                                          | false   | **1.10.0** |
| autoSwitchDate     | When false is passed in, the date will not be automatically switched when the year and year are changed through the left and right buttons on the top of the panel and the drop-down menu | boolean                                          | true    | **1.13.0** |
| bottomSlot         | Render the bottom extra area                                                                                                                                                              | ReactNode                                        |         | **1.22.0** |
| className          | Class name                                                                                                                                                                                | string                                           | -       |            |
| defaultOpen        | Panel displays or hides by default                                                                                                                                                        | boolean                                          | false   |            |
| defaultPickerValue | Default panel date                                                                                                                                                                        | string\|Date\|number\|string[]\|Date[]\|number[] |         |            |
| defaultValue       | Default                                                                                                                                                                                   | string                                                                                                                                                                                                    | Date\|number\|string[]\|Date[]\|number[]                                              |                           |  |
| density            | Density of picker panel, one of `default`, `compact`                                                                 | string                                                                                                                                                                                                    | default                                        | **1.17.0**              |
| disabled           | Is it disabled?                                                                                                                                                                           | boolean                                                                                                                                                                                                   | false                                                                                 |                           |
| disabledDate       | The date is prohibited from the judgment method, and the date is prohibited when returned to true. Options parameter supported after 1.9.0 and rangeEnd supported after 1.29            | (date: Date, options: { rangeStart: string, rangeEnd: string }) => boolean                                                                                                                                                  | () = > false                                                                          |                           |
| disabledTime       | Time prohibition configuration, the return value will be transparently passed to [`TimePicker`](/en-US/input/timepicker#API_Reference) as a parameter                                | (date: Date \| Date[], panelType?: string) => ({ <br/>disabledHours:() => number[], <br/>disabledMinutes: (hour: number) => number[], <br/>disabledSeconds: (hour: number, minute: number) => number[] }) | () => false                                                                           | **0.36.0**                |
| disabledTimePicker | Disable time selection or not.                                                                                                                                                            | boolean                                                                                                                                                                                                   |                                                                                       | **0.32.0**                |
| dropdownClassName  | CSS classname for drop-down menu                                                                                                                                                          | string                                                               |                                 | **1.13.0** |
| dropdownStyle      | Inline style of drop-down menu                                                                                                                                                           | object                                                               |                                  | **1.13.0** |
| endDateOffset      | When type is dateRange, set the end date of the selected range                                                                                                                            | (selectedDate?: Date) => Date;                                                                                                                                                                            | -                                                                                     | **1.10.0**                |
| format             | Date string format displayed in the input box                                                                                                                                             | string                                                                                                                                                                                                    | Corresponding to type: For details, see [Date and Time Format](#Date%20and%20Time%20Format) |                           |
| getPopupContainer | Specifies the parent DOM, and the bullet layer will be rendered to the DOM, you need to set 'position: relative` | function():HTMLElement | () = > document.body |
| inputReadOnly      | Is the text box readonly                                                                                                                                                                  | boolean                                                                                                                                                                                                   | false                                                                                 |                           |
| inputStyle         | Input box style                                                                                                                                                                           | object                                                                                                                                                                                                    |                                                                                       |                           |
| insetLabel         | Prefix label, lower priority than `prefix`                                                                                                                                                | string\|ReactNode                                                                                                                                                                                         |                                                                                       |                           |
| max                | When multiple is set to true, the number of selected, non-pass or value is null\|undefined, unlimited.                                                                                     | number                                                                                                                                                                                                    | -                                                                                     |                           |
| multiple           | Whether you can choose multiple, only type = "date" is supported                                                                                                                          | boolean                                                                                                                                                                                                   | false                                                                                 |                           |
| needConfirm        | Do you need to "confirm selection", only `type= "dateTime"|"dateTimeRange"` works.                                                                                                        | boolean                                                                                                                                                                                                   |                                                                                       | **0.18.0**                |
| open               | Controlled properties displayed or hidden by panels                                                                                                                                       | boolean                                                                                                                                                                                                   |                                                                                       |                           |
| placeholder        | Input box prompts text                                                                                                                                                                    | string                                                                                                                                                                                                    | 'Select date'                                                                         |                           |
| position           | Floating layer position, optional value with [Popover #API Reference · position](/en-US/show/popover#API%20Reference)                                                                 | string                                                                                                                                                                                                    | 'bottomLeft'                                                                          |                           |
| prefix             | Prefix content                                                                                                                                                                            | string\|ReactNode                                                                                                                                                                                         |                                                                                       |                           |
| presets            | Date Time Shortcut                                                                                                                                                                        | Array < {start: string\|Date\|number, end: string\|Date\|number, text: string}\| function(): {start: string\|Date\|number, end: string\|Date\|number, text: string} >                                     | []                                                                                    |                           |
| rangeSeparator     | Custom range type picker separator of input trigger | string | '~' | **1.31.0** 
| renderDate         | Custom date display content                                                                                                                                                               | (dayNumber, fullDate) => ReactNode                                                                                                                                                                        | -                                                                                     | **1.4.0**            |
| renderFullDate     | Custom display date box                                                                                                                                                                   | (dayNumber, fullDate, dayStatus) => ReactNode                                                                                                                                                             | -                                                                                     | **1.4.0**            |
| showClear          | Do you show the clear button?                                                                                                                                        | boolean                                                                                                                                                                                                   | true                                                                                  |        **0.35.0**                           |
| size               | Size, optional: "small," "default," "large"                                                                                                                                               | string                                                                                                                                                                                                    | 'default'                                                                             |                           |
| spacing            | The distance between the pop-up layer and the children element                                                                                                                            | number                                                                                                                                                                                                    | 4                                                                                     | **1.9.0**                 |
| startDateOffset    | When type is dateRange, set the start date of the selected range                                                                                                                          | (selectedDate?: Date) => Date;                                                                                                                                                                            | -                                                                                     | **1.10.0**                |
| syncSwitchMonth    | In the scene of range, it supports synchronous switching of the month of the dual panel|boolean|false|**1.28.0**|
| timePickerOpts     | For other parameters that can be transparently passed to the time selector, see [TimePicker·API Reference](/en-US/input/timepicker#API%20Reference)                                    |                                                                                                                                                                                                           | object                                                                                | **1.1.0**                 |
| topSlot            | Render the top extra area                                                                                 | ReactNode                                                                                                                                                                                                 |                                                | **1.22.0**                   |
| triggerRender      | Custom trigger rendering method                                                                                                                                                           | ({ placeholder: string }) => ReactNode                                                                                                                                                                    |                                                                                       | **0.34.0**                |
| type               | Type, optional value: "date", "dateRange", "dateTime", "dateTimeRange", "month"                                                                                                           | string                                                                                                                                                                                                    | 'date'                                                                                | (type "month") **0.21.0** |
| value              | Controlled value                                                                                                                                                                          | string\| Date\|number\| string[]\|Date[]\|number[]                                                                                                                                                        |                                                                                       |                           |
| weekStartsOn       | Take the day of the week as the first day of the week, 0 for Sunday, 1 for Monday, and so on.                                                                                             | number                                                                                                                                                                                                    | 0                                                                                     |                           |
| onBlur             | Callback when focus is lost                                                                                                                                                               | (e: domEvent) => void                                                                                                                                                                                     | () => {}                                                                              | **1.0.0**                 |
| onCancel           | Cancel the callback when selected, enter the reference as the value of the last confirmed selection, only `type` equals "dateTime"or "dateTimeRange" and `needConfirm` equals true        | (date: Date\|Date[], dateStr: string\|string[]) => void) <br/>Before 1.0.0, it was (dateStr: string\|string [], date: Date\|Date[]) => void                                                               |                                                                                       | **0.18.0**                |
| onChange           | A callback when the value changes                                                                                                                                                         | (date: Date\|Date[], dateStr: string\|string[]) => void) <br/>Before 1.0.0, it was (dateStr: string\|string [], date: Date\|Date[]) => void                                                               |                                                                                       |                           |
| onClear            | A callback when click the clear button                                                                                                                                                    | (e: domEvent) => void                                                                                                                                                                                     | () => {}                                                                              | **1.16.0**           |
| onConfirm          | Confirm the callback at the time of selection, enter the reference as the value of the current selection, only `type` equals "dateTime" or "dateTimeRange" and `needConfirm` equals true  | (date: Date\|Date[], dateStr: string\|string[]) => void) <br/>Before 1.0.0, it was (dateStr: string\|string [], date: Date\|Date[]) => void                                                               |                                                                                       | **0.18.0**                |
| onFocus            | Callback when focus is obtained                                                                                                                                                           | (e: domEvent) => void                                                                                                                                                                                     | () => {}                                                                              | **1.0.0**                 |
| onOpenChange       | Panel displays or hides callbacks to state switches                                                                                                                                       | (status: boolean) => void                                                                                                                                                                                 |                                                                                       |                           |
| onPanelChange      | Callback when the year or date of the panel is switched|(date: DateType\|DateType[], dateStr: StringType\|StringType[])=>void|true|**1.28.0**|
| onPresetClick      | Callback when click preset button                                                                          | (item: Object, e: Event) => void                                                                                                                                                                                 | () => {}                                               |   **1.24.0**                           |

## Date and Time Format

Adopted in the semi-ui component library [date-fns(v2.9.0)](https://date-fns.org/v2.9.0/docs/Getting-Started) As a date and time engine, formatting token means the following:

-   `"y"`: Year
-   `"M"`: month
-   `"d"`: day
-   `"H"`: hours
-   `"h"`: hours (12h)
-   `"m"`: minutes
-   `"s"`: seconds

The default date time is formatted to:

-   `"date"`(date): `"yyyy-mm-dd`
-   `"dateTime"`(date and time)`"yyyy-mm-dd HH:mm:ss"`
-   `"month"`(month): `"yyyy-MM"`
-   `"dateRange"`(Date Range): `"yyyy-mm-dd ~ yyyy-mm-dd"`
-   `"dateTimeRange"`(Date and Time Range): `"yyyy-mm-dd HH:mm:ss ~ yyyy-mm-dd HH:mm:ss"`

Multiple dates or times are used by default `","` (English comma) separated.

> More token available [Date-fns official website](https://date-fns.org/v2.9.0/docs/Unicode-Tokens)

## Design Tokens
<DesignToken/>

## FAQ

-   **Date time picker, when you choose time, minute and second, you don't want to scroll infinitely. How to achieve the effect?**  
    This behavior can be controlled by a specific switch in timePickerOpts, timePickerOpts={{scrollItemProps: {cycled: false}}}, and cycled is set to false

-   **How to set the default display time when the panel is opened?**  
    You can use the defaultPickerValue property.