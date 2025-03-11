/* eslint-disable @typescript-eslint/ban-types */
import React from 'react';
import useFormApi from './useFormApi';
import { ReactFieldError as FieldError } from '../errorMessage';
import { BaseFormApi as FormApi, FieldPath, FieldPathValue } from '@douyinfe/semi-foundation/form/interface';

const buildFieldApi = <T extends object, P extends FieldPath<T>>(formApi: FormApi<T>, field: P) => ({
    getError: () => formApi.getError(field),
    setError: (error: FieldError) => formApi.setError(field, error),
    getTouched: () => formApi.getTouched(field),
    setTouched: (isTouched: boolean) => formApi.setTouched(field, isTouched),
    getValue: (): FieldPathValue<T, P> => formApi.getValue(field),
    setValue: (value: FieldPathValue<T, P>) => formApi.setValue(field, value)
});

function useFieldApi<T extends object, P extends FieldPath<T>>(field: P) {
    const formApi = useFormApi<T>();
    const fieldApi = buildFieldApi<T, P>(formApi, field);
    return fieldApi;
}

// 理想状态是下面写法的单个泛型参数，实测无法自动推导，仍会作为联合类型推断出类型组合
// function useFieldApi<T extends object>(field: FieldPath<T>) {
//     const formApi = useFormApi<T>();
//     const fieldApi = buildFieldApi<T, typeof field>(formApi, field);
//     return fieldApi;
// }

export default useFieldApi;
