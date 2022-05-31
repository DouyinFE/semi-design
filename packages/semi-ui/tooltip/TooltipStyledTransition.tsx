/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-shadow */
import { StyledTransition } from '@douyinfe/semi-animation-react';
import React from 'react';
import { cssClasses } from '@douyinfe/semi-foundation/tooltip/constants';
import getMotionObjFromProps from '@douyinfe/semi-foundation/utils/getMotionObjFromProps';
import { Motion } from '../_base/base';

const enterCls = `${cssClasses.PREFIX}-bounceIn`;
const leaveCls = `${cssClasses.PREFIX}-zoomOut`;

export interface TooltipTransitionProps {
    [key: string]: any;
    children?: (arg: any) => React.ReactNode;
    motion?: Motion<TooltipTransitionProps>;
}
const TooltipTransition: React.FC<TooltipTransitionProps> = (props = {}) => {
    const { children } = props;
    const motion = getMotionObjFromProps(props);

    //  add fillMode forward to fix issue 715, tooltip close will flashing under react 18
    return (
        <StyledTransition {...props} enter={enterCls} leave={leaveCls} duration={'100ms'} {...motion} fillMode='forward'>
            {typeof children === 'function' ?
                ({ animateCls, animateEvents, animateStyle }: any) => children({ animateCls, animateEvents, animateStyle }) :
                children}
        </StyledTransition>
    );
};

export default TooltipTransition;