import * as React from 'react'
import { PropsWithChildren } from 'react';
import Typography from '../../typography';

export default (props:PropsWithChildren<{}>)=>{
    return <Typography.Title heading={2} {...props}/>
}
