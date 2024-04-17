import * as React from 'react';
import { PropsWithChildren } from 'react';
import Typography, { TextProps } from "../../typography";

import { omit } from 'lodash';

export default (props: PropsWithChildren<TextProps>)=>{
    return <Typography.Text link={{ ...props }} {...props}/>;
};
