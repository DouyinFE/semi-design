/* eslint-disable */
import React, { useState, useLayoutEffect, Component } from 'react';
import { storiesOf } from '@storybook/react';
import { Button, Modal, TreeSelect, Row, Col, Avatar, Select as BasicSelect,
    Form,
    useFormState,
    useFormApi,
    useFieldApi,
    useFieldState,
    withFormState,
    withFormApi,
    withField,
    ArrayField,
    AutoComplete,
    Collapse,
    Space,
    Icon } from '../../../index';


import { ComponentUsingFormState } from '../Hook/hookDemo';
const { Input, Select, DatePicker, Switch, Slider, CheckboxGroup, Checkbox, RadioGroup, Radio, TimePicker, InputNumber, InputGroup } = Form;

class ArrayFieldCollapseDemo extends React.Component {
    constructor() {
        super();
        this.state = {
            actions: [],
        };
    }

    renderItems(arrayFields, values) {
        console.log(values);
        return (
            <Collapse keepDOM>
                {JSON.stringify(values)}
                {arrayFields.map(({ field, key, remove }, i) => (
                    <Collapse.Panel header="触发条件" itemKey={i.toString()} key={key}>
                        <Form.Input
                            field={`${field}[name]`}
                            label={`特效类型：（${field}.name）`}
                            style={{ width: 200, marginRight: 16 }}
                        />
                        <Button type="danger" onClick={remove} style={{ margin: 16 }}>
                            remove
                        </Button>
                    </Collapse.Panel>
                ))}
                {/* {arrayFields.length && values.actions[0].name ? '2' : '1'} */}
            </Collapse>
        );
    }

    render() {
        let { actions } = this.state;

        return (
            <Form style={{ width: 500 }} labelPosition="left" labelWidth="220px" allowEmpty>
                {({ values }) => (
                    <ArrayField field="actions" initValue={actions}>
                        {({ add, arrayFields }) => (
                            <React.Fragment>
                                <Button onClick={add}>Add</Button>
                                {this.renderItems(arrayFields, values)}
                            </React.Fragment>
                        )}
                    </ArrayField>
                )}
            </Form>
        );
    }
}

// 使用Form Props设置 ArrayField的initValues
class ArrayFieldWithFormInitValues extends React.Component {
    constructor() {
        super();
        this.state = {
            data: {
                c: 'c',
                effects: [
                    { name: 'form-level-init-sugar', time: 'form-level-init-3min', otherKey: 1 },
                    { name: 'form-level-init-bacon', time: 'form-level-init-6min', otherKey: 2, key: 343 },
                ],
            },
            flag: true
        };
        this.getFormApi = this.getFormApi.bind(this);
        this.change = this.change.bind(this);
    }

    change = () => {
        let number = this.formApi.getValue('number');
        let newData = Array.from({ length: number }, (v, i) => ({
            name: `${i}-name`,
            time: `${i}-time`
        }));
        console.log(newData);
        this.formApi.setValue('effects', newData);
    }

    getFormApi(formApi) {
        this.formApi = formApi;
    }

    render() {
        return (
            <Form
                onChange={(...v) => console.log('onchange:' + v)}
                onValueChange={(...v) => console.log('onValueChange:' + v)}
                getFormApi={this.getFormApi}
                initValues={this.state.data}
            >
                {/* <Button onClick={this.setValues}>setValues</Button> */}
                <Row>
                    <Col span={12}>
                        <ArrayField field="effects">
                            {({ add, arrayFields }) => (
                                <React.Fragment>
                                    <Button onClick={add} type="primary">Add</Button>
                                    {
                                        arrayFields.map(({ field, key, remove }, i) => (
                                            <div key={key}>
                                                <Input
                                                    field={`${field}[name]`}
                                                    label={`${field}.name`}
                                                    // initValue="field-level-init-2D"
                                                />
                                                <Input
                                                    field={`${field}[time]`}
                                                    label={`${field}.time`}
                                                />
                                                <Button type="danger" onClick={remove}>remove</Button>
                                            </div>
                                        ))
                                    }
                                </React.Fragment>
                            )}
                        </ArrayField>
                        <Button htmlType="submit">submit</Button>
                        <Button htmlType='reset'>Reset</Button>
                        <Form.InputNumber field="number" label="期望个数" />
                        <Button onClick={this.change}>改变</Button>
                    </Col>
                    <Col span={12}>
                        <ComponentUsingFormState />
                    </Col>
                </Row>
            </Form>
        );
    }
}


// 使用 ArrayField props initValue来设置初始值
class ArrayFieldWithInitValue extends React.Component {
    constructor() {
        super();
        this.state = {
            data: {
                effects: [
                    { name: 'arrayField-props.initValue-0-name', time: 'arrayField-props.initValue-0-time', otherKey: 1 },
                    { name: 'arrayField-props.initValue-1-name', time: 'arrayField-props.initValue-1-time', otherKey: 453 },
                ],
            },
            flag: true
        };
        this.getFormApi = this.getFormApi.bind(this);
        this.change = this.change.bind(this);
    }

