---
localeCode: en-US
order: 22
category: Input
title:  Form
subTitle: Form
icon: doc-form
dir: column
---


## Form

-   **Rerender on demand**, avoids unnecessary full-volume rendering, higher performance
-   Easy to use, **simple structure**, avoids unnecessary hierarchical nesting
-   FormState / FieldState can also be easily obtained from outside the Form
    Provides an external method to operate inside the form: formApi / fieldApi
-   Support for encapsulating custom components into form controls, and you can quickly access your team's components through the extension mechanism provided by Form (through `withField` HOC)
-   Support Form level / Field level assignment, verification (synchronous / asynchronous)

## Field

Semi encapsulates all form controls (Input、Select、Checkbox、DatePicker etc.) with withField once.
Taking over their data flow (value & onChange)  
When in use, you need to import from the Form (note: only the control imported from the Form has data synchronization)

### Supported Field Component

-   `Input`, `InputNumber`, `TextArea`, `Select`, `Checkbox`, `Radio`, `RadioGroup`, `Switch`, `DatePicker`, `TimePicker`, `Slider`, `InputGroup`, `TreeSelect`, `Cascader`, `Rating`, `AutoComplete`, `Label`, `ErrorMessage`, `Section`、`TagInput`
    All mounted under Form and declared directly in \<Form.Input\> and \<Form.Select\> when used.
-   `Upload` is already planned and will be supported in the follow-up

```javascript
import { Form } from '@douyinfe/semi-ui';

const FormInput = Form.Input;
const FormSelect = Form.Select;
const Option = FormSelect.Option;
```

The Field level component provided by Form, its `value` (or other properties specified by `valueKey`), onChange (or other callback functions specified by `onKeyChangeFnName`)
Properties are hijacked by Form, so

1. ** You don't need and shouldn't use `onChange` to sync, of course you can continue to listen to onChange events for the latest values **
2. ** You cannot set the `value` of field with attributes such as `value`, `defaultValue`, `checked`, `defaultChecked`, etc. The default value can be set by Field's `initValue` or Form's `unitValues` **
3. ** You should not modify the value of Form State directly, all changes to the data in the Form should be done by providing `formApi`, `fieldApi` **

## Demos

### Various ways to declare form

Semi Form supports multiple writing at the same time.

#### Basic Usage

Add `field` property to each field component.
You can also set label` properties for each field, by default is the same as field

`label` can be passed in a string directly, or declared in the form of an object, configure `extra`, `required`, `optional` and other attributes to deal with more complex scenarios

<Notice type='primary' title='Notice'>
    The field attribute is required props
</Notice>


```jsx live=true dir="column"
import React from 'react';
import { Form, Tooltip } from '@douyinfe/semi-ui';
import { IconHelpCircle } from '@douyinfe/semi-icons';

() => (
    <Form layout='horizontal'>
        <Form.Input field='username' label='UserName' style={{ width:80 }}/>
        <Form.Input
            field='password'
            label={{ 
                text: 'Password',
                extra: <Tooltip content='详情'><IconHelpCircle style={{ color: 'var(--semi-color-text-2)' }}/></Tooltip> 
            }}
            style={{ width:176 }}
        />
        <Form.Select
            field="role"
            label={{ text: 'Role', optional: true }}
            style={{ width:176 }}
            optionList={[
                { label: 'Admin', value: 'admin' },
                { label: 'User', value: 'user' },
                { label: 'Guest', value: 'guest' },
            ]}
        >
        </Form.Select>
    </Form>
);
```

#### Other forms of support

When you need to get formState, formApi, values, etc. directly inside the Form structure, you can also use the following writing

#### Via render props

```jsx live=true dir="column"
import React from 'react';
import { Form } from '@douyinfe/semi-ui';

() => (
    <Form render={({ formState, formApi, values }) => (
        <>
            <Form.Select field="role" label='Role' style={{width:120}}>
                <Form.Select.Option value="admin">Admin</Form.Select.Option>
                <Form.Select.Option value="user">User</Form.Select.Option>
                <Form.Select.Option value="guest">Guest</Form.Select.Option>
            </Form.Select>
            <Form.Input field='userName' label='UserName' />
            <Form.Input field='password' label='Password' />
            <code style={{marginTop: 30}}>{JSON.stringify(formState)}</code>
        </>
    )} layout='horizontal'>
    </Form>
);
```

#### Via children function

Children is a function that returns all form controls

```jsx live=true dir="column"
import React from 'react';
import { Form } from '@douyinfe/semi-ui';

() => (
    <Form layout='horizontal'>
        {
            ({ formState, values, formApi }) => (
                <>
                    <Form.Select field="role" label='Role' style={{width:120}}>
                        <Form.Select.Option value="admin">Admin</Form.Select.Option>
                        <Form.Select.Option value="user">User</Form.Select.Option>
                        <Form.Select.Option value="guest">Guest</Form.Select.Option>
                    </Form.Select>
                    <Form.Input field='userName' label='UserName' />
                    <Form.Input field='password' label='Password' />
                    <code style={{marginTop: 30}}>{JSON.stringify(formState)}</code>
                </>
            )
        }
    </Form>
);
```

#### Via props.component

Pass the entire internal structure directly in the form through `component` attribute.

```jsx live=true dir="column"
import React from 'react';
import { Form } from '@douyinfe/semi-ui';

class Demo extends React.Component {
    constructor() { super(); }
    render() {
        const fields = ({ formState, formApi, values }) => (
            <>
                <Form.Input field='Role'/>
                <Form.Input field='UserName' />
                <Form.Input field='Password' />
                <code style={{marginTop: 30}}>{JSON.stringify(formState)}</code>
            </>
        );
        return <Form component={fields} layout='horizontal'/>;
    }
}
```

### Supported Fields example collection

```jsx live=true dir="column"
import React from 'react';
import { Form, Col, Row, Button } from '@douyinfe/semi-ui';

class BasicDemoWithInit extends React.Component {
    constructor() {
        super();
        this.state = {
            initValues: {
                name: 'semi',
                business: ['hotsoon'],
                role: 'ued',
                switch: true,
            }
        };
        this.getFormApi = this.getFormApi.bind(this);
    }

    getFormApi(formApi) { this.formApi = formApi; }

