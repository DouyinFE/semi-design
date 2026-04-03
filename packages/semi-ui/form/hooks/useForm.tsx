import React, { useRef, useState, useCallback } from 'react';
import { BaseFormApi, FormState } from '@douyinfe/semi-foundation/form/interface';

/**
 * 内部使用的 FormApi 包装器接口（代理对象 + 内部字段）
 */
interface FormApiInternal<T extends Record<string, any> = any> extends BaseFormApi<T> {
    __bind?: (api: BaseFormApi<T>) => void;
    __unbind?: () => void;
    __updateState?: (state: FormState<T>) => void;
    __realApi?: BaseFormApi<T> | null;
}

/**
 * useForm - 创建一个可在 Form 组件外部使用的 FormApi
 * 
 * 用法：
 * const [formApi, formState, formValues] = Form.useForm();
 * <Form form={formApi}>...</Form>
 * 
 * @returns [formApi, formState, values]
 */
function useForm<T extends Record<string, any> = any>() {
    // 外部状态，用于响应式更新
    const [formState, setFormState] = useState<FormState<T>>({});
    
    // 真实 FormApi 的引用
    const realFormApiRef = useRef<BaseFormApi<T> | null>(null);
    
    // 代理 FormApi 的引用（保持不变）
    const proxyFormApiRef = useRef<FormApiInternal<T> | null>(null);
    
    // 创建代理 FormApi（只创建一次）
    if (!proxyFormApiRef.current) {
        proxyFormApiRef.current = createProxyFormApi<T>();
    }
    
    // 绑定真实的 FormApi
    const bind = useCallback((api: BaseFormApi<T>) => {
        realFormApiRef.current = api;
        // 将真实的 FormApi 存储到代理对象中
        if (proxyFormApiRef.current) {
            (proxyFormApiRef.current as any).__realApi = api;
        }
        // 初始化状态
        setFormState(api.getFormState() as FormState<T>);
    }, []);
    
    // 解绑
    const unbind = useCallback(() => {
        realFormApiRef.current = null;
        // 清除代理对象中的真实 FormApi
        if (proxyFormApiRef.current) {
            (proxyFormApiRef.current as any).__realApi = null;
        }
        setFormState({});
    }, []);
    
    // 更新状态的函数
    const updateState = useCallback((newState: FormState<T>) => {
        setFormState(newState);
    }, []);
    
    // 将控制函数附加到代理对象上
    if (proxyFormApiRef.current) {
        (proxyFormApiRef.current as any).__bind = bind;
        (proxyFormApiRef.current as any).__unbind = unbind;
        (proxyFormApiRef.current as any).__updateState = updateState;
    }
    
    // 从 formState 中提取 values
    const values = formState.values as T;
    
    return [proxyFormApiRef.current, formState, values] as const;
}

/**
 * 创建代理 FormApi 对象
 * 所有方法调用都会转发到真实的 FormApi
 */
function createProxyFormApi<T extends Record<string, any> = any>(): FormApiInternal<T> {
    // 创建一个空对象作为基础
    const proxyTarget: any = {
        __bind: null,
        __unbind: null,
        __updateState: null,
        __realApi: null,
    };
    
    // 定义所有 BaseFormApi 的方法
    const methods: (keyof BaseFormApi)[] = [
        'getValue', 'setValue', 'getError', 'setError',
        'getTouched', 'setTouched', 'getFieldExist',
        'getFormState', 'getFormProps', 'submitForm',
        'reset', 'validate', 'getInitValue', 'getInitValues',
        'getValues', 'setValues', 'scrollToField', 'scrollToError'
    ];
    
    methods.forEach(method => {
        proxyTarget[method] = (...args: any[]) => {
            if (!proxyTarget.__realApi) {
                console.warn(
                    `[Semi Form] FormApi.${method}() is called before Form component is mounted. ` +
                    `Please ensure the Form component is rendered first.`
                );
                return undefined;
            }
            const realApi = proxyTarget.__realApi;
            const realMethod = (realApi as any)[method];
            if (typeof realMethod === 'function') {
                return realMethod.apply(realApi, args);
            }
            return realMethod;
        };
    });
    
    return proxyTarget as FormApiInternal<T>;
}

export default useForm;
