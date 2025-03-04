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

// 支持 array[index] 和 array.index 两种形式
type ArrayIndexPath<K extends string | number, U> = 
    | `${K}[${number}]`
    | `${K}[${number}].${FieldPath<U>}`
    | `${K}.${number}`
    | `${K}.${number}.${FieldPath<U>}`;

// FieldPathValue 类型定义，支持从路径字符串中推导数组和对象的值
export type FieldPathValue<T, P extends string> =
  P extends `${infer K}[${infer I}]${infer Rest}` // 处理 array[index] 形式
      ? K extends keyof T
          ? T[K] extends Array<infer U>
              ? I extends `${number}`
                  ? Rest extends ''
                      ? U
                      : Rest extends `.${infer RestPath}`
                          ? FieldPathValue<U, RestPath>
                          : never
                  : never
              : never
          : never
      : P extends `${infer K}.${infer Rest}` // 处理 key.rest 或 array.index 形式
          ? K extends keyof T
              ? T[K] extends Array<infer U>
                  ? Rest extends `${number}${infer IndexRest}`
                      ? IndexRest extends ''
                          ? U // 简单的数组索引访问 (array.0)
                          : IndexRest extends `.${infer RestPath}`
                              ? FieldPathValue<U, RestPath> // 嵌套路径 (array.0.field)
                              : never
                      : FieldPathValue<T[K], Rest> // 其他嵌套对象字段
                  : FieldPathValue<T[K], Rest>
              : never
          : P extends keyof T // 简单的顶层键访问
              ? T[P]
              : P extends `${number}` // 对于顶层数组路径
                  ? T extends Array<infer U>
                      ? U
                      : never
                  : never;

// use object replace Record<string, any>, fix issue 933
export interface BaseFormApi<T extends object = any> {
    /** get value of field */
    getValue: <P extends FieldPath<T>>(field?: P) => FieldPathValue<T, P>;
    /** set value of field */
    setValue: <K extends FieldPath<T>>(field: K, newFieldValue: any) => void;
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
    getFormState: () => FormState<T extends object ? T : object>;
    /** get formProps of form */
    getFormProps: (keys?: Array<string>) => ComponentProps;
    /** submit form manual */
    submitForm: () => void;
    /** reset form manual */
    reset: (fields?: Array<string>) => void;
    /** trigger validate  manual */
    validate: <K extends keyof T, Params extends Array<K>, V extends Params[number]>(fields?: Params) => Promise<{ [R in V]: T[R] }>;
    getInitValue: <K extends keyof T>(field: K) => any;
    getInitValues: () => any;
    getValues: () => T;
    /** set value of multiple fields */
    setValues: (fieldsValue: Partial<T>, config?: setValuesConfig) => void;
    scrollToField: <K extends keyof T>(field: K, scrollConfig?: ScrollIntoViewOptions) => void;
    scrollToError: <K extends keyof T>(config?: ScrollToErrorOptions<K>) => void
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