    componentDidMount() {
        this.formApi.setValues({
            effects: [
                { name: "脸部贴纸", type: "2D" },
                { name: "前景贴纸", type: "3D" },
            ],
            test: 'fff'
        })
    }

    change = () => {
        let number = this.formApi.getValue('number');
        let newData = Array.from({ length: 2 }, (v, i) => ({
            name: `${i}-name`,
            time: `${i}-time`
        }));
        console.log(newData);
        this.formApi.setValue('effects', newData);
    }

    getFormApi(formApi) {
        this.formApi = formApi;
    }

    render() {
        const { effects }  = this.state.data;
        return (
            <Form
                onChange={(...v) => console.log('onchange:' + v)}
                onValueChange={(...v) => console.log('onValueChange:' + v)}
                getFormApi={this.getFormApi}
            >
                {/* <Button onClick={this.setValues}>setValues</Button> */}
                <Row>
                    <Col span={12}>
                        <ArrayField field="effects">
                            {({ add, arrayFields }) => (
                                <React.Fragment>
                                    <Button onClick={add} type="primary">Add</Button>
                                    {
                                        arrayFields.map(({ field, key, remove }, i) => (
                                            <div key={key}>
                                                <Input
                                                    field={`${field}[name]`}
                                                    label={`${field}.name`}
                                                    // initValue="field-level-init-2D"
                                                />
                                                <Input
                                                    field={`${field}[time]`}
                                                    label={`${field}.time`}
                                                />
                                                <Button type="danger" onClick={remove}>remove</Button>
                                            </div>
                                        ))
                                    }
                                </React.Fragment>
                            )}
                        </ArrayField>
                        <Button htmlType="submit">submit</Button>
                        <Button htmlType='reset'>Reset</Button>
                        {/* <Form.InputNumber field="number" label="期望个数" /> */}
                        {/* <Button onClick={this.change}>改变</Button> */}
                    </Col>
                    <Col span={12}>
                        <ComponentUsingFormState />
                    </Col>
                </Row>
            </Form>
        );
    }
}

/* basic usage */
class ArrayFieldDemo extends React.Component {
    constructor() {
        super();
        this.state = {
            data: {
                c: 'c',
                test: [
                    // {},
                    // {},
                    { name: 'sugar', time: '3min' },
                    // { name: 'bacon', time: '6min', key: 'c2' },
                    { name: 'bacon', time: '6min' },
                ],
            },
            flag: true
        };
        this.getFormApi = this.getFormApi.bind(this);
    }

    change = () => {
        let number = this.formApi.getValue('number');
        let newData = Array.from({ length: number }, (v, i) => ({
            name: `${i}-name`,
            time: `${i}-time`
        }));
        this.formApi.setValue('effects', newData);
    }

    clear = () => {
        // this.formApi.setValues({ number: 3 });
        // this.formApi.setValues({}, { isOverride: true });
        this.formApi.setValues({ number: 3 }, { isOverride: true });
    }

    getFormApi(formApi) {
        this.formApi = formApi;
    }

    render() {
        return (
            <Form
                // onChange={(...v) => console.log(v)}
                onValueChange={(...v) => console.log(v)}
                getFormApi={this.getFormApi}>
                <Row>
                    <Col span={12}>
                        <ArrayField field="effects" initValue={this.state.data.test}>
                            {({ add, arrayFields }) => (
                                <React.Fragment>
                                    <Button onClick={add} type="primary">Add</Button>
                                    <Button onClick={this.clear} type="primary">Clear by setValues empty Object</Button>
                                    {
                                        arrayFields.map(({ field, key, remove }, i) => (
                                            <div key={key}>
                                                <Input
                                                    field={`${field}[name]`}
                                                    label={`${field}.name`}
                                                    // initValue='test'
                                                />
                                                <Input
                                                    field={`${field}[time]`}
                                                    label={`${field}.time`}
                                                />
                                                <Button type="danger" onClick={remove}>remove</Button>
                                            </div>
                                        ))
                                    }
                                </React.Fragment>
                            )}
                        </ArrayField>
                        <Form.InputNumber field="number" label="期望个数" />
                        <Space>
                            <Button onClick={this.change}>改变</Button>
                            <Button htmlType="submit">submit</Button>
                            <Button htmlType='reset'>Reset</Button>
                        </Space>
                    </Col>
                    <Col span={12}>
                        <ComponentUsingFormState />
                    </Col>
                </Row>
            </Form>
        );
    }
}


class ArrayFieldSetValues extends React.Component {
    constructor() {
        super();
        this.state = {
            data: {
            },
        };
        this.getFormApi = this.getFormApi.bind(this);
    }

