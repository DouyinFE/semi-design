import * as React from 'react'
import { PropsWithChildren } from 'react';
import { Typography } from '@douyinfe/semi-ui/index';

export default (props:PropsWithChildren<{}>)=>{
    console.log(props);
    return <Typography.Text link={{...props}} {...props}/>
}
