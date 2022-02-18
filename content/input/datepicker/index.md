---
localeCode: zh-CN
order: 20
category: 输入类
title: DatePicker 日期选择器
icon: doc-datepicker
brief: 日期选择器用于帮助用户选择一个符合要求的、格式化的日期（时间）或日期（时间）范围
---

## 何时使用

当用户需要输入一个日期，可以点击标准输入框，弹出日期面板进行选择。

## 代码演示

### 如何引入


```jsx import
import { DatePicker } from '@douyinfe/semi-ui';
```

### 基本使用

```jsx live=true
import React from 'react';
import { DatePicker } from '@douyinfe/semi-ui';

() => <DatePicker onChange={(date, dateString) => console.log(dateString)} />;
```

### 小尺寸

使用 density 可以控制日期面板的尺寸，`compact` 为小尺寸，`default` 为默认尺寸。v1.17.0 后支持。

```jsx live=true
import React from 'react';
import { DatePicker } from '@douyinfe/semi-ui';

function Demo() {
    return (
        <div>
            <DatePicker type="dateTime" density="compact" />
            <br />
            <br />
            <DatePicker type="dateRange" density="compact" style={{ width: 260 }} />
        </div>
    );
}
```

### 带内嵌标签

```jsx live=true
import React from 'react';
import { DatePicker } from '@douyinfe/semi-ui';

function Demo() {
    return <DatePicker insetLabel="结束日期" style={{ width: 240 }} />;
}
```

### 多个日期选择

将 `multiple` 设为 `true`，可以多选日期

```jsx live=true
import React from 'react';
import { DatePicker } from '@douyinfe/semi-ui';

() => <DatePicker multiple={true} style={{ width: 240 }} />;
```

### 日期与时间选择

将 `type` 设定为 `dateTime`，可以选择日期时间。  
同时，如果希望去掉 TimePicker 的无限循环滚动交互，可以通过 timePickerOpts 传入特定配置关闭。

```jsx live=true
import React from 'react';
import { DatePicker } from '@douyinfe/semi-ui';

() => (
    <>
        <h4>默认日期与时间选择</h4>
        <DatePicker type="dateTime" />
        <br />
        <br />
        <h4>关闭时间列表无限循环</h4>
        <DatePicker
            type="dateTime"
            timePickerOpts={{
                scrollItemProps: { cycled: false },
            }}
        />
    </>
);
```

### 日期范围选择

将 `type` 设定为 `dateRange`，可以选择日期范围

```jsx live=true
import React from 'react';
import { DatePicker } from '@douyinfe/semi-ui';

() => <DatePicker type="dateRange" style={{ width: 260 }} onChange={console.log} />;
```

<Notice type="primary" title="注意事项">
    <div>type=dateRange 或 dateTimeRange 时，只有开始日期和结束日期都被选择后才会触发 onChange。</div>
</Notice>

### 日期范围时间选择

将 `type` 设定为 `dateTimeRange`， 可以选择日期时间范围

```jsx live=true
import React from 'react';
import { DatePicker } from '@douyinfe/semi-ui';

() => <DatePicker type="dateTimeRange" style={{ width: 380 }} onChange={console.log} />;
```

### 同步切换双面板月份

version: >= 1.28.0

在范围选择的场景中, 开启 `syncSwitchMonth` 则允许双面板同步切换。默认为 false。

> Note：点击年份按钮也会同步切换两个面板，从滚轮里面切换年月不会同步切换面板，这保证了用户选择非固定间隔月份的能力。

```jsx live=true
import React from 'react';
import { DatePicker } from '@douyinfe/semi-ui';

() => (
    <DatePicker
        // 双面板同步切换
        syncSwitchMonth={true}
        type="dateTimeRange"
        style={{ width: 380 }}
    />
);
```

### 切换面板日期的回调

版本：>=1.28.0

`onPanelChange` 回调函数会在面板的月份或年份切换改变时被调用。

```jsx live=true
import React from 'react';
import { DatePicker } from '@douyinfe/semi-ui';

() => (
    <DatePicker
        syncSwitchMonth={true}
        type="dateTimeRange"
        style={{ width: 380 }}
        onPanelChange={(date, dateString) => console.log(date, dateString)}
    />
);
```

### 周选择

dateRange 搭配 startDateOffset 和 endDateOffset 可以进行单击范围选择，如周选择、双周选择。v1.10.0 后支持。

