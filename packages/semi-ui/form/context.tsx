import React from 'react';
import { BaseFormApi, FormUpdaterContextType, FormState } from '@douyinfe/semi-foundation/form/interface';

const FormStateContext = React.createContext<FormState>({});
FormStateContext.displayName = 'FormState';

const FormApiContext = React.createContext<BaseFormApi>({} as BaseFormApi);
FormApiContext.displayName = 'FormApi';

const FormUpdaterContext = React.createContext<FormUpdaterContextType>({} as FormUpdaterContextType);
FormUpdaterContext.displayName = 'FormUpdater';

const ArrayFieldContext = React.createContext({
    shouldUseInitValue: true,
    // Whether the current subtree is rendered inside an <ArrayField/>.
    // Used by withField to disable `keepState` semantics inside an ArrayField,
    // because positional field paths (e.g. people[0].name) shift on remove,
    // which conflicts with the "preserve unmounted state by path" model.
    inArrayField: false,
});

export { FormStateContext, FormApiContext, FormUpdaterContext, ArrayFieldContext };
