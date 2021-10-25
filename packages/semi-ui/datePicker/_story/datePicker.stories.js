import React, { useState, useRef } from 'react';
import { storiesOf } from '@storybook/react';
import withPropsCombinations from 'react-storybook-addon-props-combinations';
import { addDays, addWeeks, addMonths, isBefore, startOfMonth, endOfMonth, parseISO, startOfWeek, endOfWeek } from 'date-fns';
import { Space, ConfigProvider, InputGroup, InputNumber, Form, withField } from '../../index';

// stores
import NeedConfirmDemo from './NeedConfirm';
import RenderDate from './RenderDate';
import RenderFullDate from './RenderFullDate';
import DateOffset from './DateOffset';
import AllTypesDemo from './AllTypes';
import Callbacks from './Callbacks';
import DatePicker from '../index';
import ExceptionDemo from './ExceptionDemo';
import ControlledDemo from './ControlledDemo';
import DisabledDate from './DisabledDate';
import CustomTrigger from './CustomTrigger';
import OverPopover from './OverPopover';
import OnChangeWithDateFirst from './OnChangeWithDateFirst';
import Multiple from './Multiple';
import Autofocus from './Autofocus';
import CycledDatePicker from './Cycled';
import AutoSwitchDate from './AutoSwitchDate';
import TimepikcerOpts from './TimePickerOpts';
import Density from './Density';
import DatePickerSlot from './DatePickerSlot';
import DatePickerTimeZone from './DatePickerTimeZone';
import BetterRangePicker from './BetterRangePicker';
import SyncSwitchMonth from './SyncSwitchMonth';

const stories = storiesOf('DatePicker', module);

// stories.addDecorator(withKnobs);;

const demoDiv = {
  marginTop: '20px',
  marginLeft: '20px',
};

stories.add('DatePicker default', () => (
  <div style={demoDiv}>
    <span>datePicker施工现场</span>
    <DatePicker
      insetLabel={<span>日期</span>}
      onChange={(str, date) => console.log(str)}
      onOpenChange={status => console.log(status)}
      placeholder="请选择日期"
    />
    <br />

    <span>datePicker默认显示</span>
    <DatePicker defaultOpen />
    <br />

    <span>defaultValue: new Date('2019-07-07')</span>
    <DatePicker defaultValue={new Date('2019-07-07')} onOpenChange={isOpen => console.log(isOpen)} />
    <br />

    <span>defaultValue: 2019-07-09</span>
    <DatePicker defaultValue="2019-07-09" />
    <br />

    <span>defaultValue: 1569888000000</span>
    <DatePicker defaultValue={1569888000000} onChange={(input, value) => console.log({ input, value })} />
  </div>
));

stories.add('DatePicker callbacks', () => {
  const printArgs = (...args) => console.log(...args);

  return (
    <div style={demoDiv}>
      <span>datePicker施工现场</span>
      <DatePicker onOpenChange={printArgs} />
      <br />

      <span>defaultValue: new Date('2019-07-07')</span>
      <DatePicker defaultValue={new Date('2019-07-07')} />
      <br />

      <span>defaultValue: 2019-07-09</span>
      <DatePicker defaultValue="2019-07-09" />
      <br />

      <span>defaultValue: 1569888000000</span>
      <DatePicker defaultValue={1569888000000} onChange={(input, value) => console.log(input, value)} />
    </div>
  );
});

stories.add('DatePicker multiple', () => <Multiple />);

stories.add('DateRangePicker', () => (
  <div style={demoDiv}>
    <div>dateRangePicker</div>
    <DatePicker type="dateRange" insetLabel="结束日期" prefix="test" validateStatus="error" />
    <br />

    <div>small dateRangePicker</div>
    <DatePicker type="dateRange" size="small" disabled prefix="test" />
    <br />

    <div>large dateRangePicker</div>
    <DatePicker type="dateRange" size="large" />
    <br />

    <div>compact dateRangePicker</div>
    <DatePicker type="dateRange" density='compact' validateStatus="warning" />
    <br />

    <div>dateRangePicker with offset</div>
    <DatePicker type="dateRange" startDateOffset={date => startOfWeek(date, { weekStartsOn: 1 })}
                endDateOffset={date => endOfWeek(date, { weekStartsOn: 1 })} />
    <br />

    <div>defaultValue：07/01-08/02</div>
    <DatePicker type="dateRange" defaultValue={[new Date('2019-07-01'), new Date('2019-08-02')]} />
  </div>
));

