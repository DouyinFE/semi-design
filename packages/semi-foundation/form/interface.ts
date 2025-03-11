/* eslint-disable @typescript-eslint/ban-types */
import { DefaultAdapter } from '../base/foundation';
import { Options as ScrollIntoViewOptions } from 'scroll-into-view-if-needed';

export type BasicTriggerType = 'blur' | 'change' | 'custom' | 'mount';

export type FieldValidateTriggerType = BasicTriggerType | Array<BasicTriggerType>;

export type CommonFieldError = boolean | string | Array<any> | undefined | unknown;

export type BasicFieldError = Array<any>;

export interface BaseFormAdapter<P = Record<string, any>, S = Record<string, any>, Values extends object = any> extends DefaultAdapter<P, S> {
    cloneDeep: (val: any, ...rest: any[]) => any;
    notifySubmit: (values: any, e?: any) => void;
    notifySubmitFail: (errors: Record<keyof Values, BasicFieldError>, values: Partial<Values>, e?: any) => void;
    forceUpdate: (callback?: () => void) => void;
    notifyChange: (formState: FormState) => void;
    notifyValueChange: (values: any, changedValues: any) => void;
    notifyErrorChange: (errors: any, changedError: any) => void;
    notifyReset: () => void;
    getInitValues: () => Partial<Values>;
    getFormProps: (keys: undefined | string | Array<string>) => any;
    getAllErrorDOM: () => NodeList;
    getFieldDOM: (field: string) => Node;
    getFieldErrorDOM: (field: string) => Node;
    initFormId: () => void
}

export type AllErrors<T> = T extends Record<string, any> ? { [K in keyof T]?: string } : Record<string, any>;

export interface FormState<T extends Record<string, any> = any> {
    values?: T extends Record<string, any> ? T : Record<string, any>;
    errors?: AllErrors<T>;
    touched?: T extends Record<string, any> ? { [K in keyof T]?: boolean } : Record<string, any>
}
export interface setValuesConfig {
    isOverride: boolean
}

export type ScrollToErrorOptions<K> = {
    field?: K;
    index?: number;
    scrollOpts?: ScrollIntoViewOptions
}

// 支持 array[index] 和 array.index 两种形式
type ArrayIndexPath<K extends string | number, U> = 
    | `${K}[${number}]` // 支持 array[index]
    | `${K}[${number}].${FieldPath<U>}` // 支持 array[index].child
    | `${K}.${number}`  // 支持 array.index
    | `${K}.${number}.${FieldPath<U>}`; // 支持 array.index.child

// FieldPath 类型定义，支持对象和数组字段路径
export type FieldPath<T> = T extends Array<infer U>
    ? | `${number}`                      // 如果是数组，支持数字索引（如 `[0]`）
    | `${number}.${FieldPath<U>}`      // 支持数组嵌套路径（如 `[0].field`）
    : T extends object
        ? {
            [K in keyof T]: K extends string
                ? T[K] extends Array<infer U> | object
                    ? | `${K}` 
                    | `${K}.${FieldPath<T[K]>}`
                    | ArrayIndexPath<K, U>
                    : `${K}`                            // 只允许键路径
                : never;
        }[keyof T]
        : never;

type ArrayFieldPathValue<T, P extends string> =
    P extends `${infer K}[${infer I}]${infer Rest}`
        ? K extends keyof T
            ? T[K] extends Array<infer U>
                ? I extends `${number}`
                    ? Rest extends ''
                        ? U // 索引路径
                        : Rest extends `.${infer RestPath}`
                            ? FieldPathValue<U, RestPath> // 嵌套路径
                            : never
                    : never
                : never
            : never
        : never;

// FieldPathValue 类型定义，支持从路径字符串中推导数组和对象的值
export type FieldPathValue<T, P extends string> =
    ArrayFieldPathValue<T, P> // 处理数组路径
    | (P extends `${infer K}.${infer Rest}`
        ? K extends keyof T
            ? FieldPathValue<T[K], Rest>
            : never
        : P extends keyof T
            ? T[P]
            : never);

// use object replace Record<string, any>, fix issue 933
export interface BaseFormApi<FormValuesType extends object = any> {
    /** get value of field */
    getValue: <F extends FieldPath<FormValuesType>>(field?: F) => FieldPathValue<FormValuesType, F>;
    /** set value of field */
    setValue: <F extends FieldPath<FormValuesType>>(field: F, newFieldValue: any) => void;
    /** get error of field */
    getError: <F extends FieldPath<FormValuesType>>(field: F) => any;
    /** set error of field */
    setError: <F extends FieldPath<FormValuesType>>(field: F, fieldError: any) => void;
    /** get touched of field */
    getTouched: <F extends FieldPath<FormValuesType>>(field: F) => boolean;
    /** set touch of field */
    setTouched: <F extends FieldPath<FormValuesType>>(field: F, fieldTouch: boolean) => void;
    /** judge field exist */
    getFieldExist: <F extends FieldPath<FormValuesType>>(field: F) => boolean;
    /** get formState of form */
    getFormState: () => FormState<FormValuesType extends object ? FormValuesType : object>;
    /** get formProps of form */
    getFormProps: (keys?: Array<string>) => ComponentProps;
    /** submit form manual */
    submitForm: () => void;
    /** reset form manual */
    reset: (fields?: Array<string>) => void;
    /** trigger validate  manual */
    validate: <K extends keyof FormValuesType, Params extends Array<K>, V extends Params[number]>(fields?: Params) => Promise<{ [R in V]: [R] }>;
    getInitValue: <F extends FieldPath<FormValuesType>>(field: F) => any;
    getInitValues: () => any;
    getValues: () => FormValuesType;
    /** set value of multiple fields */
    setValues: (fieldsValue: Partial<FormValuesType>, config?: setValuesConfig) => void;
    scrollToField: <F extends FieldPath<FormValuesType>>(field: F, scrollConfig?: ScrollIntoViewOptions) => void;
    scrollToError: <F extends FieldPath<FormValuesType>>(config?: ScrollToErrorOptions<F>) => void
}

export interface CallOpts {
    [x: string]: any;
    notNotify?: boolean;
    notUpdate?: boolean;
    needClone?: boolean
}

export interface ComponentProps {
    [x: string]: any
}

export interface FieldState {
    value?: any;
    touched?: any;
    error?: any;
    status?: 'error' | 'success'
}

export interface WithFieldOption {
    valueKey?: string;
    onKeyChangeFnName?: string;
    valuePath?: string;
    maintainCursor?: boolean;
    shouldMemo?: boolean;
    shouldInject?: boolean
}

export interface InternalFieldApi {
    setValue: (val: any, opts: CallOpts) => void;
    setTouched: (isTouched: boolean, opts: CallOpts) => void;
    setError: (errors: any, opts: CallOpts) => void;
    reset: () => void;
    validate: (val: any, opts: CallOpts) => Promise<unknown>
}
export interface FieldStaff {
    field: string;
    fieldApi: InternalFieldApi;
    keepState: boolean;
    allowEmpty: boolean
}

export interface ArrayFieldStaff {
    field: string;
    updateKey?: string;
    initValue?: any
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
    updateArrayField: (arrayField: string, updateValue: any) => void
}

