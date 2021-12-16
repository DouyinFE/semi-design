/* eslint-disable one-var */
/* eslint-disable react/prefer-stateless-function, max-len */
import * as React from 'react';
import { Subtract } from 'utility-types';
import type { RuleItem } from 'async-validator';
import { Options as scrollIntoViewOptions } from 'scroll-into-view-if-needed';

import { BaseFormApi as FormApi, FormState, WithFieldOption } from '@douyinfe/semi-foundation/form/interface';
import { SelectProps } from '../select/index';
import Option from '../select/option';
import OptGroup from '../select/optionGroup';
import { CheckboxProps } from '../checkbox/index';
import { RadioProps } from '../radio/index';

import { ErrorMessageProps, ReactFieldError as FieldError } from './errorMessage';
import { LabelProps } from './label';

export { FormState, FormApi, WithFieldOption };

export type CommonFieldProps = {
    /** Field is required (except Form. Checkbox within the Group, Form. Radio) */
    field: string;
    /** The label text of the form control is the same name as the field by default when it is not passed */
    label?: string | LabelProps | React.ReactNode | number;
    labelPosition?: 'top' | 'left' | 'inset';
    labelAlign?: 'left' | 'right';
    labelWidth?: number | string;
    noLabel?: boolean;
    noErrorMessage?: boolean;
    name?: string;
    fieldClassName?: string;
    fieldStyle?: React.CSSProperties;
    initValue?: any;
    validate?: (fieldValue: any, values: Record<string, any>) => string | Promise<string>;
    /** Check rules, check library based on async-validator */
    rules?: Array<RuleItem>;
    /** Check trigger timing */
    trigger?: 'blur' | 'change' | 'custom' | 'mount' | Array<string>;
    // onChange: (fieldValue: any) => void;
    /** Converts form control values before validation */
    transform?: (fieldValue: any) => any;
    /** Make a second change to the component's value before the UI update */
    convert?: (fieldValue: any) => any;
    allowEmptyString?: boolean;
    /** When true, use rules verification, after encountering the first rule that fails the test, the verification of subsequent rules will no longer be triggered */
    stopValidateWithError?: boolean;
    /* Custom prompt information is displayed in the same block as the verification information. When both have values, the verification information is displayed first */
    helpText?: React.ReactNode;
    /* Extra message, you can use this when you need an error message and the prompt text to appear at the same time, after helpText/errorMessage */
    extraText?: React.ReactNode;
    extraTextPosition?: 'middle' | 'bottom';
    /** These declaration just hack for Subtract, not valid props in CommonFieldProps */
    defaultValue?: any;
    /** Whether to take over only the data stream, when true, it will not automatically insert modules such as ErrorMessage, Label, extraText, etc. The style and DOM structure are consistent with the original component */
    pure?: boolean;
};

export type CommonexcludeType = {
    defaultValue?: any;
    value?: any;
    checked?: boolean;
    defaultChecked?: boolean;
};

export type RadioCheckboxExcludeProps = {
    defaultValue?: any;
    chekced?: boolean;
    defaultChecked?: boolean;
    field: string;
};

export type RCIncludeType = {
    // Need to take into account the use of Form. Checkbox, Form. Radio and Group scenarios
    field?: string;
};

export class FormSelect extends React.Component<Subtract<SelectProps & CommonFieldProps, CommonexcludeType>> {
    static Option: typeof Option;
    static OptGroup: typeof OptGroup;
}

export interface SelectStatic {
    Option: typeof Option;
    OptGroup: typeof OptGroup;
}

export class Field<P> extends React.Component<Subtract<P & CommonFieldProps, CommonexcludeType>> {}
export let FormSelectType: React.ComponentType<Subtract<SelectProps & CommonFieldProps, CommonexcludeType>> & SelectStatic;
export let FormCheckboxType: React.ComponentType<Subtract<CommonFieldProps, RadioCheckboxExcludeProps> & CheckboxProps & RCIncludeType>;
export let FormRadioType: React.ComponentType<Subtract<CommonFieldProps, RadioCheckboxExcludeProps> & RadioProps & RCIncludeType>;

export interface ErrorMsg {
    [optionalKey: string]: FieldError;
}
export interface FormFCChild<K extends Record<string, any> = any> {
    formState: FormState<K>;
    values: K;
    formApi: FormApi<K>;
}

interface setValuesConfig {
    isOverride: boolean;
}

export interface BaseFormProps {
    onSubmit?: (values: Record<string, any>) => void;
    onSubmitFail?: (errors: Record<string, FieldError>, values: any) => void;
    onReset?: () => void;
    onValueChange?: (values: Record<string, any>, changedValue: Record<string, any>) => void;
    onChange?: (formState: FormState) => void;
    validateFields?: (values: Record<string, any>) => string | Record<string, any>;
    /** Use this if you want to populate the form with initial values. */
    initValues?: Record<string, any>;
    /** getFormApi will be call once when Form mounted, u can save formApi reference in your component  */
    getFormApi?: (formApi: FormApi) => void;
    style?: React.CSSProperties;
    className?: string;
    layout?: 'horizontal' | 'vertical';
    labelPosition?: 'top' | 'left' | 'inset';
    labelWidth?: number | string;
    labelAlign?: 'left' | 'right';
    labelCol?: Record<string, any>;
    wrapperCol?: Record<string, any>;
    allowEmpty?: boolean;
    render?: (internalProps: FormFCChild) => React.ReactNode;
    component?: React.FC<any> | React.ComponentClass<any>;
    children?: React.ReactNode | ((internalProps: FormFCChild) => React.ReactNode);
    autoScrollToError?: boolean | scrollIntoViewOptions;
    disabled?: boolean;
    showValidateIcon?: boolean;
    extraTextPosition?: 'middle' | 'bottom';
}