    render() {
        const { Input, InputNumber, AutoComplete, Select, TreeSelect, Cascader, DatePicker, TimePicker, TextArea, CheckboxGroup, Checkbox, RadioGroup, Radio, Slider, Rating, Switch, TagInput } = Form;
        const { initValues } = this.state;
        const plainOptions = ['A', 'B', 'C'];
        const style = { width: '90%' };
        const treeData = [
            {
                label: 'Asia',
                value: 'Asia',
                key: '0',
                children: [
                    {
                        label: 'China',
                        value: 'China',
                        key: '0-0',
                        children: [
                            {
                                label: 'Beijing',
                                value: 'Beijing',
                                key: '0-0-0',
                            },
                            {
                                label: 'Shanghai',
                                value: 'Shanghai',
                                key: '0-0-1',
                            },
                        ],
                    },
                ],
            },
            {
                label: 'North America',
                value: 'North America',
                key: '1',
            }
        ];

        return (
            <Form
                getFormApi={this.getFormApi}
                initValues={initValues}
                style={{ padding: 10, width: '100%' }}
                onValueChange={(v)=>console.log(v)}
            >
                <Row>
                    <Col span={12}>
                        <Input
                            field="name"
                            label="Name（Input）"
                            initValue={'mikeya'}
                            style={style}
                            trigger='blur'
                        />
                    </Col>
                    <Col span={12}>
                        <DatePicker field="date" label='Date（DatePicker）' style={style} placeholder='Choose data' />
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Select field="role" style={style} label='Role（Select）' placeholder='Choose role'>
                            <Select.Option value="qa">Quality Assurance</Select.Option>
                            <Select.Option value="rd">Software Engineer</Select.Option>
                            <Select.Option value="pm">Product Manager</Select.Option>
                            <Select.Option value="ued">Designer</Select.Option>
                        </Select>
                    </Col>
                    <Col span={12}>
                        <Select
                            field="business"
                            multiple
                            style={style}
                            placeholder='Choose application'
                            label="Application（Multiple Select）"
                        >
                            <Select.Option value="abc">Semi</Select.Option>
                            <Select.Option value="hotsoon">Vigo</Select.Option>
                            <Select.Option value="xigua">BuzzVideo</Select.Option>
                        </Select>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Cascader
                            placeholder="Choose Area"
                            treeData={treeData}
                            field='area'
                            label='Area（Cascader）'
                            style={style}
                        >
                        </Form.Cascader>
                    </Col>
                    <Col span={12}>
                        <Form.TreeSelect
                            field="tree"
                            style={style}
                            label='Node（TreeSelect）'
                            placeholder='Select Service Node'
                            treeData={treeData}
                            filterTreeNode
                        >
                        </Form.TreeSelect>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <TextArea
                            style={style}
                            field='description'
                            label='Apply Reason（TextArea）'
                        />
                    </Col>
                    <Col span={12}>
                        <CheckboxGroup
                            field="type"
                            label='Apply type（CheckboxGroup）'
                            initValue={['user', 'admin']}
                            rules={[
                                { Requested: true }
                            ]}
                        >
                            <Checkbox value="admin">admin</Checkbox>
                            <Checkbox value="user">user</Checkbox>
                            <Checkbox value="guest">guest</Checkbox>
                            <Checkbox value="root">root</Checkbox>
                        </CheckboxGroup>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <RadioGroup field="isMonopolize" label='Whether exclusive resources（Radio）'>
                            <Radio value={true}>Yes</Radio>
                            <Radio value={false}>No</Radio>
                        </RadioGroup>
                    </Col>
                    <Col span={12}>
                        <CheckboxGroup options={plainOptions} field="checkbox" label='Type（CheckboxGroup）' direction='horizontal'/>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <TimePicker field="time" label='End Time（TimePicker）' style={{ width: '90%' }}/>
                    </Col>
                    <Col span={12}>
                        <InputNumber field='number' label='Number of applications（InputNumber）' initValue={20} style={style}/>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Slider field="range" label='Resource usage alarm threshold(%)（Slider）' initValue={10} style={{ width: '90%' }}/>
                    </Col>
                    <Col span={12}>
                        <Switch field='switch' label='Switch(Switch)'/>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Rating field="rating" label='Satisfaction(Rating)' initValue={2} style={{ width: '90%' }}/>
                    </Col>
                    <Col span={12}>
                        <TagInput 
                            field="product"
                            label='Product（TagInput）'
                            initValue={['abc','hotsoon']}
                            style={style}
                        />
                    </Col>
                </Row>
                <Checkbox value="false" field="agree" noLabel={true}>
                    I have read and understood the relevant regulations（Checkbox）
                </Checkbox>
                <Button type="primary" htmlType="submit" className="btn-margin-right">Submit</Button>
                <Button htmlType="reset">Reset</Button>
            </Form>
        );
    }
}
```

### Field binding syntax

Every Field must have a `field` property. This is how the form manages the state of this field.
See the field syntax section below for additional details on what you can pass in for field.

The field can be a simple string, can be contained`.`Or`[]`String that supports multi-level nesting  
Below is an example of the field name and their mapping path in FormState

| Field                  | Resolution                         |
| ---------------------- | ---------------------------------- |
| username               | formState.values.username          |
| user\[0\]              | formState.values.user\[0\]         |
| siblings.1             | formState.values.siblings\[1\]     |
| siblings\['2'\]        | formState.values.siblings\[2\]     |
| parents\[0\].name      | formState.values.parents\[0\].name |
| parents\[1\]\['name'\] | formState.values.parents\[1\].name |

```jsx live=true dir="column"
import React from 'react';
import { Form, Row, Col, Toast, TextArea } from '@douyinfe/semi-ui';

() => (
    <Form
        onSubmit={values => Toast.info({ content: JSON.stringify(values) })}
    >
        {
            ({ formState, values, formApi }) => (
                <Row>
                    <Col span={12}>
                        <Form.Input field='username' placeholder='Try input something'/>
                        <Form.Input field='user[0]' placeholder='Try input something'/>
                        <Form.Input field='siblings.1' placeholder='Try input something'/>
                        <Form.Input field="siblings['2']" placeholder='Try input something'/>
                        <Form.Input field='parents[0].name' placeholder='Try input something'/>
                        <Form.Input field="parents[1]['name']" placeholder='Try input something'/>
                    </Col>
                    <Col span={10} offset={1} style={{marginTop: 12}}>
                        <Form.Label text='formState.values in real time：'></Form.Label>
                        <TextArea value={JSON.stringify(formState.values)}></TextArea>
                    </Col>
                </Row>
            )
        }
    </Form>
);
```

### Form layout

-   Vertical Layout: Arrange each field vertically （By default）  
     Semi Design recommends a vertical layout.

```jsx live=true dir="column"
import React from 'react';
import { Form, Button, Toast } from '@douyinfe/semi-ui';

() => {
    const handleSubmit = (values) => {
        console.log(values);
        Toast.info('Submit Success');
    };
    return (
        <Form onSubmit={values => handleSubmit(values)} style={{width: 400}}>
            {({formState, values, formApi}) => (
                <>
                    <Form.Input field='phone' label='PhoneNumber' style={{ width: '100%' }} placeholder='Enter your phone number'></Form.Input>
                    <Form.Input field='password' label='Password' style={{ width: '100%' }} placeholder='Enter your password'></Form.Input>
                    <Form.Checkbox field='agree' noLabel>I have read and agree to the terms of service</Form.Checkbox>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <p>
                            <span>Or</span><Button theme='borderless' style={{ color: 'var(--semi-color-primary)', marginLeft: 10, cursor:'pointer' }}>Sign up</Button>
                        </p>
                        <Button disabled={!values.agree} htmlType='submit' type="tertiary">Log in</Button>
                    </div>
                </>
            )}
        </Form>
    );
};
```

-   Horizontal Layout: Arrange each field horizontally
    You can use the horizontal layout by setting `layout='layout'`

```jsx live=true dir="column"
import React from 'react';
import { Form } from '@douyinfe/semi-ui';

() => (
    <Form layout='horizontal'>
        <Form.Input field='phone' label='PhoneNumber' placeholder='Enter your phone number'></Form.Input>
        <Form.Input field='password' label='Password' placeholder='Enter your password'></Form.Input>
    </Form>
);
```

-   Label Position, Label Align  
     You can control the position of the label in the Field and the direction of text alignment by setting `labelPosition`, `labelAlign`

```jsx live=true dir="column"
import React from 'react';
import { Form, Select, Checkbox, Radio } from '@douyinfe/semi-ui';


class BasicDemo extends React.Component {
    constructor() {
        super();
        this.state = {
            labelPosition: 'left',
            labelAlign: 'left',
            labelWidth: '180px'
        };
        this.changeLabelPos = this.changeLabelPos.bind(this);
        this.changeLabelAlign = this.changeLabelAlign.bind(this);
    }


    changeLabelPos(labelPosition) {
        let labelWidth;
        labelPosition === 'left' ? labelWidth = '180px' : labelWidth = 'auto';
        this.setState({ labelPosition, labelWidth });
    }

    changeLabelAlign(labelAlign) { this.setState({ labelAlign }); }

    render() {
        const { labelPosition, labelAlign, labelWidth } = this.state;
        return (
            <>
                <div style={{borderBottom: '1px solid var(--semi-color-text-3)', paddingBottom: 10 }}>
                    <Form.Label style={{ marginLeft: 10 }}>Switch Label Position:</Form.Label>
                    <Select onChange={this.changeLabelPos} value={labelPosition} style={{width: 100}}>
                        <Select.Option value='top'>top</Select.Option>
                        <Select.Option value='left'>left</Select.Option>
                    </Select>
                    <Form.Label style={{ marginLeft: 10 }}>Switch Label Text Align</Form.Label>
                    <Select onChange={this.changeLabelAlign} value={labelAlign} style={{width: 100}}>
                        <Select.Option value='left'>left</Select.Option>
                        <Select.Option value='right'>right</Select.Option>
                    </Select>
                </div>
                <Form
                    labelPosition={labelPosition}
                    labelWidth={labelWidth}
                    labelAlign={labelAlign}
                    style={{ padding: '10px', width: 600 }}>
                    <Form.Input
                        field="input"
                        label="PhoneNumber"
                        trigger='blur'
                        style={{width: 200}}
                        rules={[
                            { required: true, message: 'required Error' },
                            { type: 'string', message: 'type error' },
                            { validator: (rule, value) => value === 'semi', message: 'not semi' }
                        ]}
                    />
                    <Form.Switch label="Agree" field='agree'/>
                    <Form.InputNumber field='price' label='price' style={{width: 200}}/>
                    <Form.Select label="Name" field='name' style={{width: 200}}>
                        <Option value="mike">mike</Option>
                        <Option value="jane">jane</Option>
                        <Option value="kate">kate</Option>
                    </Form.Select>
                    <Form.CheckboxGroup label="Role" field='role' direction='horizontal'>
                        <Checkbox value="admin">admin</Checkbox>
                        <Checkbox value="user">user</Checkbox>
                        <Checkbox value="guest">guest</Checkbox>
                        <Checkbox value="root">root</Checkbox>
                    </Form.CheckboxGroup>
                    <Form.RadioGroup field="Sex">
                        <Radio value="1">man</Radio>
                        <Radio value="2">woman</Radio>
                    </Form.RadioGroup>
                </Form>
            </>
        );
    }
}
```

-   A more complex layout.  
    You can also combine the `Row` and `Col` provided by the `Grid` to arrange the form structure as you want.

```jsx live=true dir="column"
import React from 'react';
import { Form, Row, Col } from '@douyinfe/semi-ui';

