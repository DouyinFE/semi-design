import * as React from 'react';
import { PropsWithChildren } from 'react';
import Typography, { TitleProps } from '../../typography';
import { omit } from 'lodash';
import { cssClasses } from '@douyinfe/semi-foundation/markdownRender/constants';

export default (props: PropsWithChildren<TitleProps>)=>{
    return <Typography.Title heading={2} className={`${cssClasses.PREFIX}-component-header`} {...props}/>;
};
