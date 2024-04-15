import * as React from 'react';
import { PropsWithChildren } from 'react';
import Image, { ImageProps } from '../../image';
import { IconUploadError } from "@douyinfe/semi-icons";
import { omit } from 'lodash';

export default (props: PropsWithChildren<ImageProps>)=>{
    return <Image fallback={<IconUploadError />} width={"50%"} {...omit(props, 'children')}/>;
};
