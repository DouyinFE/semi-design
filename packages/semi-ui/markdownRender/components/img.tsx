import * as React from 'react'
import { PropsWithChildren } from 'react';
import Image from '../../image';
import {IconUploadError} from "@douyinfe/semi-icons"

export default (props:PropsWithChildren<{}>)=>{
    return <Image  fallback={<IconUploadError />} {...props}/>
}