```jsx live=true
import React from 'react';
import { DatePicker } from '@douyinfe/semi-ui';

function Demo() {
    const handleChange = date => {
        console.log('date changed', date);
    };

    return (
        <div>
            <h4>选择自然周</h4>
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
            <h4>选择双周</h4>
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
            <h4>选择当前日和后6日</h4>
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

### 年月选择

**版本：** >= 0.21.0

将 `type` 设定为 `month`，可以进行年月选择。

```jsx live=true
import React from 'react';
import { DatePicker } from '@douyinfe/semi-ui';

() => <DatePicker defaultValue={new Date()} type="month" style={{ width: 140 }} />;
```

### 确认日期时间选择

**版本：** >= 0.18.0

对于“日期时间”（type="dateTime"）或“日期时间范围”（type="dateTimeRange"）的选择，可以进行确认后才将值写入输入框内，你可以通过传递 needConfirm=true 来开启这种行为。

同时支持 “确认”（onConfirm） 和 “取消”（onCancel） 两个按钮的点击回调。

下面这个例子绑定了 onChange、onConfirm、onCancel 三种回调，你可以打开控制台查看打印信息的区别。

> 注意：开启确认选择时，需要点击取消按钮关闭面板，点击空白区域不再关闭面板（v2.2.0）

```jsx live=true
import React from 'react';
import { DatePicker } from '@douyinfe/semi-ui';

