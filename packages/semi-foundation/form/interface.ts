/* eslint-disable max-len */
import { DefaultAdapter } from '../base/foundation';
import { Options as scrollIntoViewOptions } from 'scroll-into-view-if-needed';

export type BasicTriggerType = 'blur' | 'change' | 'custom' | 'mount';

export type FieldValidateTriggerType = BasicTriggerType | Array<BasicTriggerType>;

export type CommonFieldError = boolean | string | Array<any> | undefined | unknown;

export interface BaseFormAdapter<P = Record<string, any>, S = Record<string, any>> extends DefaultAdapter<P, S> {
    cloneDeep: (val: any, ...rest: any[]) => any;
    notifySubmit: (values: any) => void;
    notifySubmitFail: (errors: Record<string, any>, values: any) => void;
    forceUpdate: (callback?: () => void) => void;
    notifyChange: (formState: FormState) => void;
    notifyValueChange: (values: any, changedValues: any) => void;
    notifyReset: () => void;
    getInitValues: () => Record<string, any>;
    getFormProps: (keys: undefined | string | Array<string>) => any;
    getAllErrorDOM: () => NodeList;
    getFieldDOM: (field: string) => Node;
}

export interface FormState<T extends Record<string, any> = any> {
    values?: T extends Record<string, any> ? T : Record<string, any>;
    errors?: T extends Record<string, any> ? { [K in keyof T]?: string } : Record<string, any>;
    touched?: T extends Record<string, any> ? { [K in keyof T]?: boolean } : Record<string, any>;
}
export interface setValuesConfig {
    isOverride: boolean;
}
export interface BaseFormApi<T extends Record<string, unknown> = any> {
    /** get value of field */
    getValue: <K extends keyof T>(field?: K) => T[K];
    /** set value of field */
    setValue: <K extends keyof T>(field: K, newFieldValue: T[K]) => void;
    /** get error of field */
    getError: <K extends keyof T>(field: K) => any;
    /** set error of field */
    setError: <K extends keyof T>(field: K, fieldError: any) => void;
    /** get touched of field */
    getTouched: <K extends keyof T>(field: K) => boolean;
    /** set touch of field */
    setTouched: <K extends keyof T>(field: K, fieldTouch: boolean) => void;
    /** judge field exist */
    getFieldExist: <K extends keyof T>(field: K) => boolean;
    /** get formState of form */
    getFormState: () => FormState<T extends Record<string, unknown> ? T : Record<string, unknown>>;
    /** submit form manual */
    submitForm: () => void;
    /** reset form manual */
    reset: () => void;
    /** trigger validate  manual */
    validate: <K extends keyof T, Params extends Array<K>, V extends Params[number]>(fields?: Params) => Promise<{ [R in V]: T[R] }>;
    getInitValue: <K extends keyof T>(field: K) => any;
    getInitValues: () => any;
    getValues: () => T;
    /** set value of multiple fields */
    setValues: (fieldsValue: Partial<T>, config?: setValuesConfig) => void;
    scrollToField: <K extends keyof T>(field: K, scrollConfig?: scrollIntoViewOptions) => void;
}

export interface CallOpts {
    [x: string]: any;
    notNotify?: boolean;
    notUpdate?: boolean;
    needClone?: boolean;
}

export interface ComponentProps {
    [x: string]: any;
}

export interface FieldState {
    value?: any;
    touched?: any;
    error?: any;
    status?: 'error' | 'success';
}

export interface WithFieldOption {
    valueKey?: string;
    onKeyChangeFnName?: string;
    valuePath?: string;
    maintainCursor?: boolean;
    shouldMemo?: boolean;
    shouldInject?: boolean;
}

export interface InternalFieldApi {
    setValue: (val: any, opts: CallOpts) => void;
    setTouched: (isTouched: boolean, opts: CallOpts) => void;
    setError: (errors: any, opts: CallOpts) => void;
    reset: () => void;
    validate: (val: any, opts: CallOpts) => Promise<unknown>;
}

export interface FieldStaff {
    field: string;
    fieldApi: InternalFieldApi;
    keepState: boolean;
    allowEmpty: boolean;
}

export interface ArrayFieldStaff {
    field: string;
    updateKey?: string;
    initValue?: any;
}
export interface FormUpdaterContextType {
    register: (field: string, fieldState: FieldState, fieldStuff: FieldStaff) => void;
    unRegister: (field: string) => void;
    updateStateValue: (field: string, value: any, opts?: CallOpts) => void;
    updateStateError: (field: string, error: any, opts?: CallOpts) => void;
    updateStateTouched: (field: string, isTouched: boolean, opts?: CallOpts) => void;
    getValue: (field?: string | undefined, opts?: CallOpts) => any;
    getError: (field?: string) => any;
    getTouched: (field?: string) => boolean | Record<string, any> | undefined;
    getInitValues: () => any;
    getInitValue: (field?: string) => any;
    getFormProps: (keys?: Array<string>) => ComponentProps;
    getField: (field: string) => FieldStaff | undefined;
    registerArrayField: (arrayFieldPath: string, val: any) => void;
    unRegisterArrayField: (arrayField: string) => void;
    getArrayField: (arrayField: string) => ArrayFieldStaff;
    updateArrayField: (arrayField: string, updateValue: any) => void;
}

