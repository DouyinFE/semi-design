/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import classNames from 'classnames';
import { isString } from 'lodash';
import { isValid } from '@douyinfe/semi-foundation/form/utils';
import { cssClasses } from '@douyinfe/semi-foundation/form/constants';
import * as ObjectUtil from '@douyinfe/semi-foundation/utils/object';
import ErrorMessage, { ReactFieldError } from './errorMessage';
import Label, { LabelProps } from './label';
import { FormUpdaterContext } from './context';
import { useFormState } from './hooks/index';
import InputGroup, { InputGroupProps as BacisInputGroupProps } from '../input/inputGroup';
import { BaseFormProps, FormState } from './interface';

interface GroupErrorProps {
    showValidateIcon?: boolean;
    isInInputGroup?: boolean;
    error?: ReactFieldError;
    fieldSet?: string[];
}
export interface InputGroupProps extends BacisInputGroupProps {
    label?: LabelProps;
    labelPosition?: 'left' | 'top';
}

const prefix = cssClasses.PREFIX;

// Group component to remove Labels and ErrorMessages from its child fields
// Unified insertion of Labels and ErrorMessages from the group level

// Get Errors of all field in this group
const GroupError = (props: GroupErrorProps) => {
    const { fieldSet } = props;
    const formState: FormState = useFormState();
    const error = fieldSet.map((field: string) => ObjectUtil.get(formState.errors, field));

    if (isValid(error)) {
        return null;
    }
    return (
        <ErrorMessage error={error} showValidateIcon={props.showValidateIcon} isInInputGroup={props.isInInputGroup} />
    );
};

class FormInputGroup extends Component<InputGroupProps> {
    static contextType = FormUpdaterContext;
    renderLabel(label: LabelProps, formProps: BaseFormProps) {
        if (label) {
            if (isString(label)) {
                return (<Label width={formProps.labelWidth} text={label} />);
            } else {
                return (<Label width={formProps.labelWidth} {...label} />);
            }
        }
        return null;
    }

    render() {
        const { children, label, ...rest } = this.props;
        const updater = this.context;
        const formProps = updater.getFormProps(['labelPosition', 'labelWidth', 'labelAlign', 'showValidateIcon']);
        const labelPosition = this.props.labelPosition || formProps.labelPosition;
        const groupFieldSet: Array<string> = [];
        const inner = React.Children.map(children, (child: any) => {
            if (child && child.props && child.props.field) {
                groupFieldSet.push(child.props.field);
                return React.cloneElement(child, {
                    isInInputGroup: true,
                    // noErrorMessage: true,
                    // noLabel: true
                });
            }
            return null;
        });
        const groupCls = classNames({
            [`${prefix}-field-group`]: true
        });
        return (
            <div x-label-pos={labelPosition} className={groupCls}>
                {this.renderLabel(label, formProps)}
                <div>
                    <InputGroup {...rest}>
                        {inner}
                    </InputGroup>
                    <GroupError fieldSet={groupFieldSet} showValidateIcon={formProps.showValidateIcon} isInInputGroup />
                </div>
            </div>
        );
    }
}
export default FormInputGroup;