/* eslint-disable prefer-template, max-len, @typescript-eslint/no-unused-vars */
import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import FormFoundation, { BaseFormAdapter } from '@douyinfe/semi-foundation/form/foundation';
import { strings, cssClasses } from '@douyinfe/semi-foundation/form/constants';
import { getUuidv4 } from '@douyinfe/semi-foundation/utils/uuid';
import warning from '@douyinfe/semi-foundation/utils/warning';
import BaseComponent from '../_base/baseComponent';
import { FormStateContext, FormApiContext, FormUpdaterContext } from './context';
import { isEmptyChildren } from '../_base/reactUtils';
import Row from '../grid/row';
import { cloneDeep } from '../_utils/index';
import Slot from './slot';
import Section from './section';
import Label from './label';
import ErrorMessage from './errorMessage';
import FormInputGroup from './group';
import { noop } from 'lodash';
import '@douyinfe/semi-foundation/form/form.scss';
import {
    FormInput,
    FormInputNumber,
    FormTextArea,
    FormSelect,
    FormCheckboxGroup,
    FormCheckbox,
    FormRadioGroup,
    FormRadio,
    FormDatePicker,
    FormSwitch,
    FormSlider,
    FormTimePicker,
    FormTreeSelect,
    FormCascader,
    FormRating,
    FormAutoComplete,
    FormUpload,
    FormTagInput } from './field';
import {
    BaseFormProps,
    FormState,
    FormApi,
    ErrorMsg
} from './interface';
const prefix = cssClasses.PREFIX;

interface BaseFormState {
    formId: string;
}
class Form extends BaseComponent<BaseFormProps, BaseFormState> {
    static propTypes = {
        'aria-label': PropTypes.string,
        onSubmit: PropTypes.func,
        onSubmitFail: PropTypes.func,
        /* Triggered from update, including field mount/unmount/value change/blur/verification status change/error prompt change, input parameter is formState, currentField */
        onChange: PropTypes.func,
        onReset: PropTypes.func,
        // Triggered when the value of the form is updated, only when the value of the subfield changes. The entry parameter is formState.values
        onValueChange: PropTypes.func,
        initValues: PropTypes.object,
        getFormApi: PropTypes.func,
        component: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
        render: PropTypes.func,
        validateFields: PropTypes.func,
        style: PropTypes.object,
        className: PropTypes.string,
        layout: PropTypes.oneOf(strings.LAYOUT),
        labelPosition: PropTypes.oneOf(strings.LABEL_POS),
        labelWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        labelAlign: PropTypes.oneOf(strings.LABEL_ALIGN),
        labelCol: PropTypes.object, // Control labelCol {span: number, offset: number} for all field child nodes
        wrapperCol: PropTypes.object, // Control wrapperCol {span: number, offset: number} for all field child nodes
        allowEmpty: PropTypes.bool,
        autoScrollToError: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
        disabled: PropTypes.bool,
        showValidateIcon: PropTypes.bool,
        extraTextPosition: PropTypes.oneOf(strings.EXTRA_POS),
        id: PropTypes.string,
    };

    static defaultProps = {
        onChange: noop,
        onSubmitFail: noop,
        onSubmit: noop,
        onReset: noop,
        onValueChange: noop,
        layout: 'vertical',
        labelPosition: 'top',
        allowEmpty: false,
        autoScrollToError: false,
        showValidateIcon: true,
    };

    static Input = FormInput;
    static TextArea = FormTextArea;
    static InputNumber = FormInputNumber;
    static Select = FormSelect;
    static Checkbox = FormCheckbox;
    static CheckboxGroup = FormCheckboxGroup;
    static Radio = FormRadio;
    static RadioGroup = FormRadioGroup;
    static DatePicker = FormDatePicker;
    static TimePicker = FormTimePicker;
    static Switch = FormSwitch;
    static Slider = FormSlider;
    static TreeSelect = FormTreeSelect;
    static Cascader = FormCascader;
    static Rating = FormRating;
    static AutoComplete = FormAutoComplete;
    static Upload = FormUpload;
    static TagInput = FormTagInput;

    static Slot = Slot;
    static ErrorMessage = ErrorMessage;
    static InputGroup = FormInputGroup;
    static Label = Label;
    static Section = Section;

    formApi: FormApi;

