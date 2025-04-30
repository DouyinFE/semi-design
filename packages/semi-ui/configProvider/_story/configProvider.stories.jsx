import React from 'react';
import ChangeTimeZone from './ChangeTimeZone';
import GetContainer from './GetPopupContainer';
import RTLWrapper from './RTLDirection/RTLWrapper';
import RTLTable from './RTLDirection/RTLTable';
import RTLForm from './RTLDirection/RTLForm';
import ConfigContext from '../context';
import { Button, ConfigProvider, Select, Tooltip, } from '../../index';
import semiGlobal from "../../_utils/semi-global";
import FixTimeZoneDST from './FixTimeZoneDST';

export default {
    title: 'ConfigProvider',
    parameters: {
        chromatic: { disableSnapshot: true },
    },
};

export { ChangeTimeZone, GetContainer, FixTimeZoneDST };

export const RTLTableDemo = () => (
    <RTLWrapper>
        <RTLTable />
    </RTLWrapper>
);

export const RTLFormDemo = () => (
    <RTLWrapper>
        <RTLForm />
    </RTLWrapper>
);
