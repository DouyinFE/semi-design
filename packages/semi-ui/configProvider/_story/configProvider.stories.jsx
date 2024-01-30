import React from 'react';
import ChangeTimeZone from './ChangeTimeZone';
import GetContainer from './GetPopupContainer';
import RTLWrapper from './RTLDirection/RTLWrapper';
import RTLTable from './RTLDirection/RTLTable';
import RTLForm from './RTLDirection/RTLForm';
import ConfigContext from '../context';
import { Button, ConfigProvider, Select, Tooltip, } from '../../index';

export default {
    title: 'ConfigProvider',
    parameters: {
        chromatic: { disableSnapshot: true },
    },
};

export { ChangeTimeZone, GetContainer };

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

ConfigProvider.overrideDefaultProps = {
    Button: {
        type: 'warning',
    },
    Select: {
        zIndex: 2000,
        getPopupContainer: () => document.querySelector('#popupContainer')
    },
    Tooltip: {
        zIndex: 2001,
        getPopupContainer: () => document.querySelector('#popupContainer')
    },
};

export const DefaultPropsDemo = () => {
    return (
        <div>
            <ConfigProvider>
                <div style={{ position: 'relative'}} id='popupContainer'></div>
                <Tooltip content="zindex 2001">
                    <Button>test</Button>
                </Tooltip>
                <Select
                    optionList={[
                        { value: 1, label: 1 },
                        { value: 2, label: 2 },
                    ]}
                ></Select>
            </ConfigProvider>
        </div>
    );
};