() => (
    <Form
        labelPosition='top'
        getFormApi={this.getFormApi}
        style={{ padding: '10px' }}>
        <Row>
            <Col span={8}>
                <Form.Input
                    field="nickName1"
                    label="NickName"
                    style={{ width: '250px' }}
                    trigger='blur'
                    rules={[
                        { required: true, message: 'required error' },
                        { type: 'string', message: 'type error' },
                        { validator: (rule, value) => value === 'semi', message: 'not semi' }
                    ]}
                />
            </Col>
            <Col span={8}>
                <Form.DatePicker field='date1' label='Valid Date' style={{ width: '250px' }}/>
            </Col>
            <Col span={8}>
                <Form.Select label="Application" field='business1' style={{ width: '250px' }}>
                    <Form.Select.Option value="abc">Semi</Form.Select.Option>
                    <Form.Select.Option value="hotsoon">Vigo</Form.Select.Option>
                    <Form.Select.Option value="xigua">BussVideo</Form.Select.Option>
                </Form.Select>
            </Col>
        </Row>
        <Row>
            <Col span={6}>
                <Form.Input
                    field="nickName2"
                    label="NickName"
                    style={{ width: '200px' }}
                    trigger='blur'
                    rules={[
                        { required: true, message: 'required error' },
                        { type: 'string', message: 'type error' },
                        { validator: (rule, value) => value === 'semi', message: 'not semi' }
                    ]}
                />
            </Col>
            <Col span={6}>
                <Form.DatePicker field='date2' label='Valid Date' style={{ width: '200px' }}/>
            </Col>
            <Col span={6}>
                <Form.Select label="Application" field='business2' style={{ width: '250px' }}>
                    <Form.Select.Option value="abc">Semi</Form.Select.Option>
                    <Form.Select.Option value="hotsoon">Vigo</Form.Select.Option>
                    <Form.Select.Option value="xigua">BussVideo</Form.Select.Option>
                </Form.Select>
            </Col>
            <Col span={6}>
                <Form.Select field="role" style={{ width: '250px' }} label='Role（Select）' placeholder='Choose role'>
                    <Form.Select.Option value="qa">Quality Assurance</Form.Select.Option>
                    <Form.Select.Option value="rd">Software Engineer</Form.Select.Option>
                    <Form.Select.Option value="pm">Product Manager</Form.Select.Option>
                    <Form.Select.Option value="ued">Designer</Form.Select.Option>
                </Form.Select>
            </Col>
        </Row>
    </Form>
);
```

### wrapper Col / label Col

When you need to set a uniform layout for all Fields in a Form, you can set `wrapperCol` and `labelCol` on the `Form` to quickly generate the layout. No need to manually use `Row`, `Col` manual layout.  
`wrapperCol`,`labelCol`Property Configuration Reference [Col components](/en-US/basic/grid#Col)

```jsx live=true dir="column"
import React from 'react';
import { Form } from '@douyinfe/semi-ui';

() => (
    <Form
        wrapperCol={{ span: 20 }}
        labelCol={{ span: 2 }}
        labelPosition='left'
        labelAlign='right'
    >
        <Form.Input field='name' style={{width: 250}} label='Name' placeholder='Input Name' trigger='blur' />
        <Form.Select field="role" label='Role' placeholder='Choose Role' style={{width: 250}}>
            <Form.Select.Option value="qa">Quality Assurance</Form.Select.Option>
            <Form.Select.Option value="rd">Software Engineer</Form.Select.Option>
            <Form.Select.Option value="pm">Product Manager</Form.Select.Option>
            <Form.Select.Option value="ued">Designer</Form.Select.Option>
        </Form.Select>
    </Form>
);
```

### Remove automatically added Label

Form will automatically inserts `Label` for Field Component. If you do not need to automatically insert the `Label` module, you can turn off this feature by setting `noLabel=true` in Field

```jsx live=true dir="column"
import React from 'react';
import { Form } from '@douyinfe/semi-ui';

() => (
    <Form onSubmit={(values) => console.log(values)} style={{ width: 400 }}>
        <Form.Input field='name' label='UserName' trigger='blur' noLabel={true} style={{width: 250}} placeholder='Input userName'/>
        <Form.Select field="role" label='UserRole' style={{ width: '250px' }} noLabel={true} placeholder='Choose role'>
            <Form.Select.Option value="qa">Quality Assurance</Form.Select.Option>
            <Form.Select.Option value="rd">Software Engineer</Form.Select.Option>
            <Form.Select.Option value="pm">Product Manager</Form.Select.Option>
            <Form.Select.Option value="ued">Designer</Form.Select.Option>
        </Form.Select>
    </Form>
);
```

### Export Label, ErrorMessage use

When the built-in Label and ErrorMessage layout does not meet the business requirements, you need to combine the positions yourself, but you want to use the default styles of Label and ErrorMessage directly.  
you can import them from the `Form` module, and combine `Form.Label` / `Form.ErrorMessage` by yourself.  
For details of their API, refer to [Label](#Form.Label) / [ErrorMessage](#Form.ErrorMessage)

```jsx
import { Form } from '@douyinfe/semi-ui';
const { Label, ErrorMessage } = Form;
```

### Use Form.Slot

When your custom component needs to maintain the same layout style as the Field component, you can place your custom component in `Form.Slot`  
`labelWidth`, `labelAlign`, `wrapperCol`, `labelCol` set on the Form component automatically acts on `Form.Slot`  
For the Slot property configuration, refer to [Form.Slot](#Form.Slot)

```jsx live=true dir="column"
import React from 'react';
import { Form } from '@douyinfe/semi-ui';

class AssistComponent extends React.Component {
    constructor() {
        super();
    }
    render() {
        return (
            <Form
                onChange={v=>console.log(v)}
                onSubmit={v=>console.log(v)}
                style={{width: 600}}
                labelPosition='left'
                labelWidth={100}
            >
                <Form.Input field='effectName' label='EffectName' style={{width: 250}}/>
                <Form.Select
                    style={{width: 300}}
                    field="type"
                    label="EffectType"
                >
                    <Form.Select.Option value="faceSticker">FaceSticker</Form.Select.Option>
                    <Form.Select.Option value="backgroundSticker">BackgroundSticker</Form.Select.Option>
                </Form.Select>
                <Form.ErrorMessage />
                <Form.Slot label={{ text: 'SlotA' }}>
                    <div style={{display: 'flex', alignItems: 'center', height: '100%'}}>
                        {`I'm Semi Form SlotA, a custom ReactNode`}
                    </div>
                </Form.Slot>
                <Form.Slot label={{ text: 'SlotB', width: 160, align: 'right' }}>
                    <div style={{display: 'flex', alignItems: 'center', height: '100%'}}>
                        {`I'm Semi Form SlotA, i have different labelWidth and textAlign.`}
                    </div>
                </Form.Slot>
            </Form>
        );}
}
```

### Embedded Label

By setting the `labelPositon` to`inset`, you can embed label in the field component. This feature currently support `Input`, `InputNumber`, `DatePicker`, `TimePicker`, `Select`, `Cascader`, `TreeSelect`

```jsx live=true dir="column"
import React from 'react';
import { Form } from '@douyinfe/semi-ui';
() => (
    <Form labelPosition='inset' layout='horizontal'>
        <Form.Input field='name' label='UserName' trigger='blur' style={{width: 250}} placeholder='Input userName'/>
        <Form.Select field="role" label='UserRole' style={{ width: '250px' }}>
            <Form.Select.Option value="qa">Quality Assurance</Form.Select.Option>
            <Form.Select.Option value="rd">Software Engineer</Form.Select.Option>
            <Form.Select.Option value="pm">Product Manager</Form.Select.Option>
            <Form.Select.Option value="ued">Designer</Form.Select.Option>
        </Form.Select>
        <Form.DatePicker field="date" label='Start Date' style={{ width: '250px' }}>
        </Form.DatePicker>
    </Form>
);
```

### Using Input Group

When you need to combine some fields to use, you can use `Form.InputGroup` to wrap them.  
In Semi Form, when you using field components like `Form.Input`、`Form.Select`, Form will insert Label module automatically for them.  
But usually, in`InputGroup` you only need a Label belonging to the entire Group.
You can set the label property in the `InputGroup` to insert a Label belonging to the Group  
`label` configurable properties, see [Label](#Form.Label)

```jsx live=true dir="column"
import React from 'react';
import { Form, Button } from '@douyinfe/semi-ui';

