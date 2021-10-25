import React from 'react';
import {  BasicCheckboxEvent } from '@douyinfe/semi-foundation/checkbox/checkboxFoundation';
type CheckboxContext = {
    checkboxGroup?: {
        onChange: (evt: BasicCheckboxEvent) => void;
        value: any[];
        disabled: boolean;
        name: any;
        isCardType: boolean;
        isPureCardType: boolean;
    };
};
const Context = React.createContext<CheckboxContext>({});
export { Context };