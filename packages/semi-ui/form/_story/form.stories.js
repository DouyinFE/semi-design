import React, { useState, useLayoutEffect, useEffect, useRef } from 'react';
import {
  Button,
  Modal,
  TreeSelect,
  Row,
  Col,
  Avatar,
  Tabs,
  TabPane,
  Badge,
  Notification,
} from '../../index';
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
const {
  Input,
  Select,
  DatePicker,
  Switch,
  Slider,
  CheckboxGroup,
  Checkbox,
  RadioGroup,
  Radio,
  TimePicker,
} = Form;

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
import {
  CustomValidateDemo,
  ValidateFieldsDemo,
  PartValidAndResetDemo,
  RulesValidateDemo,
  SetBugDemo,
  UnmountedLeafDemo,
  RulesExample,
} from './Validate/validateDemo';

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
import {
  ManyFieldDemo,
  EffectDemo,
  ModalFormSelectWithObject,
} from './Performance/performanceDemo';
import { SetValuesDemo, SetValuesWithArrayField } from './FormApi/setValuesDemo';
import { SetValueUsingParentPath } from './FormApi/formApiDemo';
import { FieldPathWithArrayDemo } from './Debug/bugDemo';
import ChildDidMount from './Debug/childDidMount';

export default {
  title: 'Form'
}

const Option = Select.Option;

export const FormDeclareUsage = () => <DifferentDeclareUsage />;

FormDeclareUsage.story = {
  name: 'Form declare usage',
};

export const BasicDemo = () => <BasicDemoWithInit />;

BasicDemo.story = {
  name: 'BasicDemo',
};

export const LayoutFormInputGroup = () => <GroupFormDemo />;

LayoutFormInputGroup.story = {
  name: 'Layout-Form.InputGroup',
};

export const LayoutFormWrapperColLabelCol = () => <LayoutDemo />;

LayoutFormWrapperColLabelCol.story = {
  name: 'Layout-Form wrapperCol/labelCol',
};

export const LayoutInsetLabel = () => <InsetLabelDemo />;

LayoutInsetLabel.story = {
  name: 'Layout-insetLabel',
};

export const LayoutSlotErrorMessageLabel = () => <AssistComponent />;

LayoutSlotErrorMessageLabel.story = {
  name: 'Layout-Slot/ErrorMessage/Label',
};

export const LayoutModalDemo = () => <ModalFormDemo />;

LayoutModalDemo.story = {
  name: 'Layout- ModalDemo',
};

export const FormApiSetValuesOverride = () => <SetValuesDemo />;

FormApiSetValuesOverride.story = {
  name: 'formApi-setValues(override)',
};

export const FormApiValidate = () => <PartValidAndResetDemo />;

FormApiValidate.story = {
  name: 'formApi-validate',
};

export const FormApiSetValueUsingFieldParentPath = () => <SetValueUsingParentPath />;

FormApiSetValueUsingFieldParentPath.story = {
  name: 'formApi-setValue using field parent path',
};

export const DynamicAddRemoveField = () => (
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
);

DynamicAddRemoveField.story = {
  name: 'Dynamic Add / Remove Field',
};

export const ArrayFieldBasicUsage = () => <ArrayFieldDemo />;

ArrayFieldBasicUsage.story = {
  name: 'ArrayField-basic usage',
};

export const _ArrayFieldWithFormInitValues = () => <ArrayFieldWithFormInitValues />;

_ArrayFieldWithFormInitValues.story = {
  name: 'ArrayField-with form initValues',
};

export const ArrayFieldWithArrayFieldInitValue = () => <ArrayFieldWithInitValue />;

ArrayFieldWithArrayFieldInitValue.story = {
  name: 'ArrayField-with arrayField initValue',
};

export const ArrayFieldNestUsage = () => <NestArrayField />;

ArrayFieldNestUsage.story = {
  name: 'ArrayField-Nest Usage',
};

export const _ArrayFieldCollapseDemo = () => <ArrayFieldCollapseDemo />;

_ArrayFieldCollapseDemo.story = {
  name: 'ArrayField-CollapseDemo',
};

export const ArrayFieldDynamicUpdate = () => <ArrayDemo />;

ArrayFieldDynamicUpdate.story = {
  name: 'ArrayField-dynamic update',
};

export const LinkField = () => <LinkFieldForm />;

LinkField.story = {
  name: 'LinkField',
};

export const ValidateFormLevel = () => <ValidateFieldsDemo />;

ValidateFormLevel.story = {
  name: 'Validate-FormLevel',
};

export const ValidateFieldValel = () => <CustomValidateDemo />;

ValidateFieldValel.story = {
  name: 'Validate-FieldValel',
};

export const ValidateUseRules = () => <RulesValidateDemo />;

ValidateUseRules.story = {
  name: 'Validate-use rules',
};

export const HooksUseFormApi = () => <UseFormApiDemo />;

HooksUseFormApi.story = {
  name: 'Hooks-useFormApi',
};

export const HooksUseFormState = () => <UseFormStateDemo />;

HooksUseFormState.story = {
  name: 'Hooks-useFormState',
};

export const HooksUseFieldApi = () => <UseFieldApiDemo />;

HooksUseFieldApi.story = {
  name: 'Hooks-useFieldApi',
};