const presets = [
  {
    text: 'Today',
    start: new Date(),
    end: new Date(),
  },
  {
    text: 'Tomorrow',
    start: addDays(new Date(), 1),
    end: addDays(new Date(), 1),
  },
  {
    text: 'Next Week',
    start: addWeeks(new Date(), 1),
    end: addWeeks(new Date(), 2),
  },
  {
    text: 'Next Month',
    start: startOfMonth(addMonths(new Date(), 1)),
    end: endOfMonth(addMonths(new Date(), 1)),
  },
  {
    text: 'Today',
    start: new Date(),
    end: new Date(),
  },
  {
    text: 'Tomorrow',
    start: addDays(new Date(), 1),
    end: addDays(new Date(), 1),
  },
  {
    text: 'Next Week',
    start: addWeeks(new Date(), 1),
    end: addWeeks(new Date(), 2),
  },
  {
    text: 'Next Month',
    start: startOfMonth(addMonths(new Date(), 1)),
    end: endOfMonth(addMonths(new Date(), 1)),
  },
];

stories.add('DatePicker with presets', () => {
  const onPresetClick = (item, e) => {
    console.log('preset click', item, e);
  }
  return (    
    <div style={demoDiv}>
      <span>带快捷选择的DatePicker</span>
      <DatePicker type="dateRange" presets={presets} onPresetClick={onPresetClick} onChange={(...args) => console.log(...args)} />
      <DatePicker
        type="dateTime"
        presets={presets.map(preset => ({
          text: preset.text,
          start: preset.start,
        }))}
        onPresetClick={onPresetClick}
        onChange={(...args) => console.log(...args)}
      />
      <DatePicker
        type="dateTime"
        needConfirm
        presets={presets.map(preset => ({
          text: preset.text,
          start: preset.start,
        }))}
        onPresetClick={onPresetClick}
        onChange={(...args) => console.log(...args)}
      />
      <DatePicker
        type="month"
        presets={presets.map(preset => ({
          text: preset.text,
          start: preset.start,
        }))}
        onPresetClick={onPresetClick}
        onChange={(...args) => console.log(...args)}
      />
    </div>
  );
});

function isDisabled(dayStr) {
  return isBefore(new Date(dayStr), new Date());
}

stories.add('DatePicker disabledDate', () => (
  <div style={demoDiv}>
    <span>不可选日期</span>
    <DatePicker type="dateRange" presets={presets} disabledDate={isDisabled} />
  </div>
));

stories.add('DateTimePicker', () => (
  <div style={demoDiv}>
    <span>dateTimePicker</span>
    <DatePicker
      defaultPickerValue={parseISO('2020-02-20 20:00:00')}
      type="dateTime"
      onChange={(...args) => console.log('onChange: ', ...args)}
    />
  </div>
));

stories.add('DateTimeRange Picker', () => (
  <div style={demoDiv}>
    <span>dateTimeRangePicker</span>
    <DatePicker type="dateTimeRange" defaultPickerValue={parseISO('2020-02-20 20:00:00')} />
    <br />

    <span>dateTimeRangePicker</span>
    <DatePicker type="dateTimeRange" presets={presets} />
    <br />

    <span>dateTimeRangePicker - multiple</span>
    <DatePicker type="dateTimeRange" multiple />
    <br />
  </div>
));

stories.add('Year Picker', () => (
  <>
    <div>
      <span>Year Picker</span>
      <DatePicker type="dateTimeRange" />
    </div>
    <div>
      <span>Year Picker</span>
      <DatePicker type="dateTimeRange" presets={presets} />
    </div>
  </>
));

stories.add('Month Picker', () => {
  const Demo = () => {
    const [controlledValue, setControlledValue] = useState('2019-09');

    const _setControlledValue = value => setControlledValue(value);

    return (
      <>
        <div>
          <span>MonthPicker</span>
          <DatePicker type="month" />
        </div>
        <div>
          <span>MonthPicker with presets</span>
          <DatePicker type="month" presets={presets} />
        </div>
        <div>
          <span>MonthPicker with disabledDate</span>
          <DatePicker
            type="month"
            disabledDate={str => {
              const date = new Date(str);

              if (str.length <= 4) {
                return date.getFullYear() < 2015;
              }

              return date.getMonth() + 1 < 10;
            }}
          />
        </div>
        <div>
          <span>MonthPicker with presets</span>
          <DatePicker type="month" presets={presets} />
        </div>
        <div>
          <span>MonthPicker with controlledValue</span>
          <DatePicker type="month" value={controlledValue} onChange={_setControlledValue} />
        </div>
      </>
    );
  };

  return <Demo />;
});