() => (
    <Form onSubmit={(values) => console.log(values)} labelPosition='top' style={{ width: 400 }}>
        <Form.InputGroup label={{ text: (<span>PhoneNumber</span>), required: true }} labelPosition='top'>
            <Form.Select style={{ width: 150 }} field='phonePrefix' initValue='+86' rules={[{ required: true }]} showClear>
                <Form.Select.Option value='+1'>USA +1</Form.Select.Option>
                <Form.Select.Option value='+86'>China +86</Form.Select.Option>
                <Form.Select.Option value='+81'>Japan+81</Form.Select.Option>
            </Form.Select>
            <Form.Input initValue='18912345678' style={{ width: 250 }} field='phoneNumber' rules={[{ required: true }]} showClear/>
        </Form.InputGroup>
        <Form.Input field='name' trigger='blur' initValue='Semi' label='Name'></Form.Input>
        <Button htmlType='submit'>Submit</Button>
    </Form>
);
```

### Form in the Modal pop-up layer

You can place the Form in Modal and load it as a popup.  
When submitting, use `formApi.validate()` to centrally verify the Field

```jsx live=true dir="column"
import React from 'react';
import { Form, Modal, Select, Button, Row, Col } from '@douyinfe/semi-ui';


class ModalFormDemo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
        };
        this.showDialog = this.showDialog.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.getFormApi = this.getFormApi.bind(this);
    }

    showDialog() {
        this.setState({ visible: true });
    }

    handleOk() {
        this.formApi.validate()
            .then((values) => {
                console.log(values);
            })
            .catch((errors) => {
                console.log(errors);
            });
    }

    handleCancel() {
        this.setState({ visible: false });
    }

    getFormApi(formApi) {
        this.formApi = formApi;
    }

    render(){
        const { visible } = this.state;
        let message = 'Required';
        return (
            <>
                <Button onClick={this.showDialog}>Open Dialog</Button>
                <Modal
                    title="New"
                    visible={visible}
                    onOk={this.handleOk}
                    style={{width: 600}}
                    onCancel={this.handleCancel}
                >
                    <Form
                        getFormApi={this.getFormApi}
                    >
                        <Row>
                            <Col span={7}>
                                <Form.Select
                                    field='region'
                                    label="Country/Region"
                                    style={{width:120}}
                                    rules={[
                                        { required: true, message },
                                    ]}
                                >
                                    <Option value="China">China</Option>
                                    <Option value="US">USA</Option>
                                    <Option value="Europe">Europe</Option>
                                    <Option value="Japan">Japan</Option>
                                </Form.Select>
                            </Col>
                            <Col span={17}>
                                <Form.Input
                                    field='owner'
                                    label="Owner"
                                    trigger='blur'
                                    rules={[
                                        { required: true, message },
                                    ]}
                                />
                            </Col>
                            <Col span={7}>
                                <Form.Select
                                    field='area'
                                    label="Area"
                                    placeholder='Choose Area'
                                    style={{width:120}}
                                    rules={[
                                        { required: true, message },
                                    ]}
                                >
                                    <Form.Select.Option value="China">China</Form.Select.Option>
                                    <Form.Select.Option value="US">USA</Form.Select.Option>
                                    <Form.Select.Option value="Europe">Europe</Form.Select.Option>
                                    <Form.Select.Option value="Japan">Japan</Form.Select.Option>
                                </Form.Select>
                            </Col>
                            <Col span={17}>
                                <Form.Input
                                    field='department'
                                    label="Department"
                                    trigger='blur'
                                    rules={[
                                        { required: true, message },
                                    ]}
                                />
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            </>
        );
    }
}
```

### Configure initial values and verification rules

-   You can configure check rules for each Field through `rules`  
     The verification library inside the Form is based on async-validator, and more configuration rules can be found in its [official documentation](https://github.com/yiminghe/async-validator)
-   You can uniformly set the initial value for the entire form through the `initValues` of form, or you can set the initial value through `initValue` in each field (the latter has a higher priority)

```jsx live=true dir="column"
import React from 'react';
import { Form } from '@douyinfe/semi-ui';

class BasicDemoWithInit extends React.Component {
    constructor() {
        super();
        this.state = {
            initValues: {
                name: 'semi',
                role: 'rd'
            }
        };
        this.getFormApi = this.getFormApi.bind(this);
    }

    getFormApi(formApi) { this.formApi = formApi; }

    render() {
        const { Select, Input } = Form;
        const style = { width: '100%' };
        return (
            <Form initValues={this.state.initValues}>
                <Input
                    field="name"
                    label="Name（Input）"
                    style={style}
                    trigger='blur'
                    rules={[
                        { required: true, message: 'required error' },
                        { type: 'string', message: 'type error' },
                        { validator: (rule, value) => value === 'muji', message: 'not muji' }
                    ]}
                />
                <Select field="role" style={style} label='Role' placeholder='Choose Role' initValue={'pm'}>
                    <Select.Option value="qa">Quality Assurance</Select.Option>
                    <Select.Option value="rd">Software Engineer</Select.Option>
                    <Select.Option value="pm">Product Manager</Select.Option>
                    <Select.Option value="ued">Designer</Select.Option>
                </Select>
            </Form>
        );
    }
}
```

### Custom Validate (Form Level)

You can set a custom validation function validateFields for the `form` as a whole, which will be called when submit

#### Synchronous Validate

When validate success, you should return an empty string.  
When validate fails, you should return the error message (Object, key is fieldName, value is the corresponding error message)

```jsx live=true dir="column"
import React from 'react';
import { Form, Button } from '@douyinfe/semi-ui';

class FormLevelValidateSync extends React.Component {
    constructor() {
        super();
        this.syncValidate = this.syncValidate.bind(this);
    }

    syncValidate(values) {
        const errors = {};
        if (values.name !== 'mike') {
            errors.name = 'you must name mike';
        }
        if (values.sex !== 'female') {
            errors.sex = 'must be woman';
        }
        errors.familyName = [
            { before: 'before errror balabala ', after: 'after error balabala' },
            'familyName[1] error balabala'
        ];
        return errors;
    }

    render() {
        return (
            <Form validateFields={this.syncValidate} layout='horizontal'>
                <Form.Input field='name' trigger='blur'></Form.Input>
                <Form.Input field='familyName[0].before' trigger='blur'></Form.Input>
                <Form.Input field='familyName[0].after' trigger='blur'></Form.Input>
                <Form.Input field='familyName[1]' trigger='blur'></Form.Input>
                <div style={{display: 'flex', alignItems: 'flex-end'}}>
                    <Button type="primary" htmlType="submit" className="btn-margin-right">
                        Submit
                    </Button>
                    <Button htmlType="reset">reset</Button>
                </div>
            </Form >
        );
    }
}
```

#### Asynchronous Validate

For asynchronous validation, you should return a promise. In promise.then() you need to return the corresponding error message.

```jsx live=true dir="column"
import React from 'react';
import { Form, Button } from '@douyinfe/semi-ui';

class FormLevelValidateAsync extends React.Component {
    constructor() {
        super();
        this.asyncValidate = this.asyncValidate.bind(this);
    }

    asyncValidate(values) {
        const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
        return sleep(2000).then(() => {
            let errors = {};
            if (values.name !== 'mike') {
                errors.name = 'you must name mike';
            }
            if (values.sex !== 'female') {
                errors.sex = 'sex not valid';
            }
            return errors;
        });
    }

    render() {
        return (
            <Form validateFields={this.asyncValidate} layout='horizontal'>
                <Form.Input field='name' trigger='blur'></Form.Input>
                <Form.Input field='familyName[0].before' trigger='blur'></Form.Input>
                <Form.Input field='familyName[1]' trigger='blur'></Form.Input>
                <Form.Input field='sex' trigger='blur'></Form.Input>
                <div style={{display: 'flex', alignItems: 'flex-end'}}>
                    <Button type="primary" htmlType="submit" className="btn-margin-right">
                        Submit
                    </Button>
                    <Button htmlType="reset">reset</Button>
                </div>
            </Form >
        );
    }
}
```

### Custom Validate (Field Level)

You can specify a custom validation function for field. Supports synchronous and asynchronous validation (by returning promises)

```jsx live=true dir="column"
import React from 'react';
import { Form, Button } from '@douyinfe/semi-ui';

class FieldLevelValidateDemo extends React.Component {
    constructor() {
        super();
        this.validateName = this.validateName.bind(this);
        this.asyncValidate = this.asyncValidate.bind(this);
    }

    validateName(val) {
        if (!val) {
            return '【sync】can\'t be empty';
        } else if (val.length <= 5) {
            return '【sync】must more than 5';
        }
        return '';
    }

