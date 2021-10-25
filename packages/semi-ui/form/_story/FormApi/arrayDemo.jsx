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
    Icon } from '../../../index';

import { ComponentUsingFormState } from '../Hook/hookDemo';
const { Input, Select, DatePicker, Switch, Slider, CheckboxGroup, Checkbox, RadioGroup, Radio, TimePicker, InputNumber, InputGroup } = Form;

class ArrayDemo extends React.Component {
    constructor() {
        super();
        this.state = {
            initValues: {
                effects: [
                    { name: '脸部贴纸', type: '2D', key: 0 },
                    { name: '美妆', type: '2D', key: 1 },
                    { name: '前景贴纸', type: '3D', key: 2 },
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
        effects.push({ name: '', type: '', key: this.id++ });
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
                <Form.Input field={`effects[${i}].name`} style={{ width: 200, marginRight: 16 }} />
                <Form.Select field={`effects[${i}].type`} style={{ width: 90 }}>
                    <Form.Select.Option value="2D">2D</Form.Select.Option>
                    <Form.Select.Option value="3D">3D</Form.Select.Option>
                </Form.Select>
                <Button type="danger" onClick={() => this.remove(effect.key)} style={{ margin: 16 }}>Remove</Button>
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
                labelPosition="left"
                labelWidth="180px"
            >
                {({ formState, values }) => (
                    <>
                        <Button onClick={this.add}>add</Button>
                        {this.renderItems(formState, values)}
                        <div>
                            {JSON.stringify(formState)}
                        </div>
                    </>
                )}
            </Form>
        );
    }
}




export { ArrayDemo };