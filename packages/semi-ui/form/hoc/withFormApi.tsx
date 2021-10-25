import React from 'react';
import { FormApiContext } from '../context';

const withFormApi = (Component: React.ElementType) =>
    React.forwardRef((props, ref) => (
        <FormApiContext.Consumer>
            {formApi => <Component formApi={formApi} ref={ref} {...props} />}
        </FormApiContext.Consumer>
    ));

export default withFormApi;
