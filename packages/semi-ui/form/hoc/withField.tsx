/* eslint-disable max-lines-per-function, react-hooks/rules-of-hooks, prefer-const, max-len */
import React, { useState, useLayoutEffect, useMemo, useRef, forwardRef } from 'react';
import classNames from 'classnames';
import { cssClasses } from '@douyinfe/semi-foundation/form/constants';
import { isValid, generateValidatesFromRules, mergeOptions, mergeProps, getDisplayName } from '@douyinfe/semi-foundation/form/utils';
import * as ObjectUtil from '@douyinfe/semi-foundation/utils/object';
import isPromise from '@douyinfe/semi-foundation/utils/isPromise';
import warning from '@douyinfe/semi-foundation/utils/warning';

import { useFormState, useStateWithGetter, useFormUpdater, useArrayFieldState } from '../hooks/index';
import ErrorMessage from '../errorMessage';
import { isElement } from '../../_base/reactUtils';
import Label from '../label';
import { Col } from '../../grid';
import { CallOpts, WithFieldOption } from '@douyinfe/semi-foundation/form/interface';
import { CommonFieldProps, CommonexcludeType } from '../interface';
import { Subtract } from 'utility-types';

const prefix = cssClasses.PREFIX;

/**
 * withFiled is used to inject components
 * 1. Takes over the value and onChange of the component and synchronizes them to Form Foundation
 * 2. Insert <Label>
 * 3. Insert <ErrorMessage>
 */

function withField<
    C extends React.ElementType,
    T extends Subtract<React.ComponentProps<C>, CommonexcludeType> & CommonFieldProps,
    R extends React.ComponentType<T>
