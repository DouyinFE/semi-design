import React, { Component } from 'react';
import Slider from '../index';
import Input from '../../input/index';
import { Modal, Button, Form, Row, Col } from '@douyinfe/semi-ui/';

export default {
  title: 'Slider'
}

function formatter(value) {
  return `${value}自定义`;
}
let divStyle = {
  width: 800,
  marginLeft: 20,
  marginTop: 40,
  paddingBottom: 30,
};

export const HorizontalSlider = () => (
  <div>
    <div style={divStyle}>
      <div>default</div>
      <Slider
        showBoundary={true}
        onChange={value => {
          console.log('value改变了' + value);
        }}
      ></Slider>
    </div>
    <div style={divStyle}>
      <div>min, max</div>
      <Slider
        showBoundary={true}
        min={10}
        max={50}
        onChange={value => {
          console.log('value改变了' + value);
        }}
      ></Slider>
    </div>
    <div style={divStyle}>
      <div>range</div>
      <Slider
        defaultValue={[20, 60]}
        range
        // step={0.01}
        onChange={value => {
          console.log('value改变了啊啊啊啊啊啊' + value);
        }}
        onAfterChange={value => {
          console.log('value结束于' + value);
        }}
      ></Slider>
    </div>
    <div style={divStyle}>
      <div>组合输入框</div>
      <InputSlider />
    </div>
    <div style={divStyle}>
      <div>格式化tooltip</div>
      <Slider
        tipFormatter={formatter}
        onChange={value => {
          console.log('value改变了' + value);
        }}
      ></Slider>
    </div>
    <div style={divStyle}>
      <div>tooltip=null</div>
      <Slider
        tipFormatter={null}
        onChange={value => {
          console.log('value改变了' + value);
        }}
      ></Slider>
    </div>
    <div style={divStyle}>
      <div>tooltipVisible=true始终显示tooltip</div>
      <Slider
        tooltipVisible={true}
        onChange={value => {
          console.log('value改变了' + value);
        }}
      ></Slider>
    </div>
    <div style={divStyle}>
      <div>step=10</div>
      <Slider
        step={10}
        marks={{ 10: '10', 20: '20', 30: '30', 40: '40', 50: '50' }}
        defaultValue={[10, 100]}
        range={true}
        onChange={value => {
          console.log('value改变了' + value);
        }}
      ></Slider>
    </div>
    <div style={divStyle}>
      <div>step=0.1</div>
      <Slider
        step={0.1}
        marks={{ 0.1: '0.1', 0.2: '0.2', 0.3: '0.3', 0.4: '0.4', 0.5: '0.5' }}
        min={0}
        max={1}
        defaultValue={[0.1, 0.5]}
        range={true}
        onChange={value => {
          console.log('value改变了' + value);
        }}
      ></Slider>
    </div>
    <div style={divStyle}>
      <div>marks</div>
      <Slider
        marks={{ 20: '20c', 40: '40c' }}
        defaultValue={[0, 100]}
        range={true}
        onChange={value => {
          console.log('value改变了' + value);
        }}
      ></Slider>
    </div>
    <div style={divStyle}>
      <div>inclued</div>
      <Slider
        marks={{ 20: '20c', 40: '40c' }}
        included={false}
        defaultValue={[0, 100]}
        range={true}
        onChange={value => {
          console.log('value改变了' + value);
        }}
      ></Slider>
    </div>
  </div>
);

HorizontalSlider.story = {
  name: 'horizontal slider',
};

class InputSlider extends Component {
  state = {
    value: 10,
  };

  getSliderValue = value => {
    this.setState({ value: value / 1 });
  };

  render() {
    const { value } = this.state;
    return (
      <div style={{ display: 'flex', width: 800 }}>
        <div style={{ width: 500 }}>
          <Slider step={0.1} value={value} onChange={value => this.getSliderValue(value)}></Slider>
        </div>
        <Input onChange={v => this.getSliderValue(v)} style={{ flex: 1 }} value={value} />
      </div>
    );
  }
}

let divStyle1 = {
  height: 400,
  marginLeft: 20,
  marginTop: 40,
  paddingRight: 30,
  display: 'inline-block',
};

export const VerticalSlider = () => (
  <div>
    <div style={divStyle1}>
      <Slider vertical range defaultValue={[20, 60]}></Slider>
    </div>
  </div>
);

VerticalSlider.story = {
  name: 'vertical slider',
};

