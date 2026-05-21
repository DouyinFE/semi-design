/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useLayoutEffect, useEffect, useMemo, useRef, forwardRef } from 'react';
import classNames from 'classnames';
import { cssClasses } from '@douyinfe/semi-foundation/form/constants';
import { isValid, generateValidatesFromRules, mergeOptions, mergeProps, getDisplayName, transformTrigger, transformDefaultBooleanAPI } from '@douyinfe/semi-foundation/form/utils';
import * as ObjectUtil from '@douyinfe/semi-foundation/utils/object';
import isPromise from '@douyinfe/semi-foundation/utils/isPromise';
import warning from '@douyinfe/semi-foundation/utils/warning';

import { useFormState, useStateWithGetter, useFormUpdater, useArrayFieldState } from '../hooks/index';
import ErrorMessage from '../errorMessage';
import { isElement } from '../../_base/reactUtils';
import Label from '../label';
import { Col } from '../../grid';
import type { CallOpts, WithFieldOption } from '@douyinfe/semi-foundation/form/interface';
import type { CommonFieldProps, CommonexcludeType } from '../interface';
import { noop } from "lodash";

function shallowEqualArray(a: any[] | undefined, b: any[] | undefined): boolean {
    if (a === b) {
        return true;
    }
    if (!a || !b || a.length !== b.length) {
        return false;
    }
    for (let i = 0; i < a.length; i++) {
        if (!Object.is(a[i], b[i])) {
            return false;
        }
    }
    return true;
}

/**
 * Keep a stable array reference when items are shallow-equal.
 *
 * Why do we need this?
 * - In this file we memoize the rendered Field subtree for performance.
 * - We need to make the `useMemo` dependency list have a CONSTANT length between renders.
 *   React will warn if the deps array size changes:
 *   "The final argument passed to useMemo changed size between renders"
 * - Some wrappers (Tooltip/Popover) inject event handlers into children via `cloneElement`.
 *   That can ADD/REMOVE props keys (e.g. onMouseEnter/onMouseLeave) and therefore change
 *   the length of something like `Object.values(props)`.
 *
 * So we represent `props` as two arrays (sorted keys + values in that key order), and then
 * stabilize those arrays by shallow-equality so we don't trigger memo recalculation when
 * nothing actually changed.
 */
function useShallowStableArray<T extends any[]>(next: T): T {
    const ref = useRef<T>(next);
    if (!shallowEqualArray(ref.current, next)) {
        ref.current = next;
    }
    return ref.current;
}

const prefix = cssClasses.PREFIX;

// To avoid useLayoutEffect warning when ssr, refer: https://gist.github.com/gaearon/e7d97cdf38a2907924ea12e4ebdf3c85
// Fix issue 1140
const useIsomorphicEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * withFiled is used to inject components
 * 1. Takes over the value and onChange of the component and synchronizes them to Form Foundation
 * 2. Insert <Label>
 * 3. Insert <ErrorMessage>
 */