    asyncValidate(val, values) {
        const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
        return sleep(2000).then(() => {
            if (!val) {
                return '【async】can\'t be empty';
            } else if (val.length <= 5) {
                return '【async】must more than 5';
            } else {
                return '';
            }
        });
    }

    render() {
        return (
            <Form>
                <Form.Input field='name' label='【name】asyncValidate after 2s' validate={this.asyncValidate} trigger='blur'></Form.Input>
                <Form.Input field='familyName' label='【familyName】syncValidate' validate={this.validateName} trigger='blur'></Form.Input>
                <Button htmlType="reset">reset</Button>
            </Form >
        );
    }
}
```

### Linkage Fields

You can achieve the linkage between Fields by listening to the `onChange` of Field and then using formApi to make modifications.

```jsx live=true dir="column"
import React from 'react';
import { Form, Button, Row } from '@douyinfe/semi-ui';

class LinkFieldForm extends React.Component {
    constructor() {
        super();
        this.getFormApi = this.getFormApi.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
    }

    handleSelectChange(value) {
        let text = value === 'male' ? 'Hi male' : 'Hi female!';
        this.formApi.setValue('Note', text);
    }

    getFormApi(formApi) { this.formApi = formApi; }

    render() {
        return (
            <Form getFormApi={this.getFormApi} onValueChange={values => console.log(values) } style={{ width: 300 }}>
                <Form.Input field="Note" style={{ width: 300 }} placeholder='Automatically update after choose Sex'/>
                <Form.Select field="Sex" onChange={this.handleSelectChange} style={{ width: 300 }}>
                    <Form.Select.Option value="female">female</Form.Select.Option>
                    <Form.Select.Option value="male">male</Form.Select.Option>
                </Form.Select>
                <Row>
                    <Button type="primary" htmlType="submit" className="btn-margin-right">
                        Submit
                    </Button>
                    <Button htmlType="reset">reset</Button>
                </Row>
            </Form>
        );
    }
}
```

### Dynamic form

#### Dynamically add and delete fields

```jsx live=true dir="column"
import React from 'react';
import { Form, Button } from '@douyinfe/semi-ui';

() => (
    <Form style={{ width: 450 }}>
        {({ formState }) => (
            <React.Fragment>
                <Form.Input field="name" label='Name' />
                <Form.RadioGroup field="isAnchor" label='Is registered anchor'>
                    <Form.Radio value="yes">yes</Form.Radio>
                    <Form.Radio value="no">no</Form.Radio>
                </Form.RadioGroup>
                {formState.values.isAnchor === 'yes' ? (
                    <Form.Input field="liveRoom" label='Live room name' />
                ) : null}
                <Button htmlType="submit">Submit</Button>
            </React.Fragment>
        )}
    </Form>
);
```

#### Add or delete form items dynamically - by use ArrayField

For array items that are dynamically added or deleted, we provide the `ArrayField` component to simplify the operation of add / remove

```jsx live=true dir="column"
import React from 'react';
import { ArrayField, TextArea, Button, Form, useFormState } from '@douyinfe/semi-ui';

class ArrayFieldDemo extends React.Component {
    constructor() {
        super();
        this.state = {
            menu: [
                { name: 'Face stickers', type: '2D' },
                { name: 'Background sticker', type: '3D' },
            ]
        };
    }

    render() {
        let { menu } = this.state;
        const ComponentUsingFormState = () => {
            const formState = useFormState();
            return (
                <TextArea style={{marginTop: 10}} value={JSON.stringify(formState)} />
            );
        };
        return (
            <Form style={{ width: 500 }} labelPosition='left' allowEmpty>
                <ArrayField field='effects' initValue={menu}>
                    {({ add, arrayFields }) => (
                        <React.Fragment>
                            <Button onClick={add}>Add</Button>
                            {
                                arrayFields.map(({ field, key, remove }, i) => (
                                    <div key={key} style={{ width: 1000, display: 'flex' }}>
                                        <Form.Input
                                            field={`${field}[name]`}
                                            label={`Effect Name：`}
                                            style={{width: 200, marginRight: 16}}
                                        >
                                        </Form.Input>
                                        <Form.Select
                                            field={`${field}[type]`}
                                            label={`Effect Type：`}
                                            style={{width: 90}}
                                        >
                                            <Form.Select.Option value='2D'>2D</Form.Select.Option>
                                            <Form.Select.Option value='3D'>3D</Form.Select.Option>
                                        </Form.Select>
                                        <Button type='danger' onClick={remove} style={{ margin: 16 }}>remove</Button>
                                    </div>
                                ))
                            }
                        </React.Fragment>
                    )}
                </ArrayField>
                <ComponentUsingFormState />
            </Form>
        );
    }
}
```

#### Add or delete form items dynamically - by use formApi

If you don't use ArrayField, you can use the provided formApi to manually add or delete formState.

```jsx live=true dir="column"
import React from 'react';
import { Form, Button, TextArea } from '@douyinfe/semi-ui';

class ArrayDemo extends React.Component {
    constructor() {
        super();
        this.state = {
            initValues: {
                effects: [
                    { name: 'Face stickers', type: '2D', key: 1 },
                    { name: 'Background sticker', type: '3D', key: 2 },
                ]
            }
        };
        this.id = 3;
        this.getFormApi = this.getFormApi.bind(this);
        this.add = this.add.bind(this);
        this.remove = this.remove.bind(this);
        this.renderItems = this.renderItems.bind(this);
    }
    getFormApi(formApi) {
        this.formApi = formApi;
    }
    add(obj) {
        let effects = this.formApi.getValue('effects');
        if (!effects) {
            effects = [];
        }
        effects.push({ name: '', type: '', key: this.id++  });
        this.formApi.setValue('effects', effects);
    }
    remove(key) {
        let effects = this.formApi.getValue('effects');
        effects = effects.filter((effect, index) => key !== effect.key);
        if (!effects.length) {
            effects = undefined;
        }
        this.formApi.setValue('effects', effects);
    }
    renderItems(formState, values) {
        return values.effects && values.effects.map((effect, i) => (
            <div key={effect.key} style={{ width: 1000, display: 'flex' }}>
                <Form.Input field={`effects[${i}].name`} style={{width: 200, marginRight: 16}}></Form.Input>
                <Form.Select field={`effects[${i}].type`} style={{width: 90}}>
                    <Form.Select.Option value='2D'>2D</Form.Select.Option>
                    <Form.Select.Option value='3D'>3D</Form.Select.Option>
                </Form.Select>
                <Button type='danger' onClick={() => this.remove(effect.key)} style={{ margin: 16 }}>Remove</Button>
            </div>
        ));
    }
    render() {
        let { initValues } = this.state;
        return (
            <Form
                getFormApi={this.getFormApi}
                initValues={initValues}
                style={{ width: 500 }}
                labelPosition='left'
                labelWidth='180px'
            >
                {({ formState, values }) => (
                    <>
                        <Button onClick={this.add}>add</Button>
                        {this.renderItems(formState, values)}
                        <TextArea style={{marginTop: 10}} value={JSON.stringify(formState.values)} />
                    </>
                )}
            </Form>
        );
    }
}
```

### Use of Hook

We provide four Hooks so that you can easily access Form internal state and call Form and Field related api in Functional Component which placed inside the Form structure without passing through props.

```jsx
import { useFormApi, useFormState, useFieldApi, useFieldState } from '@douyinfe/semi-ui';
```

#### useFormApi

`useFormApi` allows you to directly access the formApi of the parent Form component within Functional Component via hook

```jsx live=true dir="column"
import React from 'react';
import { useFormApi, Form, Button } from '@douyinfe/semi-ui';

class UseFromApiDemo extends React.Component {
    constructor() { super(); }
    render() {
        const ComponentUsingFormApi = () => {
            const formApi = useFormApi();
            const change = () => {
                formApi.setValue('name', Math.random());
            };
            return (
                <Button onClick={change}>ChangeName By【formApi】</Button>
            );
        };
        return (
            <Form>
                <Form.Input field='name' initValue='mike'></Form.Input>
                <ComponentUsingFormApi />
            </Form>
        );
    }
}
```

#### useFormState

`useFormState` allows you to directly access the form State of the parent Form component within Functional Component via hook

```jsx live=true dir="column"
import React from 'react';
import { useFormState, Form } from '@douyinfe/semi-ui';

class UseFromStateDemo extends React.Component {
    constructor() { super(); }
    render() {
        const ComponentUsingFormState = () => {
            const formState = useFormState();
            return (
                <pre>
                    <code>{JSON.stringify(formState)}</code>
                </pre>
            );
        };
        return (
            <Form>
                <Form.Input field='name' initValue='mike'></Form.Input>
                <h5>FormState read by 【useFormState】：</h5>
                <ComponentUsingFormState />
            </Form>
        );
    }
}
```

#### useFieldApi

`useFieldApi` allows you to call the api of the specified Field directly within Functional Component via hook

```jsx live=true dir="column"
import React from 'react';
import { useFieldApi, Form, Button } from '@douyinfe/semi-ui';