    componentDidMount() {
        debugger
        this.formApi.setValues({
            effects: [
                { name: "脸部贴纸", type: "2D" },
                { name: "前景贴纸", type: "3D" },
            ],
            test: 'fff'
        })
    }

    getFormApi(formApi) {
        this.formApi = formApi;
    }

    render() {
        return (
            <Form
                // onChange={(...v) => console.log(v)}
                onValueChange={(...v) => console.log(v)}
                getFormApi={this.getFormApi}>
                <Row>
                    <Col span={12}>
                        <ArrayField field="effects">
                            {({ add, arrayFields }) => (
                                <React.Fragment>
                                    <Button onClick={add} type="primary">Add</Button>
                                    {
                                        arrayFields.map(({ field, key, remove }, i) => (
                                            <div key={key}>
                                                <Input
                                                    field={`${field}[name]`}
                                                    label={`${field}.name`}
                                                    // initValue='test'
                                                />
                                                <Input
                                                    field={`${field}[time]`}
                                                    label={`${field}.time`}
                                                />
                                                <Button type="danger" onClick={remove}>remove</Button>
                                            </div>
                                        ))
                                    }
                                </React.Fragment>
                            )}
                        </ArrayField>
                        <Form.Input field="test" label="Test" />
                        <Space>
                            <Button htmlType='reset'>Reset</Button>
                        </Space>
                    </Col>
                    <Col span={12}>
                        <ComponentUsingFormState />
                    </Col>
                </Row>
            </Form>
        );
    }
}

/* index insert usage */
class ArrayFieldIndexedInsertDemo extends React.Component {
    constructor() {
        super();
        this.state = {
            data: {
                tasks: [{ name: '第一个任务' }, { name: '第二个任务' }, { name: '第三个任务' }],
            },
            lastAddedKey: null,
        };
        this.getFormApi = this.getFormApi.bind(this);
    }

    getFormApi(formApi) {
        this.formApi = formApi;
    }

    render() {
        return (
            <Form
                onValueChange={(...v) => console.log('Indexed Insert Demo Value Change:', v)}
                getFormApi={this.getFormApi}
                initValues={this.state.data}
            >
                <ArrayField field="tasks">
                    {({ add, arrayFields }) => (
                        <React.Fragment>
                            <Space>
                                <Button
                                    onClick={() => {
                                        const newKey = add();
                                        this.setState({ lastAddedKey: newKey });
                                    }}
                                    type="primary"
                                >
                                    默认添加到末尾
                                </Button>
                                <Button
                                    onClick={() => {
                                        const newKey = add(1);
                                        this.setState({ lastAddedKey: newKey });
                                    }}
                                    type="primary"
                                >
                                    添加到第一个位置后
                                </Button>
                                <Button
                                    onClick={() => {
                                        const newKey = add(2);
                                        this.setState({ lastAddedKey: newKey });
                                    }}
                                    type="primary"
                                >
                                    添加到第二个位置后
                                </Button>
                                <Button
                                    onClick={() => {
                                        const newKey = add(arrayFields.length - 1);
                                        this.setState({ lastAddedKey: newKey });
                                    }}
                                    type="primary"
                                >
                                    添加到倒数第二个位置
                                </Button>
                            </Space>
                            {arrayFields.map(({ field, key, remove }, index) => (
                                <div
                                    key={key}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        marginBottom: '8px',
                                        padding: '8px',
                                        backgroundColor: index % 2 === 0 ? '#f0f0f0' : 'white',
                                        border: key === this.state.lastAddedKey ? '2px solid #4CAF50' : 'none',
                                        transition: 'all 0.3s ease',
                                        transform: key === this.state.lastAddedKey ? 'scale(1.02)' : 'scale(1)',
                                        boxShadow:
                                            key === this.state.lastAddedKey ? '0 4px 6px rgba(0,0,0,0.1)' : 'none',
                                    }}
                                >
                                    <div
                                        style={{
                                            marginRight: '16px',
                                            fontWeight: key === this.state.lastAddedKey ? 'bold' : 'normal',
                                            color: key === this.state.lastAddedKey ? '#4CAF50' : 'inherit',
                                        }}
                                    >
                                        索引: {index}
                                    </div>
                                    <Input
                                        field={`${field}[name]`}
                                        label="任务名称"
                                        initValue=""
                                        placeholder="请输入任务名称"
                                        style={{
                                            width: 200,
                                            marginRight: 16,
                                            borderColor: key === this.state.lastAddedKey ? '#4CAF50' : undefined,
                                        }}
                                    />
                                    <Button type="danger" onClick={remove}>
                                        删除
                                    </Button>
                                </div>
                            ))}
                        </React.Fragment>
                    )}
                </ArrayField>
                <ComponentUsingFormState />
            </Form>
        );
    }
}

export { ArrayFieldCollapseDemo, ArrayFieldDemo, ArrayFieldWithFormInitValues, ArrayFieldWithInitValue, ArrayFieldSetValues,ArrayFieldIndexedInsertDemo };