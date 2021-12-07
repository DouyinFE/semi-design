import React, { Component, useState } from 'react';
import TimePickerPanel from '../index';
import { TimePicker as BasicTimePicker, Button } from '../../index';
import { strings } from '@douyinfe/semi-foundation/timePicker/constants';
import { get } from 'lodash';

import Callbacks from './Callbacks';
import CustomTrigger from './CustomTrigger';
import DisabledTime from './DisabledTime';

let TimePicker;

export default {
  title: 'TimePicker',
  parameters: {
    chromatic: { disableSnapshot: true },
  },
}

export {
  Callbacks,
  CustomTrigger,
  DisabledTime
}

// auto add scrollItemProps.cycled = false, prevent waiting indefinitely in snapshot testing
const TimePickerForTest = props => {
  let scrollItemProps = {};
  if (!props.scrollItemProps) {
    scrollItemProps = { cycled: false };
  } else {
    scrollItemProps = { ...props.scrollItemProps, cycled: false };
  }
  return <BasicTimePicker {...props} scrollItemProps={scrollItemProps} />;
};

const init = () => {
  if (process.env.NODE_ENV === 'development') {
    TimePicker = BasicTimePicker;
  } else {
    TimePicker = TimePickerForTest;
  }
};
init();

export const TimePickerPanelDefault = () => {
  return (
    <div>
      <TimePicker panelHeader={'Time Select'} onChange={val => console.log(val)} />
      <TimePicker
        format={'HH:mm:ss'}
        defaultValue={'10:24:18'}
        defaultOpen={true}
        scrollItemProps={{ cycled: false }}
      />
    </div>
  );
};

TimePickerPanelDefault.story = {
  name: 'TimePickerPanel default',
};

export const BasicUsage = () => <TimePicker />;

BasicUsage.story = {
  name: 'basic usage',
};

class Demo extends React.Component {
  constructor() {
    super();
    this.state = {
      value: null,
    };
    this.onChange = this.onChange.bind(this);
  }

  onChange(time) {
    //   console.log(time);
    this.setState({ value: time });
  }

  render() {
    return <TimePicker value={this.state.value} onChange={this.onChange} />;
  }
}

export const PanelHeader = () => {
  const Demo = () => {
    const [value, setValue] = useState(new Date());

    const onChange = (date, str) => setValue(date);

    return (
      <div>
        <TimePicker panelHeader={'Time Select'} value={new Date()} />
        <TimePicker panelHeader={'Time Select'} value={value} onChange={onChange} />
        <TimePicker open />
      </div>
    );
  };

  return <Demo />;
};

PanelHeader.story = {
  name: 'panelHeader',
};

function CustomDemo() {
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

export const HeaderAndFooter = () => <CustomDemo />;

HeaderAndFooter.story = {
  name: 'header and footer',
};

export const Format = () => <TimePicker format={'HH:mm'} defaultValue={'10:24'} />;

Format.story = {
  name: 'format',
};

export const Disabled = () => {
  return <TimePicker defaultValue={'12:08:23'} disabled />;
};

Disabled.story = {
  name: 'disabled',
};

export const MinuteStepAndSecondStep = () => {
  return <TimePicker minuteStep={15} secondStep={10} />;
};

MinuteStepAndSecondStep.story = {
  name: 'minuteStep and secondStep',
};

export const InputReadOnly = () => {
  return <TimePicker inputReadOnly />;
};

InputReadOnly.story = {
  name: 'inputReadOnly',
};

export const RangePicker = () => {
  const RangePickerDemo = () => {
    const log = (...args) => {
      console.log(...args);
    };

    const disabledHM = { 3: [3, 6, 12, 24, 48], 9: [9, 18, 36] };
    const disabledHMS = { 6: { 6: [6, 12, 24, 48] }, 18: { 18: [18, 36] } };

    const defaultValue = ['10:11:12', '12:11:23'];
    const [value, setValue] = useState(['10:11:12', '12:11:23']);
    const disabledHours = () => [1, 2, 4, 8, 16];
    const disabledMinutes = hours => get(disabledHM, [hours], []);
    const disabledSeconds = (hours, seconds) => get(disabledHMS, [hours, seconds], []);

    const onChange = (dates, str) => {
      log(dates, str);
      setValue(dates);
    };

    return (
      <div style={{ margin: 200 }}>
        <div>
          <p>基本</p>
          <TimePicker type={strings.TYPE_TIME_RANGE_PICKER} onChange={log} />
        </div>
        <br />
        <div>
          <p>默认值</p>
          <TimePicker
            defaultValue={defaultValue}
            type={strings.TYPE_TIME_RANGE_PICKER}
            onChange={log}
          />
        </div>
        <div>
          <p>受控</p>
          <TimePicker value={value} type={strings.TYPE_TIME_RANGE_PICKER} onChange={onChange} />
        </div>
        <div>
          <p>默认值+format</p>
          <TimePicker
            format="HH:mm"
            disabledHours={disabledHours}
            disabledMinutes={disabledMinutes}
            disabledSeconds={disabledSeconds}
            defaultValue={['10:12', '18:08']}
            type={strings.TYPE_TIME_RANGE_PICKER}
            onChange={log}
          />
          <br />
        </div>
        <div>
          <p>默认值+use12Hours+format</p>
          <TimePicker
            use12Hours
            format="a hh:mm"
            disabledHours={disabledHours}
            disabledMinutes={disabledMinutes}
            disabledSeconds={disabledSeconds}
            defaultValue={['上午 10:12', '上午 11:08']}
            type={strings.TYPE_TIME_RANGE_PICKER}
            onChange={log}
            scrollItemProps={{ mode: 'normal' }}
          />
          <br />
        </div>
      </div>
    );
  };

  return <RangePickerDemo />;
};

RangePicker.story = {
  name: 'range picker',
};
RangePicker.parameters = {
  chromatic: { disableSnapshot: false },
}

export const ShowClear = () => (
  <>
    <TimePicker
      defaultValue={new Date()}
      showClear
      onChange={(...args) => {
        console.log('clear', ...args);
      }}
    />
    <TimePicker
      type="timeRange"
      defaultValue={(new Date(), new Date())}
      showClear
      onChange={(...args) => {
        console.log('clear', ...args);
      }}
    />
  </>
);
