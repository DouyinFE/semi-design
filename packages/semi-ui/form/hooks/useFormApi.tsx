import React, { useContext } from 'react';
import { FormApiContext } from '../context';
 
export default function useFormApi() {
    return useContext(FormApiContext);
}