stories.add('propTypes and defaultProps', () => (
  <div>
    <article>
      <p>{JSON.stringify(Object.keys(DatePicker.propTypes))}</p>
      <p>{JSON.stringify(DatePicker.defaultProps)}</p>
    </article>
  </div>
));

stories.add('受控组件', () => <ControlledDemo />);

stories.add('inputReadOnly', () => <DatePicker inputReadOnly={true} />);

stories.add('need confirm', () => <NeedConfirmDemo />);

stories.add('边界问题', () => <ExceptionDemo />);

stories.add('all types', () => <AllTypesDemo />);
stories.add('callbacks', () => <Callbacks />);

stories.add('Disabled Date', () => <DisabledDate />);

stories.add('custom trigger', () => <CustomTrigger />);
stories.add('over popover', () => <OverPopover />);

stories.add('onChange with Date first', () => <OnChangeWithDateFirst />);

stories.add('renderDate', () => <RenderDate />);
stories.add('renderFullDate', () => <RenderFullDate />);
stories.add('autoFocus', () => <Autofocus />);
stories.add('startDateOffset & endDateOffset', () => <DateOffset />);
stories.add('cycled', () => <CycledDatePicker />);
stories.add('autoSwitchDate', () => <AutoSwitchDate />);

stories.add('dropdownClassName & dropdownStyle', () => (
  <div>
    <h4>fontSize: 16，dropdownClassName: 'my-datePicker'</h4>
    <DatePicker 
      dropdownStyle={{ fontSize: 16 }}
      dropdownClassName='my-datePicker'
      onChange={(date, dateString) => console.log(dateString)}
    />
  </div>
));
stories.add('timepickerOpts', () => <TimepikcerOpts />);

stories.add('density', () => <Density />);

stories.add('topSlot/bottomSlot', () => <DatePickerSlot />);

stories.add('timeZone', () => <DatePickerTimeZone />);

stories.add('custom placeholder', () => (
  <Space wrap>
    <DatePicker placeholder="请选择日期" insetLabel="默认" />
    <DatePicker placeholder={undefined} insetLabel="undefined" />
    <DatePicker placeholder="" insetLabel="空字符串" />
    <DatePicker placeholder={false} insetLabel="false" />
    <DatePicker placeholder={null} insetLabel="null" />
    <DatePicker placeholder="" type="dateRange" insetLabel="空字符串" />
  </Space>
));

stories.add('better range picker', () => <BetterRangePicker />);

stories.add('syncSwitchMonth', () => <SyncSwitchMonth />);

stories.add('fix notifyChange', () => {
  function Demo() {
    const [tz,setTz] = useState(0);
    const [value, setVal] = useState();
    const [value2, setVal2] = useState();
    const [value3, setVal3] = useState();
    const [value4, setVal4] = useState();
    const withLog = (fn) => {
      return (val => {
          console.log('notifyChange', val);
          fn(val);
      });
    }
    return (
        <ConfigProvider timeZone={tz}>
            <InputGroup>
                <InputNumber defaultValue={0} onChange={setTz} hideButtons />
                <DatePicker type='dateTimeRange' value={value} onChange={withLog(setVal)}  />
                <DatePicker type='dateTimeRange' needConfirm value={value2} onConfirm={withLog(setVal2)}  />
                <DatePicker type='date' value={value3} onChange={withLog(setVal3)}  />
                <DatePicker type='dateRange' value={value4} onChange={withLog(setVal4)}  />
            </InputGroup>
        </ConfigProvider> 
    );
  };
  return <Demo />;

});

