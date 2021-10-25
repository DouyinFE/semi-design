import React from 'react';
import { FormStateContext } from '../context';

const withFormState = (Component: React.ElementType) =>
    React.forwardRef((props, ref) => (
        <FormStateContext.Consumer>
            {formState => <Component formState={formState} ref={ref} {...props} />}
        </FormStateContext.Consumer>
    ));

export default withFormState;