class UseFieldApiDemo extends React.Component {
    constructor() { super(); }
    render() {
        const ComponentUsingFieldApi = () => {
            const nameFieldApi = useFieldApi('name');
            const change = () => {
                nameFieldApi.setValue(Math.random());
            };
            return (
                <Button onClick={change}>Click Me!!! changeNameBy【fieldApi】</Button>
            );
        };
        return (
            <Form>
                <Form.Input field='name' initValue='mike'></Form.Input>
                <ComponentUsingFieldApi />
            </Form>
        );
    }
}
```

#### useFieldState

`useFieldState` allows you to directly access the State of the specified Field within Functional Component via hook

```jsx live=true dir="column"
import React from 'react';
import { useFieldState, Form } from '@douyinfe/semi-ui';

class UseFieldStateDemo extends React.Component {
    constructor() { super(); }
    render() {
        const ComponentUsingFieldState = props => {
            const fieldState = useFieldState(props.field);
            return (
                <>
                    <span>【{props.field}】FieldState read by 【useFieldState】：</span>
                    <code>{JSON.stringify(fieldState)}</code>
                </>
            );
        };
        return (
            <Form>
                <Form.Input field='name' initValue='mike'></Form.Input>
                <ComponentUsingFieldState field='name' />
                <Form.Input field='country' initValue='china'></Form.Input>
                <ComponentUsingFieldState field='country' />
            </Form>
        );
    }
}
```

### Use of HOC

We provided two HOC: `withFormApi`、`withFormState`, you can access the API of the Form and the internal state within other components  
Provided HOC: `withField`, to encapsulating custom components as Field that conform the Semi Form data flow.

```jsx
import { withFormApi, withFormState, withField } from '@douyinfe/semi-ui';
```

#### HOC - withFormApi

You can encapsulate the component via `withFormApi` HOC so that the formApi of the parent Form component can be called directly inside the component  
Note that the encapsulated components must be placed inside the Form structure.

```jsx live=true dir="column"
import React from 'react';
import { withFormApi, Form, Button } from '@douyinfe/semi-ui';

class withFormApiDemo extends React.Component {
    constructor() {
        super();
    }
    renderComponentWithFormApi() {
        const SomeComponetInsideForm = props => (
            <Button onClick={() => {
                props.formApi.setValue('name', Math.random());
            }}>Click Me!!! ChangeName By【formApi】</Button>
        );
        return ComponentWithFormApi = withFormApi(SomeComponetInsideForm);

    }
    render() {
        const ComponentWithFormApi = this.renderComponentWithFormApi();
        return (
            <Form>
                <Form.Input field='name' label='Name' initValue='steve'></Form.Input>
                <Form.Input field='familyName' label='FamilyName' initValue='jobs'></Form.Input>
                <Button htmlType='submit'>submit</Button>
                <ComponentWithFormApi />
            </Form>
        );
    }
}
```

#### HOC - withFormState

You can encapsulate the component via `withFormState` HOC so that the component has direct access to the Form State of the parent Form component.  
Note that the encapsulated components must be placed inside the Form structure.

```jsx live=true dir="column"
import React from 'react';
import { withFormState, Form } from '@douyinfe/semi-ui';

class withFormStateDemo extends React.Component {
    constructor() {
        super();
    }
    render() {
        const SomeComponentInsideForm = props => (
            <code>{JSON.stringify(props.formState)}</code>
        );
        const ComponentWithFormState = withFormState(SomeComponentInsideForm);

        return (
            <Form>
                <Form.Input field='name' label='Name' initValue='steve'></Form.Input>
                <Form.Input field='familyName' label='FamilyName' initValue='jobs'></Form.Input>
                <ComponentWithFormState />
            </Form>
        );
    }
}
```

### With Field encapsulation custom form control

Via `withField`, you can extend other custom components into Field. Form will taking over its behavior.

Note: Custom components must be controlled components.

With Field did the following things.

-   Take over the `value` of the component (or other properties specified by valueKey), `onChange` (or other callback functions specified by onKeyChangeFnName)
-   Insert Field's `<Form.Label>`above the field
-   Insert Field's `<ErrorMessage>` under the field

With Field Options specific configuration can be consulted [withFieldOption](#WithFieldOption)

```jsx
withField(YourComponent, withFieldOption);
```

```jsx live=true dir="column"
import React from 'react';
import { withField, Form } from '@douyinfe/semi-ui';