export const HooksUseFieldState = () => <UseFieldStateDemo />;

HooksUseFieldState.story = {
  name: 'Hooks-useFieldState',
};

export const HocWithFormApi = () => <WithFormApiDemo />;

HocWithFormApi.story = {
  name: 'Hoc-withFormApi',
};

export const HocWithFormState = () => <WithFormStateDemo />;

HocWithFormState.story = {
  name: 'Hoc-withFormState',
};

export const WithField = () => <CustomFieldDemo />;

WithField.story = {
  name: 'withField',
};

export const WithFieldWithStatefulComponent = () => <WithFieldDemo />;

WithFieldWithStatefulComponent.story = {
  name: 'withField- with stateful component',
};

export const WithFieldNumberRange = () => (
  <Form onChange={v => console.log(v)}>
    <NumberRange field="number" initValue={[1, 2]} noLabel={true}></NumberRange>
  </Form>
);

WithFieldNumberRange.story = {
  name: 'withField - NumberRange',
};

export const PerformanceManyField = () => <ManyFieldDemo />;

PerformanceManyField.story = {
  name: 'Performance-ManyField',
};

export const PerformanceModalFormSelectWithObject = () => <ModalFormSelectWithObject />;

PerformanceModalFormSelectWithObject.story = {
  name: 'Performance-ModalFormSelectWithObject',
};

export const FiledPropConvert = () => <ConvertDemo />;

FiledPropConvert.story = {
  name: 'Filed Prop-convert',
};

export const FiledPropHelpTextExtraTextExtraTextPosition = () => (
  <>
    <HelpAndExtra />
    <ExtraPositionDemo />
    <GroupFormDemo />
  </>
);

FiledPropHelpTextExtraTextExtraTextPosition.story = {
  name: 'Filed Prop-helpText / extraText / extraTextPosition',
};

export const FieldPropsDynamicUpdateRulesRequired = () => <RuleupdateDemo />;

FieldPropsDynamicUpdateRulesRequired.story = {
  name: 'Field Props-dynamic update rules.required',
};

export const FieldPropInitValue = () => <InitEmptyStringDemo />;

FieldPropInitValue.story = {
  name: 'Field Prop-initValue=""',
};

export const FieldPropBigNumberFieldSubmit = () => <BigNumberFieldDemo />;

FieldPropBigNumberFieldSubmit.story = {
  name: 'Field prop-big number field submit',
};

export const FieldPropPure = () => (
  <Form>
    <Form.Select
      field="name"
      pure
      className="fefefe"
      fieldClassName="feichang"
      style={{ width: 400 }}
    />
  </Form>
);

FieldPropPure.story = {
  name: 'Field Prop-pure',
};

export const FieldPropRef = () => <FieldRefDemo />;

FieldPropRef.story = {
  name: 'Field Prop-ref',
};

const InitEmptyStringDemo = () => {
  return (
    <Form allowEmpty>
      <Form.Input field="name" initValue="" />
      <ComponentUsingFormState />
    </Form>
  );
};

export const DebugSetBugDemo = () => (
  <>
    <SetBugDemo />
    <UnmountedLeafDemo />
  </>
);

DebugSetBugDemo.story = {
  name: 'Debug-SetBugDemo',
};

export const DebugSetValuesWithArrayField = () => (
  <>
    <SetValuesWithArrayField />
  </>
);

DebugSetValuesWithArrayField.story = {
  name: 'Debug-SetValuesWithArrayField',
};

import { SetValuesArray, DoubleRerender } from './Debug/bugDemo';

export const DebugArrayFieldPath = () => <FieldPathWithArrayDemo />;

DebugArrayFieldPath.story = {
  name: 'Debug-数组类fieldPath',
};

export const DebugSetValuesDemo = () => (
  <>
    <SetValuesArray />
  </>
);

DebugSetValuesDemo.story = {
  name: 'Debug-SetValuesDemo',
};

export const DebugRerenderTwice = () => (
  <>
    <DoubleRerender />
  </>
);

DebugRerenderTwice.story = {
  name: 'Debug-RerenderTwice',
};

export const FieldDisplayName = () => <WithDisplayName attr="form" />;

FieldDisplayName.story = {
  name: 'Field displayName',
};

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

  getFormApi(formApi) {
    this.formApi = formApi;
  }

  render() {
    return (
      <Form
        getFormApi={this.getFormApi}
        initValues={{ listType: 'online', attr: { suppress_rank: 0, city_suppress_rank: 5 } }}
        onValueChange={values => console.log(values)}
        style={{ width: 250 }}
      >
        {({ formState }) => (
          <>
            <Form.Select
              field="listType"
              label="榜单类型"
              disabled={this.ifUseOld}
              style={{ width: '100%' }}
              // onChange={val => this.onChangeListType(val)}
            >
              <Option value="online">热点榜</Option>
              <Option value="riseHot">上升热点榜</Option>
              <Option value="sameCity">同城热点榜</Option>
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
          </>
        )}
      </Form>
    );
  }
}
export const SameFieldSwitchCauseReuse = () => <ReUseDemo />;

SameFieldSwitchCauseReuse.story = {
  name: 'same field switch cause reuse',
};

export const _ChildDidMount = () => <ChildDidMount />;

_ChildDidMount.story = {
  name: 'child did mount',
};
