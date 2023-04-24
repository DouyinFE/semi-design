import React, { useState } from 'react';

import { Form } from '../../form';
import Radio from '../../radio';
import Step from '../step';
import Steps from '../index';
import Icon from '../../icons';
import Button from '../../button';
import { IconTriangleDown, IconClear, IconTick, IconClose, IconBell } from '@douyinfe/semi-icons';

export default {
  title: 'Steps'
}
const sizes = ['default', 'small'];

const AllSteps = () => {
  const [stepProps, setProps] = useState({
    type: 'basic',
    size: 'small',
    current: 0,
    hasLine: true,
    direction: 'horizontal',
    initial: 0,
    status: 'finish',
  });
  return (
    <>
      <Form
        layout="vertical"
        labelPosition="left"
        onValueChange={v => setProps({ ...v })}
        initValues={stepProps}
      >
        <Form.RadioGroup field="type">
          <Radio value="fill">fill</Radio>
          <Radio value="basic">basic</Radio>
          <Radio value="nav">nav</Radio>
        </Form.RadioGroup>
        <Form.RadioGroup field="size">
          <Radio value="small">small</Radio>
          <Radio value="default">default</Radio>
        </Form.RadioGroup>
        <Form.RadioGroup field="hasLine">
          <Radio value={true}>true</Radio>
          <Radio value={false}>false</Radio>
        </Form.RadioGroup>
        <Form.InputNumber field="current"></Form.InputNumber>
        <Form.RadioGroup field="direction">
          <Radio value="horizontal">horizontal</Radio>
          <Radio value="vertical">vertical</Radio>
        </Form.RadioGroup>
        <Form.InputNumber field="initial"></Form.InputNumber>
        <Form.RadioGroup field="status">
          <Radio value="wait">wait</Radio>
          <Radio value="process">process</Radio>
          <Radio value="finish">finish</Radio>
          <Radio value="error">error</Radio>
          <Radio value="warning">warning</Radio>
        </Form.RadioGroup>
      </Form>
      <Steps type="basic" {...stepProps}>
        <Step
          title="Step.1"
          icon={<IconBell />}
          description="This is a long descriptionThis is a long descriptionThis is a long descriptionThis is a long descriptionThis is a long descriptionThis is a long description"
        ></Step>
        <Step title="Step.2" description="This is some description"></Step>
        <Step title="Step.3"></Step>
        <Step title="Step.4" description="This is some description"></Step>
      </Steps>
    </>
  );
};

export const _AllSteps = () => <AllSteps></AllSteps>;

_AllSteps.story = {
  name: 'all steps',
};

const FillStep = () => {
  return sizes.map(s => (
    <Steps key={s} size={s} current={1}>
      <Step title="中文" description="This is a description." />
      <Step title="In Progress" description="This is a description." />
      <Step title="Waiting" description="This is a description." />
    </Steps>
  ));
};

export const StepsDefaultFill = () => <FillStep />;

StepsDefaultFill.story = {
  name: 'steps default fill',
};

const BasicStep = () => {
  return sizes.map(s => (
    <Steps key={s} size={s} type="basic" current={1}>
      <Step title="Step.1" description="This is a description.This is a description." />
      <Step title="Step.2" description="This is a description.This is a description." />
      <Step title="Step.3" description="This is a description.This is a description." />
    </Steps>
  ));
};

export const StepsBasic = () => <BasicStep />;

StepsBasic.story = {
  name: 'steps basic',
};

export const StepsWithIcon = () => {
  return (
    <Steps>
      <Step status="finish" title="Login" icon={<IconTriangleDown />} />
      <Step status="finish" title="Verification" icon={<IconClear />} />
      <Step status="process" title="Pay" icon={<IconTick />} />
      <Step status="wait" title="Done" icon={<IconClose />} />
    </Steps>
  );
};

StepsWithIcon.story = {
  name: 'steps with icon',
};

const steps = [
  {
    title: 'First',
    content: 'First-content',
  },
  {
    title: 'Second',
    content: 'Second-content',
  },
  {
    title: 'Last',
    content: 'Last-content',
  },
];

class StepsDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
    };
  }

  next() {
    const current = this.state.current + 1;
    this.setState({
      current,
    });
  }

  prev() {
    const current = this.state.current - 1;
    this.setState({
      current,
    });
  }

  render() {
    const { current } = this.state;
    return (
      <div>
        <Steps current={current}>
          {steps.map(item => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <div className="steps-content">{steps[current].content}</div>
        <div className="steps-action">
          {current < steps.length - 1 && (
            <Button type="primary" onClick={() => this.next()}>
              Next
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button type="primary" onClick={() => console.log('Processing complete!')}>
              Done
            </Button>
          )}
          {current > 0 && (
            <Button
              style={{
                marginLeft: 8,
              }}
              onClick={() => this.prev()}
            >
              Previous
            </Button>
          )}
        </div>
      </div>
    );
  }
}

export const StepsWithControlled = () => {
  return <StepsDemo></StepsDemo>;
};

StepsWithControlled.story = {
  name: 'steps with controlled',
};

class StepsWithonChange extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 1,
    };
  }

  onChange(current) {
    this.setState({ current });
  }

  render() {
    const { current } = this.state;
    const { Step } = Steps;
    const steps = [
      {
        title: 'First',
        content: 'First-content',
      },
      {
        title: 'Second',
        content: 'Second-content',
      },
      {
        title: 'Last',
        content: 'Last-content',
      },
    ];

    return (
      <div>
        <Steps type="basic" current={current} onChange={current => this.onChange(current)}>
          {steps.map(item => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
      </div>
    );
  }
}

export const StepsWithOnChange = () => {
  return <StepsWithonChange />;
};

StepsWithOnChange.story = {
  name: 'steps with onChange',
};

const StatusStep = () => {
  return sizes.map(s => (
    <Steps key={s} size={s} current={1} status="error">
      <Step title="Finished" description="This is a description" />
      <Step title="In Process" description="This is a description" />
      <Step title="Waiting" description="This is a description" />
    </Steps>
  ));
};

export const StepsWithStatus = () => <StatusStep />;

StepsWithStatus.story = {
  name: 'steps with status',
};

const VerticalStep = () => {
  return sizes.map(s => (
    <Steps key={s} size={s} current={1} status="error" direction="vertical">
      <Step title="Finished" description="This is a description" />
      <Step title="In Process" description="This is a description" />
      <Step title="Waiting" description="This is a description" />
    </Steps>
  ));
};

export const StepsVertical = () => <VerticalStep />;

StepsVertical.story = {
  name: 'steps vertical',
};

const LineStep = () => {
  return sizes.map(s => (
    <Steps key={s} size={s} hasLine={false} current={1} status="error">
      <Step title="Finished" description="This is a description" />
      <Step title="In Process" description="This is a description" />
      <Step title="Waiting" description="This is a description" />
    </Steps>
  ));
};

export const StepsWithoutLine = () => <LineStep></LineStep>;

StepsWithoutLine.story = {
  name: 'steps without line',
};

const C2DItem = () => {
  const props = {
    title: "步骤标题",
    description: "辅助说明文本" 
  }

  const sizes = ['small', 'default'];
  const types = ['fill', 'basic', 'nav'];
  const direction = ['horizontal', 'vertical'];

  const { NavStep, FillStep, BasicStep } = Steps;

  return <>
      <p>仅考虑整体的方式</p>
      <Steps type={'fill'} direction={'horizontal'}>
        {[1,2,3,4].map(index => (
            <Step key={index} {...props} />
        ))}
      </Steps>
      {types.map(type => (
        <div key={`${type}`}>
          <p>type={type}</p>
          {sizes.map(size => {
            if (size ==='small' && type=== 'fill') {
              return null;
            }
            
            return (
              direction.map(dir => {
                if (type === 'nav' && dir === 'vertical') {
                  return null;
                }
                return (
                  <div key={`${type}-${size}`}>
                    <p>size={size}</p>
                    <Steps type={type} size={size} direction={dir}>
                      {[1,2,3,4].map(index => (
                          <Step key={index} {...props} />
                      ))}
                    </Steps>
                  </div>
                );
              })
            );
          })}
        </div>
      ))}
      <p>Step作为一个变体考虑</p>
      <p>horizontal, basic</p>
      <BasicStep usedInC2D {...props} status={'finish'} direction={'horizontal'} stepNumber={3} size={'default'}/>
      <BasicStep usedInC2D {...props} status={'error'} direction={'horizontal'} stepNumber={3} size={'default'}/>
      <BasicStep usedInC2D {...props} status={'warning'} direction={'horizontal'} stepNumber={3} size={'default'}/>
      <BasicStep usedInC2D {...props} status={'process'}  direction={'horizontal'} stepNumber={3} size={'default'}/>
      <BasicStep usedInC2D {...props} status={'wait'}  direction={'horizontal'} stepNumber={3} size={'default'}/>
      <p>vertical, basic</p>
      <BasicStep usedInC2D {...props} status={'finish'} direction={'vertical'} stepNumber={3} size={'default'} />
      <br />
      <BasicStep usedInC2D {...props} status={'error'} direction={'vertical'} stepNumber={3} size={'default'}  />
      <br />
      <BasicStep usedInC2D {...props} status={'warning'} direction={'vertical'} stepNumber={3} size={'default'} />
      <br />
      <BasicStep usedInC2D {...props} status={'process'} direction={'vertical'} stepNumber={3} size={'default'} />
      <br />
      <BasicStep usedInC2D {...props} status={'wait'} direction={'vertical'} stepNumber={3} size={'default'} />
      <br />
      <p>horizontal, basic, small</p>
      <BasicStep usedInC2D {...props} status={'finish'} direction={'horizontal'} stepNumber={3} size={'small'}/>
      <BasicStep usedInC2D {...props} status={'error'} direction={'horizontal'} stepNumber={3} size={'small'}/>
      <BasicStep usedInC2D {...props} status={'warning'} direction={'horizontal'} stepNumber={3} size={'small'}/>
      <BasicStep usedInC2D {...props} status={'process'} direction={'horizontal'} stepNumber={3} size={'small'}/>
      <BasicStep usedInC2D {...props} status={'wait'} direction={'horizontal'} stepNumber={3} size={'small'}/>
      <p>vertical, basic, small</p>
      <BasicStep usedInC2D {...props} status={'finish'} direction={'vertical'} stepNumber={3} size={'small'} />
      <br />
      <BasicStep usedInC2D {...props} status={'error'} direction={'vertical'} stepNumber={3} size={'small'} />
      <br />
      <BasicStep usedInC2D {...props} status={'warning'} direction={'vertical'} stepNumber={3} size={'small'}  />
      <br />
      <BasicStep usedInC2D {...props} status={'process'} direction={'vertical'} stepNumber={3} size={'small'} />
      <br />
      <BasicStep usedInC2D {...props} status={'wait'} direction={'vertical'} stepNumber={3} size={'small'}/>
      <br />
      <p>horizontal, fill</p>
      <FillStep usedInC2D {...props} status={'finish'} stepNumber={3} size={'default'} />
      <br />
      <FillStep usedInC2D {...props} status={'error'} stepNumber={3} size={'default'} />
      <br />
      <FillStep usedInC2D {...props} status={'warning'} stepNumber={3} size={'default'} />
      <br />
      <FillStep usedInC2D {...props} status={'process'} stepNumber={3} size={'default'} />
      <br />
      <FillStep usedInC2D {...props} status={'wait'} stepNumber={3} size={'default'} />
      <br />
      <p>vertical, fill</p>
      <FillStep usedInC2D {...props} status={'finish'} direction={'vertical'} stepNumber={3} size={'default'} />
      <br />
      <FillStep usedInC2D {...props} status={'error'} direction={'vertical'} stepNumber={3} size={'default'} />
      <br />
      <FillStep usedInC2D {...props} status={'warning'} direction={'vertical'} stepNumber={3} size={'default'} />
      <br /> 
      <FillStep usedInC2D {...props} status={'process'} direction={'vertical'} stepNumber={3} size={'default'} />
      <br />
      <FillStep usedInC2D {...props} status={'wait'} direction={'vertical'} stepNumber={3} size={'default'} />
      <br />
      <p>nav, small</p>
      <NavStep usedInC2D {...props} style={{ width: 116 }} active={true} size={'small'} />
      <br />
      <NavStep usedInC2D {...props} style={{ width: 56 }} active={false} size={'small'} />
      <br />
      <NavStep usedInC2D {...props} style={{ width: 116 }} active={true} size={'small'} lastOne />
      <br />
      <NavStep usedInC2D {...props} style={{ width: 56 }} active={false} size={'small'} lastOne />
      <p>nav, default</p>
      <NavStep usedInC2D {...props} style={{ width: 124 }} active={true} />
      <br />
      <NavStep usedInC2D {...props} style={{ width: 64 }} active={false} />
      <br />
      <NavStep usedInC2D {...props} style={{ width: 124 }} active={true} lastOne />
      <br />
      <NavStep usedInC2D {...props} style={{ width: 64 }} active={false} lastOne />
  </>
}

export const C2DItems = () => <C2DItem />;

C2DItems.story = {
  name: 'C2D items',
};
