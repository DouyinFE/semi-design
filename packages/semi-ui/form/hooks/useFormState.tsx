import React, { useContext } from 'react';
import { FormStateContext } from '../context';

function useFormState() {
    const formState = useContext(FormStateContext);
    return formState;
}

export default useFormState;