>(Component: C, opts?: WithFieldOption): R {
    let SemiField = (props: any, ref: React.MutableRefObject<any> | ((instance: any) => void)) => {
        let {
            // condition,
            field,
            label,
            labelPosition,
            labelWidth,
            labelAlign,
            labelCol,
            wrapperCol,
            noLabel,
            noErrorMessage,
            isInInputGroup,
            initValue,
            validate,
            validateStatus,
            trigger,
            allowEmptyString,
            allowEmpty,
            emptyValue,
            rules,
            required,
            keepState,
            transform,
            name,
            fieldClassName,
            fieldStyle,
            convert,
            stopValidateWithError,
            helpText,
            extraText,
            extraTextPosition,
            pure,
            rest,
        } = mergeProps(props);
        let { options, shouldInject } = mergeOptions(opts, props);

        warning(
            typeof field === 'undefined' && options.shouldInject,
            "[Semi Form]: 'field' is required, please check your props of Field Component"
        );

        // 无需注入的直接返回，eg：Group内的checkbox、radio
        // Return without injection, eg: <Checkbox> / <Radio> inside CheckboxGroup/RadioGroup
        if (!shouldInject) {
            return <Component {...rest} ref={ref} />;
        }

        // grab formState from context
        const formState = useFormState();

        // grab formUpdater (the api for field to read/modify FormState) from context
        const updater = useFormUpdater();

        if (!updater.getFormProps) {
            warning(
                true,
                '[Semi Form]: Field Component must be use inside the Form, please check your dom declaration'
            );
            return null;
        }

        // To prevent user forgetting to pass the field, use undefined as the key, and updater.getValue will get the wrong value.
        let initValueInFormOpts = typeof field !== 'undefined' ? updater.getValue(field) : undefined; // Get the init value of form from formP rops.init Values Get the initial value set in the initValues of Form
        let initVal = typeof initValue !== 'undefined' ? initValue : initValueInFormOpts;

        // use arrayFieldState to fix issue 615
        let arrayFieldState;
        try {
            arrayFieldState = useArrayFieldState();
            if (arrayFieldState) {
                initVal =
                    arrayFieldState.shouldUseInitValue && typeof initValue !== 'undefined'
                        ? initValue
                        : initValueInFormOpts;
            }
        } catch (err) {}

        const [value, setValue, getVal] = useStateWithGetter(typeof initVal !== undefined ? initVal : null);
        const validateOnMount = trigger.includes('mount');

        allowEmpty = allowEmpty || updater.getFormProps().allowEmpty;

        // Error information: Array, String, undefined
        const [error, setError, getError] = useStateWithGetter();
        const [touched, setTouched] = useState<boolean | undefined>();
        const [cursor, setCursor, getCursor] = useStateWithGetter(0);
        const [status, setStatus] = useState(validateStatus); // use props.validateStatus to init

        const rulesRef = useRef(rules);

        // notNotify is true means that the onChange of the Form does not need to be triggered
        // notUpdate is true means that this operation does not need to trigger the forceUpdate
        const updateTouched = (isTouched: boolean, callOpts?: CallOpts) => {
            setTouched(isTouched);
            updater.updateStateTouched(field, isTouched, callOpts);
        };

        const updateError = (errors: any, callOpts?: CallOpts) => {
            if (errors === getError()) {
                // When the inspection result is unchanged, no need to update, saving a forceUpdate overhead
                // When errors is an array, deepEqual is not used, and it is always treated as a need to update
                // 检验结果不变时，无需更新，节省一次forceUpdate开销
                // errors为数组时，不做deepEqual，始终当做需要更新处理
                return;
            }
            setError(errors);
            updater.updateStateError(field, errors, callOpts);
            if (!isValid(errors)) {
                setStatus('error');
            } else {
                setStatus('success');
            }
        };

        const updateValue = (val: any, callOpts?: CallOpts) => {
            setValue(val);
            let newOpts = {
                ...callOpts,
                allowEmpty,
            };
            updater.updateStateValue(field, val, newOpts);
        };

        const reset = () => {
            let callOpts = {
                notNotify: true,
                notUpdate: true,
            };
            // reset is called by the FormFoundaion uniformly. The field level does not need to trigger notify and update.
            updateValue(initVal !== null ? initVal : undefined, callOpts);
            updateError(undefined, callOpts);
            updateTouched(undefined, callOpts);
            setStatus('default');
        };

        // Execute the validation rules specified by rules
        const _validateInternal = (val: any, callOpts: CallOpts) => {
            let latestRules = rulesRef.current || [];
            const validator = generateValidatesFromRules(field, latestRules);
            const model = {
                [field]: val,
            };

            return new Promise((resolve, reject) => {
                validator
                    .validate(
                        model,
                        {
                            first: stopValidateWithError,
                        },
                        // eslint-disable-next-line @typescript-eslint/no-empty-function
                        (errors, fields) => {}
                    )
                    .then(res => {
                        // validation passed
                        setStatus('success');
                        updateError(undefined, callOpts);
                        resolve({});
                    })
                    .catch(err => {
                        let { errors, fields } = err;
                        if (errors && fields) {
                            let messages = errors.map((e: any) => e.message);
                            if (messages.length === 1) {
                                // eslint-disable-next-line prefer-destructuring
                                messages = messages[0];
                            }
                            updateError(messages, callOpts);
                            if (!isValid(messages)) {
                                setStatus('error');
                                resolve(errors);
                            }
                        } else {
                            // Some grammatical errors in rules
                            setStatus('error');
                            updateError(err.message, callOpts);
                            resolve(err.message);
                            throw err;
                        }
                    });
            });
        };

        // execute custom validate function
        const _validate = (val: any, values: any, callOpts: CallOpts) =>
            new Promise(resolve => {
                let maybePromisedErrors;
                // let errorThrowSync;
                try {
                    maybePromisedErrors = validate(val, values);
                } catch (err) {
                    // error throw by syncValidate
                    maybePromisedErrors = err;
                }
                if (maybePromisedErrors === undefined) {
                    resolve({});
                    updateError(undefined, callOpts);
                } else if (isPromise(maybePromisedErrors)) {
                    maybePromisedErrors.then((result: any) => {
                        if (isValid(result)) {
                            // validate success，no need to do anything with result
                            updateError(undefined, callOpts);
                            resolve(null);
                        } else {
                            // validate failed
                            updateError(result, callOpts);
                            resolve(result);
                        }
                    });
                } else {
                    if (isValid(maybePromisedErrors)) {
                        updateError(undefined, callOpts);
                        resolve(null);
                    } else {
                        updateError(maybePromisedErrors, callOpts);
                        resolve(maybePromisedErrors);
                    }
                }
            });

        const fieldValidate = (val: any, callOpts?: CallOpts) => {
            let finalVal = val;
            let latestRules = rulesRef.current;
            if (transform) {
                finalVal = transform(val);
            }
            if (validate) {
                return _validate(finalVal, updater.getValue(), callOpts);
            } else if (latestRules) {
                return _validateInternal(finalVal, callOpts);
            }
            return null;
        };

        /**
         * parse / format
         * validate when trigger
         *
         */
        const handleChange = (newValue: any, e: any, ...other: any[]) => {
            let fnKey = options.onKeyChangeFnName;
            if (fnKey in props && typeof props[options.onKeyChangeFnName] === 'function') {
                props[options.onKeyChangeFnName](newValue, e, ...other);
            }

            // support various type component
            let val;
            if (!options.valuePath) {
                val = newValue;
            } else {
                val = ObjectUtil.get(newValue, options.valuePath);
            }

            // User can use convert function to updateValue before Component UI render
            if (typeof convert === 'function') {
                val = convert(val);
            }

            // TODO: allowEmptyString split into allowEmpty, emptyValue
            // Added abandonment warning
            // if (process.env.NODE_ENV !== 'production') {
            //     warning(allowEmptyString, `'allowEmptyString' will be de deprecated in next version, please replace with 'allowEmpty' & 'emptyValue'
            // `)
            // }

            // set value to undefined if it's an empty string
            // allowEmptyString={true} is equivalent to allowEmpty = {true} emptyValue = "
            if (allowEmptyString || allowEmpty) {
                if (val === '') {
                    // do nothing
                }
            } else {
                if (val === emptyValue) {
                    val = undefined;
                }
            }

            // maintain compoent cursor if needed
            try {
                if (e && e.target && e.target.selectionStart) {
                    setCursor(e.target.selectionStart);
                }
            } catch (err) {}

            updateTouched(true, { notNotify: true, notUpdate: true });
            updateValue(val);
            // only validate when trigger includes change
            if (trigger.includes('change')) {
                fieldValidate(val);
            }
        };

        const handleBlur = (...e: any[]) => {
            if (props.onBlur) {
                props.onBlur(...e);
            }
            if (!touched) {
                updateTouched(true);
            }
            if (trigger.includes('blur')) {
                let val = getVal();
                fieldValidate(val);
            }
        };

        /** Field level maintains a separate layer of data, which is convenient for Form to control Field to update the UI */
        // The field level maintains a separate layer of data, which is convenient for the Form to control the Field for UI updates.
        const fieldApi = {
            setValue: updateValue,
            setTouched: updateTouched,
            setError: updateError,
            reset,
            validate: fieldValidate,
        };

        const fieldState = {
            value,
            error,
            touched,
            status,
        };

        // avoid hooks capture value, fixed issue 346
        useLayoutEffect(() => {
            rulesRef.current = rules;
        }, [rules]);

        // exec validate once when trigger inlcude 'mount'
        useLayoutEffect(() => {
            if (validateOnMount) {
                fieldValidate(value);
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        // register when mounted，unregister when unmounted
        // register again when field change
        useLayoutEffect(() => {
            // register
            if (typeof field === 'undefined') {
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                return () => {};
            }
            // log('register: ' + field);
            updater.register(field, fieldState, {
                field,
                fieldApi,
                keepState,
                allowEmpty: allowEmpty || allowEmptyString,
            });
            // return unRegister cb
            return () => {
                updater.unRegister(field);
                // log('unRegister: ' + field);
            };
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [field]);

        let formProps = updater.getFormProps([
            'labelPosition',
            'labelWidth',
            'labelAlign',
            'labelCol',
            'wrapperCol',
            'disabled',
            'showValidateIcon',
            'extraTextPosition',
        ]);
        let mergeLabelPos = labelPosition || formProps.labelPosition;
        let mergeLabelWidth = labelWidth || formProps.labelWidth;
        let mergeLabelAlign = labelAlign || formProps.labelAlign;
        let mergeLabelCol = labelCol || formProps.labelCol;
        let mergeWrapperCol = wrapperCol || formProps.wrapperCol;
        let mergeExtraPos = extraTextPosition || formProps.extraTextPosition || 'bottom';

        let FieldComponent = (() => {
            // prefer to use validateStatus which pass by user throught props
            let blockStatus = validateStatus ? validateStatus : status;

            let newProps: Record<string, any> = {
                disabled: formProps.disabled,
                ...rest,
                ref,
                onBlur: handleBlur,
                [options.onKeyChangeFnName]: handleChange,
                [options.valueKey]: value,
                validateStatus: blockStatus,
            };

            const fieldCls = classNames({
                [`${prefix}-field`]: true,
                [`${prefix}-field-${name}`]: Boolean(name),
                [fieldClassName]: Boolean(fieldClassName),
            });
            const fieldMaincls = classNames({
                [`${prefix}-field-main`]: true,
            });

            if (mergeLabelPos === 'inset' && !noLabel) {
                newProps.insetLabel = label || field;
                if (typeof label === 'object' && !isElement(label)) {
                    newProps.insetLabel = label.text;
                }
            }

            const com = <Component {...(newProps as any)} />;

            // when use in InputGroup, no need to insert <Label>、<ErrorMessage> inside Field, just add it at Group
            if (isInInputGroup) {
                return com;
            }

            if (pure) {
                let pureCls = classNames(rest.className, {
                    [`${prefix}-field-pure`]: true,
                    [`${prefix}-field-${name}`]: Boolean(name),
                    [fieldClassName]: Boolean(fieldClassName),
                });
                newProps.className = pureCls;
                return <Component {...(newProps as any)} />;
            }

            let withCol = mergeLabelCol && mergeWrapperCol;
            const labelColCls = mergeLabelAlign ? `${prefix}-col-${mergeLabelAlign}` : '';

            // get label
            let labelContent = null;
            if (!noLabel && mergeLabelPos !== 'inset') {
                let needSpread = typeof label === 'object' && !isElement(label) ? label : {};
                labelContent = (
                    <Label
                        text={label || field}
                        required={required}
                        name={name || field}
                        width={mergeLabelWidth}
                        align={mergeLabelAlign}
                        {...needSpread}
                    />
                );
            }

            const extraCls = classNames(`${prefix}-field-extra`, {
                [`${prefix}-field-extra-string`]: typeof extraText === 'string',
                [`${prefix}-field-extra-middle`]: mergeExtraPos === 'middle',
                [`${prefix}-field-extra-botttom`]: mergeExtraPos === 'bottom',
            });

            const extraContent = extraText ? <div className={extraCls}>{extraText}</div> : null;

            const fieldMainContent = (
                <div className={fieldMaincls}>
                    {mergeExtraPos === 'middle' ? extraContent : null}
                    {com}
                    {!noErrorMessage ? (
                        <ErrorMessage
                            error={error}
                            validateStatus={blockStatus}
                            helpText={helpText}
                            showValidateIcon={formProps.showValidateIcon}
                        />
                    ) : null}
                    {mergeExtraPos === 'bottom' ? extraContent : null}
                </div>
            );

            const withColContent = (
                <>
                    {mergeLabelPos === 'top' ? (
                        <div style={{ overflow: 'hidden' }}>
                            <Col {...mergeLabelCol} className={labelColCls}>
                                {labelContent}
                            </Col>
                        </div>
                    ) : (
                        <Col {...mergeLabelCol} className={labelColCls}>
                            {labelContent}
                        </Col>
                    )}
                    <Col {...mergeWrapperCol}>{fieldMainContent}</Col>
                </>
            );

            return (
                <div
                    className={fieldCls}
                    style={fieldStyle}
                    x-label-pos={mergeLabelPos}
                    x-field-id={field}
                    x-extra-pos={mergeExtraPos}
                >
                    {withCol ? (
                        withColContent
                    ) : (
                        <>
                            {labelContent}
                            {fieldMainContent}
                        </>
                    )}
                </div>
            );
        })();

        // !important optimization
        const shouldUpdate = [
            ...Object.values(fieldState),
            ...Object.values(props),
            field,
            mergeLabelPos,
            mergeLabelAlign,
            formProps.disabled,
        ];
        if (options.shouldMemo) {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            return useMemo(() => FieldComponent, [...shouldUpdate]);
        } else {
            // Some Custom Component with inner state shouldn't be memo, otherwise the component will not updated when the internal state is updated
            return FieldComponent;
        }
    };
    SemiField = forwardRef(SemiField);
    (SemiField as React.SFC).displayName = getDisplayName(Component);
    return SemiField as any;
}

// eslint-disable-next-line
export default withField;
