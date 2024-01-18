import React from 'react';
import ChangeTimeZone from './ChangeTimeZone';
import GetContainer from './GetPopupContainer';
import RTLWrapper from './RTLDirection/RTLWrapper';
import RTLTable from './RTLDirection/RTLTable';
import RTLForm from './RTLDirection/RTLForm';
import ConfigContext from "../context";
import {Button, ConfigProvider} from "../../index";

export default {
  title: 'ConfigProvider',
  parameters: {
    chromatic: { disableSnapshot: true },
  },
}

export {
  ChangeTimeZone,
  GetContainer,
}

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
}

export const DefaultPropsDemo = ()=>{
    return <div>
        <ConfigProvider >
            <Button>test</Button>
        </ConfigProvider>
    </div>
}