    constructor(props: BaseFormProps) {
        super(props);
        this.state = {
            formId: '',
        };
        warning(
            Boolean(props.component && props.render),
            '[Semi Form] You should not use <Form component> and <Form render> in ths same time; <Form render> will be ignored'
        );
        warning(
            props.component && props.children && !isEmptyChildren(props.children),
            '[Semi Form] You should not use <Form component> and <Form>{children}</Form> in ths same time; <Form>{children}</Form> will be ignored'
        );
        warning(
            props.render && props.children && !isEmptyChildren(props.children),
            '[Semi Form] You should not use <Form render> and <Form>{children}</Form> in ths same time; <Form>{children}</Form> will be ignored'
        );
        this.submit = this.submit.bind(this);
        this.reset = this.reset.bind(this);
        this.foundation = new FormFoundation(this.adapter);
        this.formApi = this.foundation.getFormApi();
        if (this.props.getFormApi) {
            this.props.getFormApi(this.formApi);
        }
    }

    componentDidMount() {
        this.foundation.init();
    }

    componentWillUnmount() {
        this.foundation.destroy();
        this.formApi = null;
    }

    get adapter(): BaseFormAdapter<BaseFormProps, BaseFormState> {
        return {
            ...super.adapter,
            cloneDeep,
            notifySubmit: (values: any) => {
                this.props.onSubmit(values);
            },
            notifySubmitFail: (errors: ErrorMsg, values: any) => {
                this.props.onSubmitFail(errors, values);
            },
            forceUpdate: (callback?: () => void) => {
                this.forceUpdate(callback);
            },
            notifyChange: (formState: FormState) => {
                this.props.onChange(formState);
            },
            notifyValueChange: (values: any, changedValues: any) => {
                this.props.onValueChange(values, changedValues);
            },
            notifyReset: () => {
                this.props.onReset();
            },
            initFormId: () => {
                this.setState({
                    formId: getUuidv4()
                });
            },
            getInitValues: () => this.props.initValues,
            getFormProps: (keys: undefined | string | Array<string>) => {
                if (typeof keys === 'undefined') {
                    return this.props;
                } else if (typeof keys === 'string') {
                    return this.props[keys];
                } else {
                    const props = {};
                    keys.forEach(key => {
                        props[key] = this.props[key];
                    });
                    return props;
                }
            },
            getAllErrorDOM: () => {
                const { formId } = this.state;
                return document.querySelectorAll(
                    `form[x-form-id="${formId}"] .${cssClasses.PREFIX}-field-error-message`
                );
            },
            getFieldDOM: (field: string) =>
                document.querySelector(`.${cssClasses.PREFIX}-field[x-field-id="${field}"]`),
        };
    }

    get content() {
        const { children, component, render } = this.props;
        const formState = this.foundation.getFormState();
        const props = {
            formState,
            formApi: this.foundation.getFormApi(),
            values: formState.values,
        };
        if (component) {
            return React.createElement(component, props);
        }
        if (render) {
            return render(props);
        }
        if (typeof children === 'function') {
            return children(props);
        }
        return children;
    }

    submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        this.foundation.submit();
    }

    reset(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        this.foundation.reset();
    }

    render() {
        const needClone = false;
        const formState = this.foundation.getFormState(needClone);
        const updaterApi = this.foundation.getModifyFormStateApi();
        const { formId } = this.state;
        const {
            children,
            getFormApi,
            onChange,
            onSubmit,
            onSubmitFail,
            onValueChange,
            component,
            render,
            validateFields,
            initValues,
            layout,
            style,
            className,
            labelPosition,
            labelWidth,
            labelAlign,
            labelCol,
            wrapperCol,
            allowEmpty,
            autoScrollToError,
            showValidateIcon,
            extraTextPosition,
            ...rest
        } = this.props;

        const formCls = classNames(prefix, className, {
            [prefix + '-vertical']: layout === 'vertical',
            [prefix + '-horizontal']: layout === 'horizontal',
        });
        const showldAppendRow = wrapperCol && labelCol;

        const formContent = (
            <form
                style={style}
                {...rest}
                onReset={this.reset}
                onSubmit={this.submit}
                className={formCls}
                x-form-id={formId}
            >
                {this.content}
            </form>
        );
        const withRowForm = <Row>{formContent}</Row>;
        return (
            <FormUpdaterContext.Provider value={updaterApi}>
                <FormApiContext.Provider value={this.formApi}>
                    <FormStateContext.Provider value={formState}>
                        {showldAppendRow ? withRowForm : formContent}
                    </FormStateContext.Provider>
                </FormApiContext.Provider>
            </FormUpdaterContext.Provider>
        );
    }
}

export default Form;