class CustomFieldDemo extends React.Component {
    constructor() {
        super();
    }
    render() {
        // Here to encapsulat HTML input
        const htmlInput = (props) => {
            let value = props.value || '';
            let { validateStatus, ...rest } = props; // prevent props being transparently transmitted to DOM
            return <input {...rest} value={value} />; 
        };
        const CustomInput = withField(htmlInput, { valueKey: 'value', onKeyChangeFnName: 'onChange', valuePath: 'target.value' });

        const ComponentUsingFormState = () => {
            const formState = useFormState();
            return (
                <pre>
                    <code>{JSON.stringify(formState.values)}</code>
                </pre>
            );
        };
        return (
            <Form>
                <CustomInput field='name' />
                <ComponentUsingFormState />
            </Form>
        );
    }
}
```

## API reference

## Form Props

| Properties        | Instructions                                                                                                                                                                                                                                                                                                        | Type                                            | Default    |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- | ---------- |
| autoScrollToError | If setting true，when submit or call formApi.validate () fails verification, it will automatically scroll to the wrong field, object config refer to [options](https://github.com/stipsan/scroll-into-view-if-needed#options)                                                                                       | boolean\| object                                | false      |
| allowEmpty        | Whether to keep the key of the null field in the values, keep the key when true, and remove the key when false    | boolean                                         | false      |
| component         | For declaring fields, not used at the same time as render, props.children                                                                                                                                                                                                                                           | ReactNode                                       |
| className         | Classname for form tag                                                                                                                                                                                                                                                                                              | string                                          |
| disabled          | If true, all fields inside the form structure will automatically inherit the disabled attribute                                                                                                                                                                                                                     | boolean                                         | false      |
| extraTextPosition | The extraTextPosition property applied to each Field uniformly controls the display position of extraText. Middle (the vertical direction is displayed in the order of Label, extraText, and Field), bottom (the vertical direction is displayed in the order of Label, Field, and extraText) <br/>**since v1.9.0** | string                                          | 'bottom'   |
| getFormApi        | This function will be executed once when the form is mounted and returns formApi. <br/>formApi can be used to modify the internal state of the form (value, touched, error)                                                                                                                                         | function (formApi: object)                      |            |
| initValues        | Used to uniformly set the initial value of the form <br/>(will be consumed only once when form is mount)                                                                                                                                                                                                            | object                                          |            |
| layout            | The layout of fields, optional `horizontal` or `vertical`                                                                                                                                                                                                                                                           | string                                          | 'vertical' |
| labelCol          | Uniformly applied to the label label layout of each Field, with [Col Component](/en-US/basic/grid#Col), <br/>set `span`, `span` values, such as {span: 6, selected: 2}                                                                                                                     | object                                          |
| labelAlign        | Text-align value of label                                                                                                                                                                                                                                                                                           | string                                          | 'left'     |
| labelPosition     | Location of label in Field, optional 'top', 'left', 'inset' <br/> (inset label only partial component support)                                                                                                                                                                                                      | string                                          | 'top'      |
| labelWidth        | Width of field'r label                                                                                                                                                                                                                                                                                              | string\|number                                  |            |
| onChange          | Callback invoked when form update, including Fields mount/unmount / value change / <br/> blur / validation status change / error status change.                                                                                                                                                                     | function (formState: object)                    |            |
| onValueChange     | Callback invoked when form values update                                                                                                                                                                                                                                                                            | function (values: object, changedValue: object) |
| onReset           | Callback invoked after clicked on reset button or executed `formApi.reset()`                                                                                                                                                                                                                                        | function ()                                     |            |
| onSubmit          | Callback invoked after clicked on submit button or executed `formApi.submit()`, <br/>and all validation pass.                                                                                                                                                                                                        | function (values: object)                       |            |
| onSubmitFail      | Callback invoked after clicked on submit button or executed `formApi.submit()`,<br/> but validate failed.                                                                                                                                                                                                            | function (object, values: object)               |            |
| render            | For declaring fields, not used at the same time as component, props.children                                                                                                                                                                                                                                        | function                                        |
| showValidateIcon  | Whether the verification information block in the field automatically adds the corresponding status icon display <br/>**since v1.0.0**                                                                                                                                                                              | boolean                                         | true       |
| validateFields    | Form-level custom validate functions are called at submit or formApi.validate(). <br/>Supported synchronous / asynchronous function                                                                                                                                                                                 | function (values)                               |            |
| wrapperCol        | Uniformly apply the layout on each Field, with [Col component](/en-US/basic/grid#Col), <br/>set `span`, `span` values, such as {span: 20, selected: 4}                                                                                                                                     | object                                          |

## FormState

FormState stores all the state values within the Form, including the values of each field, error information, touched status

| Name    | Instructions                                                                                                                     | Initial value | Example                       |
| ------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------- | ----------------------------- |
| values  | Value Collection of the form                                                                                                     | {}            | {fieldA: 'str', fieldB: true} |
| errors  | Form error information collection, you can decide whether to allow users to submit by judging whether there is error information | {}            | {fieldA: 'length not valid'}  |
| touched | The collection of fields the user has clicked on                                                                                 | {}            | {fieldA: true}                |

### How to access the form state

-   By calling `formApi.getFormState()`
-   By declaring fields through "child render function", formState will injected as a parameter
-   By declaring fields through "render props", formState will injected as a parameter
-   Via [useFormState](#useFormState) hook
-   Via withFormState HOC

## FormApi

We provide FormApi. You have easy access to FormApi both inside and outside the Form, which allows you to use getter and setter to get and manipulate the values of FormState.  
The table below describes the features available in the formApi.

| Function      | Description                                                                                                                                                                                                                                                                                                                        | example                                                                                                                       |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| getFormState  | Get FormState                                                                                                                                                                                                                                                                                                                      | formApi.getFormState()                                                                                                        |
| submitForm    | manually submit the submit operation                                                                                                                                                                                                                                                                                               | formApi.submitForm()                                                                                                          |
| reset         | reset the form manually                                                                                                                                                                                                                                                                                                            | formApi.reset()                                                                                                               |
| validate      | Manually trigger validation of the entire form                                                                                                                                                                                                                                                                                     | formApi.validate() <br/>.then(values ​​=> {})<br/>.catch(errors => {})                                                        |
| setValues ​​  | Set the values ​​of the entire form. The isOverride in the second parameter is false by default. <br/> By default, only the values ​​of the existing field in the Form are updated from `newValues` to`formState.values`. <br/> When isOverride is `true`, the newValues ​​will be overwritten and assigned to formState.values ​​ | formApi.setValues(newValues: object, {isOverride: boolean})                                                                   |
| getValues ​​  | Get the values of all Field                                                                                                                                                                                                                                                                                                        | formApi.getValues()                                                                                                           |
| setValue      | provides direct modification of formState.values ​​method.<br/>The difference from `setValues` ​​is that it only modifies a single field.                                                                                                                                                                                          | formApi.setValue(field: string, newFieldValue: any)                                                                           |
| getValue      | Get the value of all / single Field                                                                                                                                                                                                                                                                                                | formApi.getValue()<br/>formApi.getValue(field: string)                                                                         |
| setTouched    | modify formState.touched                                                                                                                                                                                                                                                                                                           | formApi.setTouched(field: string, isTouched: boolean)<br/>                                                                    |
| getTouched    | Get the touched state of the Field                                                                                                                                                                                                                                                                                                 | formApi.getTouched(field: string)                                                                                             |
| setError      | Modify the error information of a field                                                                                                                                                                                                                                                                                            | formApi.setError(field: string, fieldErrorMessage: string)                                                                    |
| getError      | Get Error Status of Field                                                                                                                                                                                                                                                                                                          | formApi.getError(field: string)                                                                                               |
| getFieldExist | Get whether the field exists in the Form                                                                                                                                                                                                                                                                                           | formApi.getFieldExist(field: string)                                                                                          |
| scrollToField | Scroll to field                                                                                                                                                                                                                                                                                                                    | formApi.scrollToField(field: string, scrollOpts: [object](<(https://github.com/stipsan/scroll-into-view-if-needed#options)>)) |

### How to access formApi

-   The Form component in the ComponentDidMount phase will execute the getFormApi callback passed in by props. You can save a reference to formApi in the callback function for subsequent calls (example code below)
    In addition, we provide other ways to get formApi, and you can choose different ways of calling according to your preference.
-   Use reference to get form instance，you can access form instance & its formApi
-   By declaring fields through "child render function", formApi will injected as a parameter
-   By declaring fields through "render props", formApi will injected as a parameter
-   Via [useFormApi](#useFormApi) hook
-   Via "withFormApi" HOC

```jsx
import React from 'react';
import { Form, Button } from '@douyinfe/semi-ui';

class FormApiDemo extends React.Component {
    constructor() {
        super();
        this.getFormApi = this.getFormApi.bind(this);
        this.formBRef = React.createRef();
    }
    getFormApi(formApi) {
        this.formApi = formApi;
        // After getting the formApi object, you can use it to make any changes you want to the form
    }

    changeValues() {
        // use formApi to update formA
        this.formApi.setValues({ a: 1});
        // use formApi to update formB
        this.formBRef.current.formApi.setValues({ b: 2});
    }

    render() {
        return (
            <>
                <Form getFormApi={this.getFormApi} />
                <Form ref={this.formBRef} />
                <Button onClick={()=>this.changeValues()}>Change</Button>
            </>
        );
    }
}
```

```jsx
import React from 'react';
import { Form, Button } from '@douyinfe/semi-ui';