stories.add('select not disabled date(v1.26+)', () => {
  const defaultValue = ['2021-08-06', '2021-08-15'];
  const disabledMonth = dateStr => {
    const date = new Date(dateStr);
    const month = date.getMonth();
    if (month === 7) {
        return true;
    }
    return false;
  };
  const disabledDate = dateStr => {
    const date = new Date(dateStr);
    const day = date.getDate();
    if (day > 20 && day < 25) {
        return true;
    }
    return false;
  };

  let props = {
    type: 'dateRange',
    motion: false,
    defaultValue,
    onChange: (...args) => console.log('changed', ...args),
    style: { width: 300 }
  };

  return (
    <>
      <h4>dateRange type + disabled rangeStart and select rangeEnd</h4>
      <DatePicker {...props} disabledDate={disabledMonth} />
      <h4>date type + multiple select + given disabled defaultValue</h4>
      <DatePicker {...props} type="date" multiple disabledDate={disabledDate} />
    </>
  )
});

const CustomDatePicker = (props) => {
  const { fieldRef, ...rest } = props;
  return (
    <DatePicker {...rest} ref={fieldRef}  />
  );
};

const CustomFieldDatePicker = withField(CustomDatePicker);

stories.add('fix onFocus', () => {
  function FocusDemo() {
    const [open1, setOpen1] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [open3, setOpen3] = useState(false);
    const ref = useRef();
    const ref2 = useRef();
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
    return (
      <>
        <DatePicker
          type="date"
          presets={presets}
          open={open1}
          onPresetClick={() => {
              setOpen1(false);
          }}
          onFocus={() => {
              console.log('focus');
              setOpen1(true);
          }}
          onBlur={() => {console.log('blur')}}
          style={{ width: 300 }}
        />
        <br /><br />
        <DatePicker
          type="dateTimeRange"
          presets={presets}
          open={open2}
          onPresetClick={() => {
            console.log('click presets', ref);
            setOpen2(false);
            setTimeout(() => {
              ref.current.foundation.closePanel();
              console.log(ref);
            }, 0);
          }}
          onFocus={() => {
            console.log('focus');
            setOpen2(true);
          }}
          onBlur={() => {console.log('blur')}}
          style={{ width: 500 }}
          ref={ref}
        />
        <Form>
          <CustomFieldDatePicker
              type="dateTimeRange"
              field="a"
              label="Form.DatePicker"
              presets={presets}
              open={open3}
              onPresetClick={() => {
                console.log('click presets', ref2);
                setOpen3(false);
                setTimeout(() => {
                  ref2.current &&  ref2.current.foundation.closePanel();
                }, 0);
              }}
              onFocus={() => {
                console.log('focus');
                setOpen3(true);
              }}
              onBlur={() => {console.log('blur')}}
              style={{ width: 500 }}
              fieldRef={ref2}
          />
        </Form>
      </>
    );
  };
  return <FocusDemo />
});

stories.add('fix disabledTime callback #1418', () => {
  function Demo() {
    const disabledTime2 = (date, panelType) => {
      console.log('disabledTime callback parameter: ', date, panelType);
      if (panelType === 'left') {
        return { disabledHours: () => [17, 18] };
      } else {
        return { disabledHours: () => [12, 13, 14, 15, 16, 17, 18] };
      }
    };

    return (
      <>
        <strong>fix disabledTime callback parameter bug</strong>
        <DatePicker
            type="dateTimeRange"
            hideDisabledOptions={false}
            disabledTime={disabledTime2}
            defaultValue={['2021-09-08', '2021-10-03']}
            style={{ width: 400 }}
        />
        <DatePicker
            type="dateTime"
            hideDisabledOptions={false}
            defaultValue={'2021-09-08'}
            disabledTime={disabledTime2}
            style={{ width: 400 }}
        />
      </>
    );
  };

  return <Demo />;
});

stories.add('rangeSeparator', () => (
  <Space wrap>
    <div>
      <div>custom rangeSeparator</div>
      <DatePicker type="dateRange" rangeSeparator="-" defaultValue={[new Date('2019-07-01'), new Date('2019-08-02')]} />
      <DatePicker type="dateTimeRange" rangeSeparator="-" defaultValue={[new Date('2019-07-01'), new Date('2019-08-02')]} />
    </div>
    <div>
      <div>default rangeSeparator</div>
      <DatePicker type="dateRange" defaultValue={[new Date('2019-07-01'), new Date('2019-08-02')]} />
      <DatePicker type="dateTimeRange" defaultValue={[new Date('2019-07-01'), new Date('2019-08-02')]} />
    </div>
  </Space>
));
