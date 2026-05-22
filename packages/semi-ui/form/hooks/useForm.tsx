import { useRef, useState, useCallback } from 'react';
import { BaseFormApi, FormState } from '@douyinfe/semi-foundation/form/interface';

const EMPTY_FORM_STATE: FormState = {
    values: {} as any,
    errors: {},
    touched: {},
};

interface ProxyInternals<T extends Record<string, any> = any> {
    __realApi: BaseFormApi<T> | null;
    __bind: ((api: BaseFormApi<T>) => void) | null;
    __unbind: (() => void) | null;
    __updateState: ((state: FormState<T>) => void) | null
}

/**
 * useForm - create a FormApi usable outside of Form component
 *
 * Usage:
 *   const [formApi, formState, formValues] = Form.useForm();
 *   <Form form={formApi}>...</Form>
 *
 * @returns [formApi, formState, values]
 */
function useForm<T extends Record<string, any> = any>() {
    const [formState, setFormState] = useState<FormState<T>>(EMPTY_FORM_STATE as FormState<T>);

    const realFormApiRef = useRef<BaseFormApi<T> | null>(null);

    const proxyRef = useRef<BaseFormApi<T> & ProxyInternals<T>>(null);

    const bind = useCallback((api: BaseFormApi<T>) => {
        realFormApiRef.current = api;
        if (proxyRef.current) {
            proxyRef.current.__realApi = api;
        }
        setFormState(api.getFormState() as FormState<T>);
    }, []);

    const unbind = useCallback(() => {
        realFormApiRef.current = null;
        if (proxyRef.current) {
            proxyRef.current.__realApi = null;
        }
        setFormState(EMPTY_FORM_STATE as FormState<T>);
    }, []);

    const updateState = useCallback((newState: FormState<T>) => {
        setFormState(prev => {
            if (prev === newState) {
                return prev;
            }
            return newState;
        });
    }, []);

    if (!proxyRef.current) {
        const internals: ProxyInternals<T> = {
            __realApi: null,
            __bind: bind,
            __unbind: unbind,
            __updateState: updateState,
        };

        const proxy = new Proxy(internals, {
            get(target, prop: string) {
                if (prop.startsWith('__')) {
                    return target[prop as keyof ProxyInternals<T>];
                }
                const realApi = target.__realApi;
                if (!realApi) {
                    if (typeof prop === 'string') {
                        return (..._args: any[]) => {
                            console.warn(
                                `[Semi Form] FormApi.${prop}() is called before Form component is mounted. ` +
                                `Please ensure the Form component is rendered first.`
                            );
                            return undefined;
                        };
                    }
                    return undefined;
                }
                const value = (realApi as any)[prop];
                if (typeof value === 'function') {
                    return value.bind(realApi);
                }
                return value;
            },
            set(target, prop: string, value) {
                if (prop.startsWith('__')) {
                    (target as any)[prop] = value;
                    return true;
                }
                return false;
            }
        }) as unknown as BaseFormApi<T> & ProxyInternals<T>;

        proxyRef.current = proxy;
    } else {
        proxyRef.current.__bind = bind;
        proxyRef.current.__unbind = unbind;
        proxyRef.current.__updateState = updateState;
    }

    const values = formState.values as T;

    return [proxyRef.current as BaseFormApi<T> & ProxyInternals<T>, formState, values] as const;
}

export default useForm;