() => (
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
```

### 带有快捷方式的日期时间选择

通过 `presets` 设定快捷日期选择

```jsx live=true
import React from 'react';
import { DatePicker } from '@douyinfe/semi-ui';

() => {
    const presets = [
        {
            text: 'Today',
            start: new Date(),
            end: new Date(),
        },
        {
            text: 'Tomorrow',
            start: new Date(new Date().valueOf() + 1000 * 3600 * 24),
            end: new Date(new Date().valueOf() + 1000 * 3600 * 24),
        },
    ];
    return <DatePicker type="dateTime" presets={presets} />;
};
```

### 渲染顶部/底部额外区域

通过 `topSlot` 和 `bottomSlot` 可以自定义渲染顶部和底部额外区域。

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

    const TopSlot = function(props) {
        const { style } = props;
        return (
            <Tabs
                size="small"
                onChange={handleTabChange}
                activeKey={activeTab}
                style={{ padding: '12px 20px 0', ...style }}
            >
                <TabPane tab="UED 排期" itemKey="1" />
                <TabPane tab="测试排期" itemKey="2" />
            </Tabs>
        );
    };

    const BottomSlot = function(props) {
        const { style } = props;
        return (
            <Space style={{ padding: '12px 20px', ...style }}>
                <IconBulb style={{ color: 'rgba(var(--semi-amber-5), 1)' }} />
                <Text strong style={{ color: 'var(--semi-color-text-2)' }}>
                    定版前请阅读
                </Text>
                <Text link={{ href: 'https://semi.design/', target: '_blank' }}>发版须知</Text>
            </Space>
        );
    };

    const MonthBottomSlot = function(props) {
        const { style } = props;
        return (
            <Space style={{ padding: '12px 20px', ...style }}>
                <IconBulb style={{ color: 'rgba(var(--semi-amber-5), 1)' }} />
                <Text strong style={{ color: 'var(--semi-color-text-2)' }}>
                    请阅读
                </Text>
                <Text link={{ href: 'https://semi.design/', target: '_blank' }}>须知</Text>
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
                placeholder="请选择排期"
            />
            <br />
            <br />
            <DatePicker bottomSlot={<BottomSlot />} placeholder="请选择发版时间" />
            <br />
            <br />
            <DatePicker type="month" bottomSlot={<MonthBottomSlot />} placeholder="请选择年月" />
            <br />
            <br />
            <DatePicker
                topSlot={<TopSlot style={{ padding: '8px 12px 0' }} />}
                bottomSlot={<BottomSlot style={{ padding: '8px 12px' }} />}
                density="compact"
                placeholder="小尺寸"
                dropdownClassName="components-datepicker-demo-slot"
            />
            <br />
            <br />
            <DatePicker type="dateTimeRange" bottomSlot={<BottomSlot />} style={{ width: 380 }} />
            <br />
            <br />
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

### 禁用日期选择

```jsx live=true
import React from 'react';
import { DatePicker } from '@douyinfe/semi-ui';

() => <DatePicker disabled type="dateTime" defaultValue={new Date()} />;
```

### 禁用部分日期或时间

传入 `disabledDate` 可以禁用指定日期，传入 `disabledTime` 可以禁用指定时间，配合 `defaultPickerValue` 可以指定面板打开时所处的年月。

`disabledDate` 和 `disabledTime`，接受的入参都为当前日期，前者返回一个 `boolean` 值，后者返回一个[对象](/zh-CN/input/timepicker#API_参考)，将会透传给 `TimePicker` 组件。

<Notice type="primary" title="注意事项">
    <div>当你使用 timeZone 时，第一个参数为你选择的时区下时间（与onChange的第一个返回值类似）</div>
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
                    <h4>禁用时间：禁用今天下午5-6点</h4>
                    <DatePicker type="dateTime" hideDisabledOptions={false} disabledTime={this.disabledTime} />
                </div>
                <div>
                    <h4>禁用时间：两个面板禁用不同时间</h4>
                    <DatePicker
                        type="dateTimeRange"
                        hideDisabledOptions={false}
                        disabledTime={this.disabledTime2}
                        style={{ width: 380 }}
                    />
                </div>
                <div>
                    <h4>禁用日期：禁用下个月28号之前的所有日期</h4>
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

在 type 包含 range 时，可以根据当前选择动态禁止日期。options 参数 1.9.0 后支持。

```jsx live=true
import React from 'react';
import { DatePicker } from '@douyinfe/semi-ui';
import * as dateFns from 'date-fns';

() => (
    <div>
        <h4>动态禁用日期：禁止选择之前的日期</h4>
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
```

### 自定义显示格式

可以通过 `format` 自定义显示格式

```jsx live=true
import React from 'react';
import { DatePicker } from '@douyinfe/semi-ui';

() => <DatePicker format="yyyy年MM月dd日 HH:mm" type="dateTime" defaultValue={new Date()} />;
```

### 自定义触发器

**版本：**>=0.34.0

默认情况下我们使用 `Input` 组件作为 `DatePicker` 组件的触发器，通过传递 `triggerRender` 方法你可以自定义这个触发器。

```jsx live=true hideInDSM
import React, { useState, useCallback, useMemo } from 'react';
import * as dateFns from 'date-fns';
import { IconClose, IconChevronDown } from '@douyinfe/semi-icons';
import { DatePicker, Button } from '@douyinfe/semi-ui';

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

### 自定义日期显示内容

**版本：**>=1.4.0

`renderDate: (dayNumber: number, fullDate: string) => ReactNode`，自定义日期内容。

-   `dayNumber`：当前日。如 `13`。
-   `fullDate`：当前日的完整日期。如 `2020-08-13`。

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
                    <div style={dateStyle}>{dayNumber}</div>
                </Tooltip>
            );
        }
        return dayNumber;
    };
    return <DatePicker renderDate={renderDate} />;
}
```

### 自定义日期格子渲染

**版本：**>=1.4.0

`renderFullDate: (dayNumber: number, fullDate: string, dayStatus: object) => ReactNode`， 自定义日期格子的渲染内容。

`dayStatus` 表示当前格子的状态，包括的 `key` 有：

```tsx
type DayStatusType = {
    isToday?: boolean; // 当前日
    isSelected?: boolean; // 被选中
    isDisabled?: boolean; // 被禁用
    isSelectedStart?: boolean; // 选中开始
    isSelectedEnd?: boolean; // 选中结束
    isInRange?: boolean; // 范围选中日期内
    isHover?: boolean; // 日期在选择项和hover日期之间
    isOffsetRangeStart?: boolean; // 周选择开始
    isOffsetRangeEnd?: boolean; // 周选择结束
    isHoverInOffsetRange?: boolean; // hover在周选择内
};
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
            borderRadius: 'var(--semi-border-radius-circle)',
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

