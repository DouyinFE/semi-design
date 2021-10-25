import React from 'react';
import { storiesOf } from '@storybook/react';
import ChangeTimeZone from './ChangeTimeZone';
import GetContainer from './GetPopupContainer';
import RTLWrapper from './RTLDirection/RTLWrapper'
import RTLTable  from './RTLDirection/RTLTable';
import RTLForm  from './RTLDirection/RTLForm';

const stories = storiesOf('ConfigProvider', module);
stories.add(`change timeZone`, () => <ChangeTimeZone />);

stories.add(`getPopupContainer`, () => <GetContainer />);

stories.add(`RTL Table`, () => <RTLWrapper><RTLTable /></RTLWrapper>);

stories.add(`RTL Form`, () => <RTLWrapper><RTLForm /></RTLWrapper>);
