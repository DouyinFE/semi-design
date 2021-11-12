import React, { useState } from 'react';

import { Button } from '@douyinfe/semi-ui/';
import { Switch } from '../../index';

export default {
  title: 'Switch'
}

export const _Switch = () => (
  <div>
    <Switch onChange={(v, e) => console.log(v)}></Switch>
    <Switch defaultChecked={true} onChange={(v, e) => console.log(v)}></Switch>
  </div>
);

_Switch.story = {
  name: 'switch',
};

export const SwitchSize = () => (
  <div>
    <Switch onChange={(v, e) => console.log(v)}></Switch>
    <Switch onChange={(v, e) => console.log(v)} size="small"></Switch>
    <Switch onChange={(v, e) => console.log(v)} size="large"></Switch>
  </div>
);

SwitchSize.story = {
  name: 'switch size',
};

export const SwitchCheckedTextUncheckedText = () => (
  <div>
    <Switch defaultChecked checkedText="开" uncheckedText="关" />
    <Switch checkedText={'|'} uncheckedText="〇" />
    <br />
    <br />
    <Switch checkedText="开" uncheckedText="关" />
    <Switch defaultChecked checkedText="｜" uncheckedText="〇" />
    <br />
    <br />
    <Switch checkedText="开" uncheckedText="关" size="large" />
    <Switch checkedText="｜" uncheckedText="〇" size="large" />
    <br />
    <br />
    <Switch defaultChecked checkedText="开" uncheckedText="关" size="large" />
    <Switch defaultChecked checkedText="｜" uncheckedText="〇" size="large" />
  </div>
);

SwitchCheckedTextUncheckedText.story = {
  name: 'switch checkedText &  uncheckedText',
};

export const SwitchDisabled = () => (
  <>
    <Switch disabled>disabled</Switch>

    <Switch disabled checked={true} onChange={(v, e) => console.log(v)}></Switch>
  </>
);

SwitchDisabled.story = {
  name: 'switch disabled',
};

const ControledSwitch = () => {
  const [checked, onChange] = useState(true);
  return <Switch checked={checked} onChange={(v, e) => onChange(v)} />;
};
export const SwitchCheckedOnChange = () => <ControledSwitch />;

SwitchCheckedOnChange.story = {
  name: 'switch checked + onChange',
};

const UnControledSwitch = () => {
  const onChange = checked => {
    console.log(checked);
  };
  return (
    <>
      {/* <Switch onChange={onChange} defaultChecked={false}/> */}
      <Switch onChange={onChange} defaultChecked={true} />
    </>
  );
};
export const SwitchDefaultCheckedOnChange = () => <UnControledSwitch />;

SwitchDefaultCheckedOnChange.story = {
  name: 'switch defaultChecked + onChange',
};

class LoadingDemo extends React.Component {
  constructor() {
    super();
    this.state = {
      checked: true,
      loading: false,
    };
    this.onChange = this.onChange.bind(this);
  }
  onChange(checked) {
    this.setState({ checked });
  }
  render() {
    return (
      <>
        <Button
          onClick={() => {
            this.setState({ checked: true });
          }}
        >
          checked
        </Button>
        <br />
        <br />
        <Button
          onClick={() => {
            this.setState({ checked: false });
          }}
        >
          unchecked
        </Button>
        <br />
        <br />
        <Button
          onClick={() => {
            this.setState({ loading: !this.state.loading });
          }}
        >
          loading
        </Button>
        <br />
        <br />
        <Switch
          checked={this.state.checked}
          onChange={this.onChange}
          loading={this.state.loading}
        ></Switch>
        <br />
        <br />
        <hr />
        <Switch loading disabled />
        <br />
        <br />
        <Switch loading disabled defaultChecked />
        <br />
        <br />
      </>
    );
  }
}

export const Loading = () => <LoadingDemo />;

Loading.story = {
  name: 'loading',
};