export const VerticalSliderInScrollContainer = () => (
  <div style={{ height: '300px', overflow: 'scroll' }}>
    <div style={{ height: '600px', marginTop: '30px' }}>
      <div style={divStyle1}>
        <Slider vertical onChange={value => {}}></Slider>
      </div>
      <div style={divStyle1}>
        <Slider
          vertical
          range
          defaultValue={[20, 60]}
          onChange={value => {
            console.log('value改变了' + value);
          }}
        ></Slider>
      </div>
      <div style={divStyle1}>
        <Slider
          vertical
          range
          marks={{ 20: '20c', 40: '40c' }}
          step={10}
          defaultValue={[20, 60]}
          onChange={value => {
            console.log('value改变了' + value);
          }}
        ></Slider>
      </div>
    </div>
  </div>
);

VerticalSliderInScrollContainer.story = {
  name: '在滚动容器中的vertical slider',
};

export const SliderInScrollContainer = () => (
  <div style={{ width: '300px', overflow: 'scroll' }}>
    <div style={{ width: '500px', marginTop: '10px' }}>
      <div style={divStyle}>
        <Slider onChange={value => {}}></Slider>
      </div>
      <div style={divStyle}>
        <Slider
          range
          defaultValue={[20, 60]}
          onChange={value => {
            console.log('value改变了' + value);
          }}
        ></Slider>
      </div>
      <div style={divStyle}>
        <Slider
          range
          marks={{ 20: '20c', 40: '40c' }}
          step={10}
          defaultValue={[20, 60]}
          onChange={value => {
            console.log('value改变了' + value);
          }}
        ></Slider>
      </div>
    </div>
  </div>
);

SliderInScrollContainer.story = {
  name: '在滚动容器中的slider'
}

class ControlledSlider extends Component {
  state = {
    value: 50,
    rangeValue: undefined,
  };
  changeValue = () => {
    this.setState({ value: this.state.value + 10 });
  };
  changeRangeValue = rangeValue => {
    console.log('rangeValue' + rangeValue);
    this.setState({ rangeValue: rangeValue });
  };
  render() {
    const { value, rangeValue } = this.state;
    return (
      <div>
        <Button onClick={() => this.changeValue()}>点击改变value</Button>
        <div style={{ width: 800, marginLeft: 20, marginTop: 40 }}>
          <Slider
            value={value}
            onChange={value => {
              console.log('value改变了' + value);
            }}
          ></Slider>
        </div>
        <div style={{ width: 800, marginLeft: 20, marginTop: 40 }}>
          <Slider
            value={rangeValue}
            onChange={rangeValue => this.changeRangeValue(rangeValue)}
            range
          ></Slider>
        </div>
      </div>
    );
  }
}

export const ControlledSliderDemo = () => <ControlledSlider />;
ControlledSliderDemo.story = {
  name: '受控slider'
}

class DisableSlider extends Component {
  state = {
    disabled: false,
  };
  changeValue = () => {
    this.setState({ disabled: !this.state.disabled });
  };
  render() {
    const { disabled } = this.state;
    return (
      <div>
        <Button onClick={() => this.changeValue()}>toggle disable slider</Button>
        <div style={{ width: 800, marginLeft: 20, marginTop: 40 }}>
          <Slider
            disabled={disabled}
            defaultValue={10}
            onChange={value => {
              console.log('value改变了' + value);
            }}
          ></Slider>
        </div>
      </div>
    );
  }
}

export const _DisableSlider = () => <DisableSlider />;

_DisableSlider.story = {
  name: 'disable slider',
};

class TestDemo extends React.Component {
  constructor() {
    super();
    this.state = {
      visible: false,
    };
    this.showDialog = this.showDialog.bind(this);
    this.getFormApi = this.getFormApi.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }
  getFormApi(formApi) {
    this.formApi = formApi;
  }
  showDialog() {
    this.setState({
      visible: true,
    });
  }
  handleOk(e) {
    this.setState({
      visible: false,
    });
  }
  handleCancel(e) {
    this.setState({
      visible: false,
    });
  }
  render() {
    const { Slider, Switch } = Form;
    return (
      <>
        <Button onClick={this.showDialog}>打开弹窗</Button>
        <Modal
          title="基本对话框"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form style={{ padding: 10, width: '100%' }} onValueChange={v => console.log(v)}>
            <Row>
              <Col span={12}>
                <Slider field="range" range initValue={[10, 100]} style={{ width: '90%' }} />
              </Col>
              <Col span={12}>
                <Switch field="switch" />
              </Col>
            </Row>
          </Form>
        </Modal>
      </>
    );
  }
}

export const SliderInModal = () => <TestDemo />;

SliderInModal.story = {
  name: 'slider in modal',
};

export const RangeMinSlider = () => (
  <Slider
    defaultValue={[20, 60]}
    range
    // step={0.01}
    min={10}
    // onChange={(value) => { console.log('value改变了啊啊啊啊啊啊' + value) }}
    // onAfterChange={(value) => { console.log('value结束于' + value) }}
  />
);

RangeMinSlider.story = {
  name: 'range min slider',
};
