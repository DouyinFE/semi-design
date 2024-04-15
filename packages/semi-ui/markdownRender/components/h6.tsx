import * as React from 'react';
import { PropsWithChildren } from 'react';
import Typography, { TitleProps } from '../../typography';
import { omit } from 'lodash';

export default (props: PropsWithChildren<TitleProps>)=>{
    return <Typography.Title heading={6} {...omit(props, "children")}/>;
};