() => {
    // functional compoentn usage
    const api = useRef();

    return (
        <>
            <Form getFormApi={formApi => api.current = formApi}>
                <Form.Input field='a' />
                <Button onClick={()=>{console.log(api);}}>log</Button>
            </Form>
        </>
    );
};
```
## Field Props

<Notice type="primary" title="About Field ref">
    Versions before v1.30.0, the Field component will not do ref forwarding<br/>
    After v1.30, the underlying component instance can be obtained directly through ref, such as specifying ref to Form.Input and Form.Select, and directly obtaining the ref reference of the underlying original Input and Select components
</Notice>

| Properties            | Description                                                                                                                                                                                                                              | Type                                   | Default   | Examples                                                           |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- | --------- | ------------------------------------------------------------------ |
| field                 | The mapping path of the field's value in formState.values. Form will use this value to distinguish the internal form control. <br/> **Required!!!**                                                                                      | string                                 |           |                            |
| label                 | The label text for this field. When not passed, it defaults to the same name as field                                                                                                                                                    | string                                 |           |
| labelPosition         | Label position of this field, optional 'top' / 'left' / 'inset'                                                                                                                                                                          | string                                 |           |
| labelAlign            | Text-align of the label text of this field                                                                                                                                                                                               | string                                 |           |
| labelWidth            | The width of the label text of this field                                                                                                                                                                                                | string\|number                         |           |
| noLabel               | When you don't need to add label automatically, you can set this value to true                                                                                                                                                           | boolean                                |           |
| name                  | Field name. When passed in, the corresponding className will be automatically added to the corresponding field div, such as: money => '.semi-form-field-money'                                                                           | string                                 |           |
| fieldClassName        | The className of the entire fieldWrapper is the same as the name parameter, except that the prefix is ​​not automatically appended                                                                                                       | string                                 |           |
| fieldStyle            | The inline style of the entire fieldWrapper <br/>**since v1.9.0**                                                                                                      | object                                 |           |
| initValue             | The initial value of the field (consumed only once when Field mounted, subsequent updates are invalid), it has higher priority than the values ​​in Form's initValues ​​                                                                 | any(type depends on current component) |           |
| validate              | The custom validation function for this form control. Supports synchronous and asynchronous verification. <br/> Rules does not take effect when validate is set                                                                           | function(fieldValue, values)           |           | (fieldValue) => fieldValue.length>5? 'error balabala': ''          |
| rules                 | validation rules, validation library based on [async-validator](https://github.com/yiminghe/async-validator)                                                                                                                             | array                                  |           | const rules = \[{type:' string ', message:' invalidate string'} \] |
| validateStatus        | The validation result status of this form control, optional: `success` / `error` / `warning` / `default`                                                                                                                                 | string                                 | 'default' |
| trigger               | The timing of triggering the verification, optional: `blur` / `change` / `custom` / `mount` <br/> 1. When set to custom, only formApi will trigger the verification <br/> 2。mount (triggered once when mounting)                          | string                                 | 'change'  |
| onChange              | Callback invoked when this field value changes                                                                                                                                                                                           |
| transform             | transform field values before validation                                                                                                                                                                                                 | function(fieldValue)                   |           | (value) => Number(value)                                           |
| allowEmptyString      | Whether to allow values to be empty strings. <br/>When the value is '' by default, the key corresponding to this field will be removed from `values`. <br/>If you want to keep the key, you need to set allowEmptyString to true           | boolean                                |           | false                                                              |
| convert               | After the field value changes, before rerender, update the value of filed                                                                                                                                                                | function(fieldValue)                   |           | (value) => newValue(value)                                         |
| stopValidateWithError | When it is true, the rules check is used. After encountering the first rule that fails the check, it will no longer trigger the check of subsequent rules<br/>**since v0.35.0**                                                          | boolean                                |           | false                                                              |
| helpText              | Custom prompt information, which is displayed in the same block as the verification information. When both have values, the verification information is displayed first<br/>**since v1.0.0**                                             | ReactNode                              |           |                                                                    |
| extraText             | Additional prompt information, you can use this when both error information and prompt copy are required, after helpText/errorMessage<br/>**since v1.0.0**                                                                               | ReactNode                              |           |                                                                    |
| pure                  | Whether to only take over the data stream, when true, it will not automatically insert modules such as ErrorMessage, Label, extraText, etc. The style and DOM structure are consistent with the original components<br/>**since v1.1.0** | boolean                                | false     |                                                                    |
| extraTextPosition     | controls the display position of extraText. Middle (the vertical direction is displayed in the order of Label, extraText, and Field), bottom (the vertical direction is displayed in the order of Label, Field, and extraText) <br/>**since v1.9.0** | string                                | 'bottom'     |                                                                    |
| ...other              | The other configurable properties of the component can be passed in together with the above properties, such as the size / placeholder of Input，**Field passes it to the component itself**                                             |

## Field Api

We also provide `fieldApi`, most of which is similar to `formApi`, with the difference that fieldApi limits the scope of modification, and it can only modify the bound field

| Function   | Instructions                                      | example                                    |
| ---------- | ------------------------------------------------- | ------------------------------------------ |
| setValue   | Modify the value of the current Field             | fieldApi.setValue(newValue: any)           |
| getValue   | Gets the value of the current Field               | fieldApi.getValue()                        |
| setTouched | Modify the value of the current Field             | fieldApi.setTouched(true)                  |
| getTouched | Get Field's status                                | fieldApi.getTouched()                      |
| setError   | Modify the error information of the current Field | fieldApi.setError(newErrorMessage: string) |
| getError   | Gets field's error status                         | fieldApi.getError()                        |

## Form.Section

> Form.Section is available since v1.0.0

```jsx
import { Form } from '@douyinfe/semi-ui';
const { Section } = Form;
```

| Properties | Instructions       | Type      |
| ---------- | ------------------ | --------- |
| text       | Title of section   | ReactNode |
| className  | Classname          | string    |
| style      | Inline style       | object    |
| children   | Content of section | ReactNode |

## Form.Label

By default, `Label` is self-inserted into each `Field` by `Form`.  
If you need to self-insert Label elsewhere, we have provided the `Label` component for you.

```jsx
import { Form } from '@douyinfe/semi-ui';
const { Label } = Form;
```

| Properties | Instructions                    | Type      | Default |
| ---------- | ------------------------------- | --------- | ------- |
| text       | Label content                   | ReactNode |         |
| required   | Whether to show the required \* | boolean   | false   |
| extra      | Content after required          | ReactNode |         |
| align      | Text-align                      | string    | 'left'  |
| className  | Classname of label wrapper      | string    |         |
| style      | Inline style                    | string    |         |
| width      | Label width                     | number    |         |
| optional  | Whether to automatically append the "(optional)" text mark after the text (automatically switch the same semantic text according to different languages configured by Locale). When this item is true, the required \* will no longer be displayed.  | boolean    | false | v2.18.0 |

## Form.Slot

```jsx
import { Form } from '@douyinfe/semi-ui';
const { Slot } = Form;
```

| Properties | Instructions                                                                                                                                                                                            | Type           | Default |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- | ------- |
| label      | Slot's [Label configuration](#Form.Label), for example {text: 'semi', align: 'left'}; can also be passed directly into string, inside the Slot will be automatically encapsulated in legal Label format | object\|string |         |
| className  | Classname of Slot Wrapper                                                                                                                                                                              | string         |         |
| style      | Slot inline style                                                                                                                                                                                       | object         |         |
| children   | Content of slot. You can place your custom component here                                                                                                                                               | ReactNode      |         |

## Form.ErrorMessage

```jsx
import { Form } from '@douyinfe/semi-ui';
const { ErrorMessage } = Form;
```

-   When the error is React Node, String, boolean, render directly
-   When the error is an array, the join operation is automatically performed to aggregate the error information in the array

| Properties | Instructions                      | Type                     | Default |
| ---------- | --------------------------------- | ------------------------ | ------- |
| error      | Error message content             | string\|array\|ReactNode\|undefined\|boolean | {}      |
| className  | Classname of ErrorMessage wrapper | string                   |         |
| style      | Inline style                      | object                   |         |

## withFieldOption

| key               | Description                                                                                                                                                                                                                                                                                                                                                                 | Default    |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| valueKey          | The component represents the property of the value, such as Switch, Radio is' checked 'and Input is' value '                                                                                                                                                                                                                                                                | 'value'    |
| onKeyChangeFnName | The callback function when the component value changes, generally 'onChange'                                                                                                                                                                                                                                                                                                | 'onChange' |
| valuePath         | The path of the value attribute to the first parameter in the callback function, such as Radio's onChange (e.target. checked), then the value needs to be set to target .checked; Radio Group's onChange (e.target. value), which is' target .value '; if the first parameter is the value itself, there is no need to take the value down, the item does not need to be set |            |
| withCursor        | Do you need to maintain a cursor for Input class components                                                                                                                                                                                                                                                                                                                 | false      |

## Accessibility

### ARIA

- [aria-labelledby](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-labelledby)、for
  - Field component will automatically add label DOM. The for attribute of label is the same as `props.id` or `props.name` or `props.field`; the `id` attribute of label is determined by `props.id` or `props.name` or `props.field`, and the value format is `${props.field}-label`;
  - When the props.labelPosition of the Form or Field is set to `inset`, there is no label tag at this time, but a div tag. The div tag corresponding to insetLabel will be automatically appended with `id`, the value is the same as the id of the above label, corresponding to the `aria-labelledby` of the Field component
  - The Field component will be automatically appended with `aria-labelledby`, the value is the same as the id of the above label
- [aria-required](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-required_attribute)
  - When the Field is configured with required fields (that is, props.rules contains require: true or props.label is configured with required: true), the Field component will be automatically appended with `aria-required = true` (except Form.Switch, Form.CheckboxGroup)
- [aria-invalid](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-invalid_attribute) 、[aria-errormessage](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-errormessage) 
  - When the Field check fails, the Field component will be automatically added with the `aria-invalid` = true attribute, except for Form.CheckboxGroup.
  - When the Field check fails, the Field component will be automatically appended with the `aria-errormessage` attribute, the value of which is the id of the DOM element corresponding to the errorMessage (format like: `${props.field}-errormessage`), except for Form.CheckboxGroup.
- [aria-describedby](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-describedby_attribute)
  - When the Field is configured with `helpText` or `extraText`, the Field component will be automatically added with the `aria-describedby` attribute, whose value is the id of the DOM element corresponding to helpText and extraText (format like: `${props.field}-helpText` , `${props.field}-extraText`)

## Design Tokens

<DesignToken/>

## FAQ

-   **Why did I declare the form, modify the value, and the data is not automatically mapped to formState.values?**  
    Check that the field has been passed correctly, and the `field` attribute on the Field component is a must-fill property !

-   **Why doesn't the passed `defaultValue` or `defaultChecked` take effect?**  
    Refer to the beginning of the document [Field](#Field). The Form.Field component unifies the default value. You should pass the default value using `initValue` or `initValues`

-   **Why did the component not change and the value not take effect after `initValue` and `initValues` were updated asynchronously?**  
    `initValue`, `initValues` are only consumed once when Field and Form mount, and subsequent asynchronous updates will not take effect.  
    If your initial value needs to be taken remotely, you can update it using `formApi.setValue / setValues` after you get the value  
    Or send a new `key` directly to Form or Field to force it to remount.

-   **Why can't getValues get a certain field?**

    If the field has no initial value, `getValues` cannot get this item. You can set `initValues`/`initValue` or set the `allowEmpty` attribute to the form.

-   **Why does hitting enter on the input box trigger the form's submit?**

    This is standard HTML behavior. We do not plan to intervene and we will remain the same as the HTML. If there is really only one input element in the form, and you don't want to trigger the submit callback when you press Enter, it is recommended to use preventDefault for the enter of the keydown event of input to prevent the default behavior.

    Click <a href="https://github.com/DouyinFE/semi-design/issues/767" target="_blank">#767</a> for background and content.

-   **[🔍 🧾 More FAQ](https://bytedance.feishu.cn/docs/doccnNKaGhZMqyu0FufD1JGHOjf)**