function withField<
    C extends React.ElementType,
    T extends Omit<React.ComponentProps<C>, keyof CommonexcludeType> & CommonFieldProps & React.RefAttributes<any>,
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
            id,
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

        let formProps = updater.getFormProps([
            'labelPosition',
            'labelWidth',
            'labelAlign',
            'labelCol',
            'wrapperCol',
            'disabled',
            'showValidateIcon',
            'extraTextPosition',
            'stopValidateWithError',
            'trigger'
        ]);
        let mergeLabelPos = labelPosition || formProps.labelPosition;
        let mergeLabelWidth = labelWidth || formProps.labelWidth;
        let mergeLabelAlign = labelAlign || formProps.labelAlign;
        let mergeLabelCol = labelCol || formProps.labelCol;
        let mergeWrapperCol = wrapperCol || formProps.wrapperCol;
        let mergeExtraPos = extraTextPosition || formProps.extraTextPosition || 'bottom';
        let mergeStopValidateWithError = transformDefaultBooleanAPI(stopValidateWithError, formProps.stopValidateWithError, false);
        let mergeTrigger = transformTrigger(trigger, formProps.trigger);

        // To prevent user forgetting to pass the field, use undefined as the key, and updater.getValue will get the wrong value.
        let initValueInFormOpts = typeof field !== 'undefined' ? updater.getValue(field) : undefined; // Get the init value of form from formP rops.init Values Get the initial value set in the initValues of Form
        let initVal = typeof initValue !== 'undefined' ? initValue : initValueInFormOpts;

        // use arrayFieldState to fix issue 615
        let arrayFieldState;
        let inArrayField = false;
        try {
            arrayFieldState = useArrayFieldState();
            if (arrayFieldState) {
                inArrayField = Boolean(arrayFieldState.inArrayField);
                /**
                 * In ArrayField, when setValues causes ArrayField re-render, ArrayField will set shouldUseInitValue to false.
                 * But Field may be conditionally unmounted/remounted later. In that case, if the value in form state is
                 * still undefined (e.g. API data doesn't provide that key), we should still fall back to initValue.
                 *
                 * This keeps behavior consistent with fields outside ArrayField and avoids overriding values
                 * that were already provided by setValues.
                 */
                if (typeof initValue !== 'undefined') {
                    if (arrayFieldState.shouldUseInitValue) {
                        initVal = initValue;
                    } else {
                        initVal = typeof initValueInFormOpts !== 'undefined' ? initValueInFormOpts : initValue;
                    }
                } else {
                    initVal = initValueInFormOpts;
                }
            }
        } catch (err) {}

        // FIXME typeof initVal
        const [value, setValue, getVal] = useStateWithGetter(typeof initVal !== undefined ? initVal : null);
        const validateOnMount = mergeTrigger.includes('mount');

        allowEmpty = allowEmpty || updater.getFormProps().allowEmpty;

        // `keepState` semantically preserves a field's state when the component unmounts and
        // restores it on remount, keyed by the field path. Inside an <ArrayField>, removing a
        // row shifts the subsequent rows' positional field paths (e.g. people[1].name becomes
        // people[0].name), so "restore by path" no longer matches the user's intent and easily
        // surfaces stale state (touched flags, registered markers, etc.). To avoid that
        // ambiguity, ignore `keepState` for fields rendered inside an ArrayField and warn once.
        if (keepState && inArrayField) {
            warning(
                true,
                `[Semi Form]: 'keepState' is not supported on Field "${field}" inside <ArrayField/>. It will be ignored. Use add/remove on the ArrayField to manage array items instead.`
            );
            keepState = false;
        }

        // Error information: Array, String, undefined
        const [error, setError, getError] = useStateWithGetter();
        const [touched, setTouched] = useState<boolean | undefined>();
        const [cursor, setCursor, getCursor] = useStateWithGetter(0);
        const [status, setStatus] = useState(validateStatus); // use props.validateStatus to init

        const isUnmounted = useRef(false);
        const rulesRef = useRef(rules);
        const validateRef = useRef(validate);
        const validatePromise = useRef<Promise<any> | null>(null);

        // notNotify is true means that the onChange of the Form does not need to be triggered
        // notUpdate is true means that this operation does not need to trigger the forceUpdate
        const updateTouched = (isTouched: boolean, callOpts?: CallOpts) => {
            setTouched(isTouched);
            updater.updateStateTouched(field, isTouched, callOpts);
        };

        const updateError = (errors: any, callOpts?: CallOpts) => {
            if (isUnmounted.current) {
                return;
            }
            if (errors === getError()) {
                // When the inspection result is unchanged, no need to update, saving a forceUpdate overhead
                // When errors is an array, deepEqual is not used, and it is always treated as a need to update
                return;
            }
            const isSilent = callOpts && callOpts.silent;
            if (!isSilent) {
                setError(errors);
                if (!isValid(errors)) {
                    setStatus('error');
                } else {
                    setStatus('success');
                }
            }
            updater.updateStateError(field, errors, callOpts);
        };

        const updateValue = (val: any, callOpts?: CallOpts) => {
            setValue(val);
            let newOpts = {
                ...callOpts,
                // Keep legacy key to avoid implicit allowEmpty behavior change
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

            const rootPromise = new Promise((resolve, reject) => {
                validator
                    .validate(
                        model,
                        {
                            first: mergeStopValidateWithError,
                        },
                        (errors, fields) => {}
                    )
                    .then(res => {
                        if (isUnmounted.current || validatePromise.current !== rootPromise) {
                            console.warn(`[Semi Form]: When FieldComponent (${field}) has an unfinished validation process, you repeatedly trigger a new validation, the old validation will be abandoned, and will neither resolve nor reject. Usually this is an unreasonable practice. Please check your code.`);
                            return;
                        }
                        // validation passed
                        setStatus('success');
                        updateError(undefined, callOpts);
                        resolve({});
                    })
                    .catch(err => {
                        if (isUnmounted.current || validatePromise.current !== rootPromise) {
                            console.warn(`[Semi Form]: When FieldComponent (${field}) has an unfinished validation process, you repeatedly trigger a new validation, the old validation will be abandoned, and will neither resolve nor reject. Usually this is an unreasonable practice. Please check your code.`);
                            return;
                        }
                        let { errors, fields } = err;
                        if (errors && fields) {
                            let messages = errors.map((e: any) => e.message);
                            if (messages.length === 1) {
                                messages = messages[0];
                            }
                            // NOTE:
                            // `async-validator` treats `message: ''` as a valid error message (validation fails, but the
                            // user wants to hide the message text). In that case `messages` becomes the empty string and
                            // `isValid('')` returns true, so the previous logic accidentally short-circuited and never
                            // resolved the promise — `submit()` / `validate()` would hang forever.
                            //
                            // The presence of an error is decided from `errors.length`, decoupled from whether the
                            // produced message is renderable. The empty-string is preserved as the field error value so
                            // that the public `formApi.getError(field)` API stays backward compatible (callers that did
                            // `getError(field) === ''` to detect "invalid without text" keep working). The corresponding
                            // render-time fallback (do not display `helpText` when the field is in an error state with an
                            // empty message) is handled in `ErrorMessage`.
                            const hasRulesError = Array.isArray(errors) && errors.length > 0;
                            if (hasRulesError) {
                                if (!callOpts?.silent) {
                                    setStatus('error');
                                }
                                updateError(messages, callOpts);
                                resolve(errors);
                            }
                        } else {
                            // Some grammatical errors in rules
                            if (!callOpts?.silent) {
                                setStatus('error');
                            }
                            updateError(err.message, callOpts);
                            resolve(err.message);
                            throw err;
                        }
                    });
            });

            validatePromise.current = rootPromise;

            return rootPromise;
        };

        // execute custom validate function
        const _validate = (val: any, values: any, callOpts: CallOpts) => {

            const rootPromise = new Promise(resolve => {
                let maybePromisedErrors;
                // let errorThrowSync;
                try {
                    maybePromisedErrors = validateRef.current(val, values);
                } catch (err) {
                    // error throw by syncValidate
                    maybePromisedErrors = err;
                }
                if (maybePromisedErrors === undefined) {
                    resolve({});
                    updateError(undefined, callOpts);
                } else if (isPromise(maybePromisedErrors)) {
                    maybePromisedErrors.then((result: any) => {
                        // If the async validate is outdated (a newer validate occurs), the result should be discarded
                        if (isUnmounted.current || validatePromise.current !== rootPromise) {
                            console.warn(`[Semi Form]: When Field: (${field}) has an unfinished validation process, you repeatedly trigger a new validation, the old validation will be abandoned, and will neither resolve nor reject. Usually this is an unreasonable practice. Please check your code.`);
                            return;
                        }

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
            
            validatePromise.current = rootPromise;

            return rootPromise;
        };

        const fieldValidate = (val: any, callOpts?: CallOpts) => {
            let finalVal = val;
            let latestRules = rulesRef.current;
            if (transform) {
                finalVal = transform(val);
            }
            if (validateRef.current) {
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

            /**
             * Two-phase commit to balance:
             * - Fix #579: allow user to read latest values in onChange (including via render-prop closure)
             * - Keep legacy semantics when user's onChange throws: do NOT commit value into form state
             *
             * Phase 1 (prepare): write value into foundation silently (no notify / no forceUpdate)
             * Phase 2 (commit): after user's onChange succeeds, update touched silently and then commit value with notify/forceUpdate
             */
            const prevLocalVal = getVal();
            const prevFormVal = updater.getValue(field, { needClone: true });
            const fnKey = options.onKeyChangeFnName;
            try {
                // prepare: update local controlled value + foundation value silently
                setValue(val);
                updater.updateStateValue(field, val, { notNotify: true, notUpdate: true, allowEmpty });

                // call user's onChange with latest values as additional parameter (last arg)
                if (fnKey in props && typeof props[fnKey] === 'function') {
                    const latestValues = updater.getValue();
                    (props[fnKey] as any)(newValue, e, ...other, latestValues);
                }

                // prepare touched AFTER user's onChange to keep timing closer to legacy
                setTouched(true);
                updater.updateStateTouched(field, true, { notNotify: true, notUpdate: true });

                // commit: trigger notify + forceUpdate once
                updater.updateStateValue(field, val, { allowEmpty });

                // validate when trigger includes change
                if (mergeTrigger.includes('change')) {
                    fieldValidate(val);
                }
            } catch (err) {
                // rollback silent writes to keep legacy "throw => no commit" behavior
                setValue(prevLocalVal);
                updater.updateStateValue(field, prevFormVal, { notNotify: true, notUpdate: true, allowEmpty });
                throw err;
            }
        };

        const handleBlur = (...e: any[]) => {
            if (props.onBlur) {
                props.onBlur(...e);
            }
            if (!touched) {
                updateTouched(true);
            }
            if (mergeTrigger.includes('blur')) {
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
        useIsomorphicEffect(() => {
            rulesRef.current = rules;
            validateRef.current = validate;
        }, [rules, validate]);

        useIsomorphicEffect(() => {
            isUnmounted.current = false;
            // exec validate once when trigger include 'mount'
            if (validateOnMount) {
                fieldValidate(value);
            }
            return () => {
                isUnmounted.current = true;
            };
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        // register when mounted，unregister when unmounted
        // register again when field change
        useIsomorphicEffect(() => {
            // register
            if (typeof field === 'undefined') {
                return () => {};
            }
            // log('register: ' + field);

            // field value may change after field component mounted, we use ref value here to get changed value
            const refValue = getVal();
            updater.register(
                field,
                {
                    value: refValue,
                    error,
                    touched,
                    status,
                },
                {
                    field,
                    fieldApi,
                    keepState,
                    allowEmpty: allowEmpty || allowEmptyString,
                }
            );
            // return unRegister cb
            return () => {
                updater.unRegister(field);
                // log('unRegister: ' + field);
            };
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [field]);

        // id attribute to improve a11y
        const a11yId = id ? id : field;
        const labelId = `${a11yId}-label`;
        const helpTextId = `${a11yId}-helpText`;
        const extraTextId = `${a11yId}-extraText`;
        const errorMessageId = `${a11yId}-errormessage`;

        const FieldComponent = () => {
            // prefer to use validateStatus which pass by user throught props
            let blockStatus = validateStatus ? validateStatus : status;

            const extraCls = classNames(`${prefix}-field-extra`, {
                [`${prefix}-field-extra-string`]: typeof extraText === 'string',
                [`${prefix}-field-extra-middle`]: mergeExtraPos === 'middle',
                [`${prefix}-field-extra-bottom`]: mergeExtraPos === 'bottom',
            });

            const extraContent = extraText ? <div className={extraCls} id={extraTextId} x-semi-prop="extraText">{extraText}</div> : null;

            let newProps: Record<string, any> = {
                id: a11yId,
                disabled: formProps.disabled,
                ...rest,
                ref,
                onBlur: handleBlur,
                [options.onKeyChangeFnName]: handleChange,
                [options.valueKey]: value,
                validateStatus: blockStatus,
                'aria-required': required,
                'aria-labelledby': labelId,
            };

            if (name) {
                newProps['name'] = name;
            }

            if (helpText) {
                newProps['aria-describedby'] = extraText ? `${helpTextId} ${extraTextId}` : helpTextId;
            }

            if (extraText) {
                newProps['aria-describedby'] = helpText ? `${helpTextId} ${extraTextId}` : extraTextId;
            }

            if (status === 'error') {
                newProps['aria-errormessage'] = errorMessageId;
                newProps['aria-invalid'] = true;
            }

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
                newProps.insetLabelId = labelId;
                if (typeof label === 'object' && !isElement(label)) {
                    newProps.insetLabel = label.text;
                    newProps.insetLabelId = labelId;
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
                        id={labelId}
                        required={required}
                        name={a11yId || name || field}
                        width={mergeLabelWidth}
                        align={mergeLabelAlign}
                        {...needSpread}
                    />
                );
            }

            const fieldMainContent = (
                <div className={fieldMaincls}>
                    {mergeExtraPos === 'middle' ? extraContent : null}
                    {com}
                    {!noErrorMessage ? (
                        <ErrorMessage
                            error={error}
                            validateStatus={blockStatus}
                            helpText={helpText}
                            helpTextId={helpTextId}
                            errorMessageId={errorMessageId}
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
        };

        // !important optimization
        // IMPORTANT: do NOT use `...Object.values(props)` as `useMemo` deps.
        //
        // Background
        // - Tooltip/Popover (and similar wrappers) may inject props into their child via
        //   `React.cloneElement`, typically event handlers like `onMouseEnter` / `onMouseLeave`.
        // - When those injected props appear/disappear, the number of keys in `props` changes.
        // - If we spread `Object.values(props)` into the deps list, the deps array length changes
        //   between renders and React will warn:
        //   "The final argument passed to useMemo changed size between renders".
        //
        // Solution
        // Represent `props` with a FIXED-LENGTH deps list:
        // - `stablePropKeys`: sorted list of prop keys (stable reference when unchanged)
        // - `stablePropValues`: values in the same key order (stable reference when unchanged)
        // This keeps the deps list length constant while still re-running memo when:
        // - injected handler props change
        // - any prop value changes
        // - prop keys are added/removed
        const sortedPropKeys = Object.keys(props).sort();
        const stablePropKeys = useShallowStableArray(sortedPropKeys);
        const stablePropValues = useShallowStableArray(stablePropKeys.map(key => props[key]) as any[]);

        const shouldUpdate = [
            ...Object.values(fieldState),
            stablePropKeys,
            stablePropValues,
            field,
            mergeLabelPos,
            mergeLabelAlign,
            formProps.disabled,
        ];
        if (options.shouldMemo) {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            return useMemo(FieldComponent, [...shouldUpdate]);
        } else {
            // Some Custom Component with inner state shouldn't be memo, otherwise the component will not updated when the internal state is updated
            return FieldComponent();
        }
    };
    SemiField = forwardRef(SemiField);
    (SemiField as React.FC).displayName = getDisplayName(Component);
    return SemiField as any;
}

// eslint-disable-next-line
export default withField;
