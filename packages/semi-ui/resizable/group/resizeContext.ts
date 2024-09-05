import React, { createContext, RefObject } from 'react';
import { ResizeCallback, ResizeStartCallback} from '@douyinfe/semi-foundation/resizable/singleConstants';

export interface ResizeContextProps {
    direction: 'horizontal' | 'vertical';
    getConstraintById: (id: number) => [number, number];
    registerItem: (ref: RefObject<HTMLDivElement>, 
        min: string, max:string,
        onResizeStart: ResizeStartCallback,
        onChange: ResizeCallback,
        onResizeEnd: ResizeCallback
    ) => number;
    registerHandler: (ref: RefObject<HTMLDivElement>) => number;
    notifyResizeStart: (handlerIndex: number, e: MouseEvent) => void;
    getGroupSize: () => { width: number; height: number };
}

export const ResizeContext = createContext<ResizeContextProps>(undefined);