## API 参考

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| autoAdjustOverflow | 浮层被遮挡时是否自动调整方向 | boolean | true | **0.34.0** |
| autoFocus | 自动获取焦点 | boolean | false | **1.10.0** |
| autoSwitchDate | 传入 false 时，通过面板上方左右按钮、下拉菜单更改年月时，不会自动切换日期 | boolean | true | **1.13.0** |
| bottomSlot | 渲染底部额外区域 | ReactNode |  | **1.22.0** |
| className | 类名 | string | - |  |
| defaultOpen | 面板默认显示或隐藏 | boolean | false |  |
| defaultPickerValue | 默认面板日期 | ValueType |  |  |
| defaultValue | 默认值 | ValueType |  |  |
| density | 面板的尺寸，可选值：`default`, `compact` | string | default | **1.17.0** |
| disabled | 是否禁用 | boolean | false |  |
| disabledDate | 日期禁止判断方法，返回为 true 时禁止该日期，options 参数 1.9.0 后支持，rangeEnd 1.29 后支持 | (date: Date, options: { rangeStart: string, rangeEnd: string }) => boolean | () => false |  |
| disabledTime | 时间禁止配置，返回值将会作为参数透传给 [`TimePicker`](/zh-CN/input/timepicker#API_参考) | (date: Date \| Date[], panelType?: string) => ({ <br/>disabledHours:() => number[], <br/>disabledMinutes: (hour: number) => number[], <br/>disabledSeconds: (hour: number, minute: number) => number[] }) | () => false | **0.36.0** |
| disabledTimePicker | 是否禁止时间选择 | boolean |  | **0.32.0** |
| dropdownClassName | 下拉列表的 CSS 类名 | string |  | **1.13.0** |
| dropdownStyle | 下拉列表的内联样式 | object |  | **1.13.0** |
| endDateOffset | type 为 dateRange 时，设置单击选择范围的结束日期 | (selectedDate?: Date) => Date; | - | **1.10.0** |
| format | 在输入框内展现的日期串格式 | string | 与 type 对应：详见[日期时间格式](#日期时间格式) |  |
| getPopupContainer | 指定父级 DOM，弹层将会渲染至该 DOM 中，自定义需要设置 `position: relative` | function():HTMLElement | () => document.body |  |
| hideDisabledOptions | 隐藏禁止选择的时间 | boolean | false |  |
| inputReadOnly | 文本框是否 readonly | boolean | false |  |
| inputStyle | 输入框样式 | object |  |  |
| insetLabel | 前缀标签，优先级低于 `prefix` | string\|ReactNode |  |  |
| max | multiple 为 true 时，多选的数目,不传或者值为 null\|undefined 的话无限制 | number | - |  |
| motion | 是否开启面板展开的动画 | boolean | true |  |
| multiple | 是否可以选择多个，仅支持 type="date" | boolean | false |  |
| needConfirm | 是否需要“确认选择”，仅 type="dateTime"\|"dateTimeRange" 时有效 | boolean |  | **0.18.0** |
| open | 面板显示或隐藏的受控属性 | boolean |  |  |
| placeholder | 输入框提示文字 | string | 'Select date' |  |
| position | 浮层位置，可选值同[Popover#API 参考·position 参数](/zh-CN/show/popover#API参考) | string | 'bottomLeft' |  |
| prefix | 前缀内容 | string\|ReactNode |  |  |
| presets | 日期时间快捷方式 | Array<{start:BaseValueType, end:BaseValueType, text:string}\| function():{start:BaseValueType, end:BaseValueType, text:string}> | [] |  |
| rangeSeparator | 自定义范围类型输入框的日期分隔符 | string | '~' | **1.31.0** |
| renderDate | 自定义日期显示内容 | (dayNumber, fullDate) => ReactNode | - | **1.4.0** |
| renderFullDate | 自定义显示日期格子内容 | (dayNumber, fullDate, dayStatus) => ReactNode | - | **1.4.0** |
| showClear | 是否显示清除按钮 | boolean | true | **0.35.0** |
| size | 尺寸，可选值："small", "default", "large" | string | 'default' |  |
| spacing | 浮层与 trigger 的距离 | number | 4 | **1.9.0** |
| startDateOffset | type 为 dateRange 时，设置单击选择范围的开始日期 | (selectedDate?: Date) => Date; | - | **1.10.0** |
| stopPropagation | 是否阻止弹出层上的点击事件冒泡 | boolean | false |  |
| style | 自定义样式 | CSSProperties |  |  |
| syncSwitchMonth | 在范围选择的场景中，支持同步切换双面板的月份 | boolean | false | **1.28.0** |
| timePickerOpts | 其他可以透传给时间选择器的参数，详见 [TimePicker·API 参考](/zh-CN/input/timepicker#API_参考) |  | object | **1.1.0** |
| topSlot | 渲染顶部额外区域 | ReactNode |  | **1.22.0** |
| triggerRender | 自定义触发器渲染方法，第一个参数是个 Object，详情看下方类型定义 | (props: TriggerRenderProps) => ReactNode | - | **0.34.0** |
| type | 类型，可选值："date", "dateRange", "dateTime", "dateTimeRange", "month" | string | 'date' | type="month" 需要 **0.21.0** |
| validateStatus | 校验状态，可选值 default、error、warning，默认 default。仅影响展示样式 | string |  |  |
| value | 受控的值 | ValueType |  |  |
| weekStartsOn | 以周几作为每周第一天，0 代表周日，1 代表周一，以此类推 | number | 0 |  |
| zIndex | 弹出面板的 zIndex | number | 1030 |  |
| onBlur | 失去焦点时的回调 | (e: domEvent) => void | () => {} | **1.0.0** |
| onCancel | 取消选择时的回调，入参为上次确认选择的值，仅 type="dateTime"\|"dateTimeRange" 且 needConfirm=true 时有效。 <br/>1.0.0 版本之前为 (dateStr: StringType, date: DateType) => void | (date: DateType, dateStr: StringType) => void |  | **0.18.0** |
| onChange | 值变化时的回调。 <br/>1.0.0 版本之前为 (dateStr: StringType, date: DateType) => void | (date: DateType, dateStr: StringType) => void |  |  |
| onChangeWithDateFirst | 0.x 中 onChange(string, Date), 1.0 后(Date, string)。此开关设为 false 时，入参顺序将与 0.x 版本保持一致 | boolean | true | **1.0.0** |
| onClear | 点击 clear 按钮时触发 | (e: domEvent) => void | () => {} | **1.16.0** |
| onConfirm | 确认选择时的回调，入参为当前选择的值，仅 type="dateTime"\|"dateTimeRange" 且 needConfirm=true 时有效。 <br/>1.0.0 版本之前为 (dateStr: StringType, date: DateType) => void | ( date: DateType, dateStr: StringType) => void |  | **0.18.0** |
| onFocus | 获得焦点时的回调 | (e: domEvent) => void | () => {} | **1.0.0** |
| onOpenChange | 面板显示或隐藏状态切换的回调 | (status: boolean) => void |  |  |
| onPanelChange | 切换面板的年份或者日期时的回调 | (date: DateType\|DateType[], dateStr: StringType\|StringType[])=>void | function | **1.28.0** |
| onPresetClick | 点击快捷选择按钮的回调 | (item: Object, e: Event) => void | () => {} | **1.24.0** |

## 类型定义

```typescript
type BaseValueType = string | number | Date;
type ValueType = BaseValueType | BaseValueType[];
type DateType = Date | Date[];
type StringType = string | string[];
type TriggerRenderProps = {
    value?: ValueType;
    inputValue?: string;
    placeholder?: string | string[];
    autoFocus?: boolean;
    size?: InputSize;
    disabled?: boolean;
    inputReadOnly?: boolean;
    componentProps?: DatePickerProps;
    [x: string]: any;
};
```

## 设计变量

<DesignToken/>

## 日期时间格式

semi-ui 组件库中采用 [date-fns(v2.9.0)](https://date-fns.org/v2.9.0/docs/Getting-Started) 作为日期时间引擎，格式化 token 含义如下：

-   `"y"` ：年
-   `"M"` ：月
-   `"d"` ：日
-   `"H"` ：小时
-   `"m"` ：分钟
-   `"s"` ：秒

默认的日期时间会格式化为：

-   `"date"`（日期）：`"yyyy-MM-dd"`
-   `"dateTime"`（日期时间）：`"yyyy-MM-dd HH:mm:ss"`
-   `"month"`（年月）：`"yyyy-MM"`
-   `"dateRange"`（日期范围）：`"yyyy-MM-dd ~ yyyy-MM-dd"`
-   `"dateTimeRange"`（日期时间范围）：`"yyyy-MM-dd HH:mm:ss ~ yyyy-MM-dd HH:mm:ss"`

多个日期或时间默认使用 `","` （英文逗号）分隔。

> 更多 token 可以查阅 [date-fns 官网](https://date-fns.org/v2.9.0/docs/Unicode-Tokens)

## FAQ

-   **日期时间选择器，时分秒选择时不想要无限滚动效果如何实现？**  
     可以通过 timePickerOpts 中的特定开关控制该行为， timePickerOpts={{ scrollItemProps: { cycled: false } }} ，cycled 设为 false 即可

-   **如何设置面板打开时默认显示的时间？**  
     可通过 defaultPickerValue 属性。
