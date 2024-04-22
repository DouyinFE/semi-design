import * as React from 'react';
import { PropsWithChildren } from 'react';
import Image, { ImageProps } from '../../image';
import { IconUploadError } from "@douyinfe/semi-icons";
import { omit } from 'lodash';
import { cssClasses } from '@douyinfe/semi-foundation/markdownRender/constants';


export default (props: PropsWithChildren<ImageProps>)=>{

    return <div className={`${cssClasses.PREFIX}-component-image`} style={{
        maxWidth: "50%",
        maxHeight: "500px",
        display: 'flex',
        "flexDirection": "column",
        "justifyContent": "center"
    }}>

        <Image fallback={<IconUploadError />} width={"100%"} {...omit(props, 'children')}/>
        <div className={`${cssClasses.PREFIX}-component-image-alt`}>{props.alt}</div>
    </div>;
};
