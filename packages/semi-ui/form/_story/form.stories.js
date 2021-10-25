import React, { useState, useLayoutEffect, useEffect, useRef } from 'react';
import { storiesOf } from '@storybook/react';
import { Button, Modal, TreeSelect, Row, Col, Avatar, Tabs, TabPane, Badge, Notification } from '../../index';
import {
    Form,
    useFormState,
    useFormApi,
    useFieldApi,
    useFieldState,
    withFormState,
    withFormApi,
    withField,
    ArrayField,
    Icon,
} from '../../index';
import { BasicDemoWithInit, LinkFieldForm, I18nDemo, DifferentDeclareUsage } from './demo';
const { Input, Select, DatePicker, Switch, Slider, CheckboxGroup, Checkbox, RadioGroup, Radio, TimePicker } = Form;

import {
    UseFormApiDemo,
    UseFormStateDemo,
    UseFieldApiDemo,
    UseFieldStateDemo,
    WithFormStateDemo,
    WithFormApiDemo,
    ComponentUsingFormState,
    CustomStringify,
} from './Hook/hookDemo';

// layout
import { LayoutDemo, InsetLabelDemo, GroupFormDemo } from './Layout/layoutDemo';
import { AssistComponent } from './Layout/slotDemo';
import { ModalFormDemo } from './Layout/modalFormDemo';

import { WithFieldDemo, CustomFieldDemo, NumberRange } from './HOC/withFieldDemo';
import { WithDisplayName } from './HOC/displayName';
import { CustomValidateDemo, ValidateFieldsDemo, PartValidAndResetDemo, RulesValidateDemo, SetBugDemo, UnmountedLeafDemo, RulesExample } from './Validate/validateDemo';

// field props
import { ConvertDemo } from './FieldProps/convert';
import { HelpAndExtra, ExtraPositionDemo } from './FieldProps/helpAndExtra';
import { BigNumberFieldDemo } from './FieldProps/bigNumberFieldPath';
import { UpdateDemo, RuleupdateDemo } from './FieldProps/rulesUpdateDemo';
import { FieldRefDemo } from './FieldProps/fieldRef';

// arrayField
import {
    ArrayFieldCollapseDemo,
    ArrayFieldDemo,
    ArrayFieldWithFormInitValues,
    ArrayFieldWithInitValue,
} from './DynamicField/arrayFieldDemo';
import { NestArrayField } from './DynamicField/nestArrayField';
import { ArrayDemo } from './FormApi/arrayDemo';

// performance
import { ManyFieldDemo, EffectDemo, ModalFormSelectWithObject } from './Performance/performanceDemo';
import { SetValuesDemo, SetValuesWithArrayField } from './FormApi/setValuesDemo';
import { SetValueUsingParentPath } from './FormApi/formApiDemo';
import { FieldPathWithArrayDemo } from './Debug/bugDemo';
import ChildDidMount from './Debug/childDidMount';

const stories = storiesOf('Form', module);
const Option = Select.Option;

stories.add('Form declare usage', () => <DifferentDeclareUsage />);
stories.add('BasicDemo', () => <BasicDemoWithInit />);

stories.add('Layout-Form.InputGroup', () => <GroupFormDemo />);
stories.add('Layout-Form wrapperCol/labelCol', () => <LayoutDemo />);
stories.add('Layout-insetLabel', () => <InsetLabelDemo />);
stories.add('Layout-Slot/ErrorMessage/Label', () => <AssistComponent />);
stories.add('Layout- ModalDemo', () => <ModalFormDemo />);

stories.add('formApi-setValues(override)', () => <SetValuesDemo />);
stories.add('formApi-validate', () => <PartValidAndResetDemo />);
stories.add('formApi-setValue using field parent path', () => <SetValueUsingParentPath />);

stories.add('Dynamic Add / Remove Field', () => (
    <Form>
        {({ formState }) => (
            <React.Fragment>
                <Input field="name" label="First name:" />
                <RadioGroup field="married" label="Are you married?">
                    <Radio value="yes">yes</Radio>
                    <Radio value="no">no</Radio>
                </RadioGroup>
                {formState.values.married === 'yes' ? <Input field="spouse" label="Spouse name:" /> : null}
                <Button htmlType="submit">Submit</Button>
                <ComponentUsingFormState />
            </React.Fragment>
        )}
    </Form>
));

stories.add('ArrayField-basic usage', () => <ArrayFieldDemo />);
stories.add('ArrayField-with form initValues', () => <ArrayFieldWithFormInitValues />);
stories.add('ArrayField-with arrayField initValue', () => <ArrayFieldWithInitValue />);
stories.add('ArrayField-Nest Usage', () => <NestArrayField />);
stories.add('ArrayField-CollapseDemo', () => <ArrayFieldCollapseDemo />);

stories.add('【数组】动态增删表单项-使用FormState、FormApi手动处理', () => <ArrayDemo />);

