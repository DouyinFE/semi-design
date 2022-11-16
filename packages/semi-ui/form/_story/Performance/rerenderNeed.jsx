import React, { useState, useLayoutEffect, Component } from 'react';
import { Button, Modal, TreeSelect, Row, Col, Avatar, Toast, Select as BasicSelect,
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
import { cloneDeepWith, cloneDeep } from 'lodash';
import { ComponentUsingFormState } from '../Hook/hookDemo';
const { Input, Select, DatePicker, Switch, Slider, CheckboxGroup, Checkbox, RadioGroup, Radio, TimePicker, InputNumber, InputGroup } = Form;

const Option = Select.Option;

const RerenderOnDemand = () => {
    const [disabled, setDisabled] = useState(false);
    return (
        <Form disabled={disabled}>
            <Input style={{ width: 400 }} field='a'></Input>
            <Select style={{ width: 400 }} field='b' optionList={[{ value: 1, label: 1 }, { label: 2, value: 2 }]}></Select>
            {/* <Input field='c'></Input> */}
            <Button onClick={()=> setDisabled(!disabled)}>
                click
            </Button>
        </Form>
    );
};

export { RerenderOnDemand };

