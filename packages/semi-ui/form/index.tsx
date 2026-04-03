// FormComponent
import Form from './baseForm';
import Label from './label';
import ArrayField from './arrayField';

// Form Hooks
import { useFormApi, useFormState, useFieldState, useFieldApi, useForm } from './hooks/index';

// Form Hoc
import withField from './hoc/withField';
import withFormState from './hoc/withFormState';
import withFormApi from './hoc/withFormApi';

// 添加静态方法
Form.useForm = useForm;

export {
    Form,
    ArrayField,
    withField,
    useFormApi,
    useFormState,
    useFieldApi,
    useFieldState,
    withFormState,
    withFormApi,
    useForm
};

export * from './interface';
export type { ArrayFieldProps } from './arrayField';
export type { ReactFieldError, ErrorMessageProps } from './errorMessage';
export type { InputGroupProps } from './group';
export type { LabelProps } from './label';
export type { SectionProps } from './section';
export type { SlotProps } from './slot';