stories.add('LinkField', () => <LinkFieldForm />);
stories.add('Validate-FormLevel', () => <ValidateFieldsDemo />);
stories.add('Validate-FieldValel', () => <CustomValidateDemo />);
stories.add('Validate-use rules', () => <RulesValidateDemo />);

stories.add('Hooks-useFormApi', () => <UseFormApiDemo />);
stories.add('Hooks-useFormState', () => <UseFormStateDemo />);
stories.add('Hooks-useFieldApi', () => <UseFieldApiDemo />);
stories.add('Hooks-useFieldState', () => <UseFieldStateDemo />);

stories.add('Hoc-withFormApi', () => <WithFormApiDemo />);
stories.add('Hoc-withFormState', () => <WithFormStateDemo />);

// stories.add('Hoc-withFieldApi', () => (<div></div>));
// stories.add('Hoc-withFieldState', () => (<div></div>));

stories.add('withField', () => <CustomFieldDemo />);
stories.add('withField- with stateful component', () => <WithFieldDemo />);
stories.add('withField - NumberRange', () => (
    <Form onChange={v => console.log(v)}>
        <NumberRange field="number" initValue={[1, 2]} noLabel={true}></NumberRange>
    </Form>
));

stories.add('Performance-ManyField', () => <ManyFieldDemo />);
stories.add('Performance-ModalFormSelectWithObject', () => <ModalFormSelectWithObject />);

stories.add('Filed Prop-convert', () => <ConvertDemo />);
stories.add('Filed Prop-helpText / extraText / extraTextPosition', () => (
    <>
        <HelpAndExtra />
        <ExtraPositionDemo />
        <GroupFormDemo />
    </>
));
stories.add('Field Props-dynamic update rules.required', () => <RuleupdateDemo />);
stories.add('Field Prop-initValue=""', () => <InitEmptyStringDemo />);
stories.add('Field prop-big number field submit', () => <BigNumberFieldDemo />);
stories.add('Field Prop-pure', () => (
    <Form>
        <Form.Select field="name" pure className="fefefe" fieldClassName="feichang" style={{ width: 400 }} />
    </Form>
));
stories.add('Field Prop-ref', () => <FieldRefDemo />);

const InitEmptyStringDemo = () => {
    return (
        <Form allowEmpty>
            <Form.Input field="name" initValue="" />
            <ComponentUsingFormState />
        </Form>
    );
};


stories.add('Debug-SetBugDemo', () => (
    <>
        <SetBugDemo />
        <UnmountedLeafDemo />
    </>
));

stories.add('Debug-SetValuesWithArrayField', () => (
    <>
        <SetValuesWithArrayField />
    </>
));

import { SetValuesArray, DoubleRerender } from './Debug/bugDemo';

stories.add('Debug-数组类fieldPath', () => <FieldPathWithArrayDemo />);

stories.add('Debug-SetValuesDemo', () => (
    <>
        <SetValuesArray />
    </>
));

// useFormState与rules使用时，会rerender两次
stories.add('Debug-RerenderTwice', () => (
    <>
        <DoubleRerender />
    </>
));

stories.add('Field displayName', () => <WithDisplayName attr="form" />);

class ReUseDemo extends React.Component {
    constructor() {
        super();
        this.getFormApi = this.getFormApi.bind(this);
        this.suppressRankOptions = [
          { label: '不打压', value: 0 },
          { label: 'top10以下', value: 10 },
          { label: 'top30以下', value: 30 },
        ];
        this.citySuppressRankOptions = [
          { label: '不打压', value: 0 },
          { label: 'top3以下', value: 3 },
          { label: 'top5以下', value: 5 },
          { label: 'top10以下', value: 10 },
        ];
    }

    getFormApi(formApi) { this.formApi = formApi; }

    render() {
        return (
            <Form getFormApi={this.getFormApi} initValues={{ listType: 'online', attr: { suppress_rank: 0, city_suppress_rank: 5 }}} onValueChange={values => console.log(values) } style={{ width: 250 }}>
                {({ formState }) => (<>
                <Form.Select
                    field="listType"
                    label="榜单类型"
                    disabled={this.ifUseOld}
                    style={{ width: '100%' }}
                    // onChange={val => this.onChangeListType(val)}
                  >
                    <Option value="online" >
                      热点榜
                    </Option>
                    <Option value="riseHot" >
                      上升热点榜
                    </Option>
                    <Option value="sameCity" >
                      同城热点榜
                    </Option>
                  </Form.Select>
                {formState.values.listType !== 'sameCity' ? (
                    <Form.Select
                      label="竞品打压类型"
                      field="attr.suppress_rank"
                      optionList={this.suppressRankOptions}
                    />
                ) : (
                    <Form.Select
                      label="同城竞品打压"
                      field="attr.city_suppress_rank"
                      optionList={this.citySuppressRankOptions}
                    />
                )}
                </>)}
            </Form>
        );
    }
}
stories.add('same field switch cause reuse', () => <ReUseDemo />);

stories.add('child didmount', () => <ChildDidMount />);

