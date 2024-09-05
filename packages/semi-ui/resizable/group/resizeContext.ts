import React, { createContext, RefObject } from 'react';
import ResizeItem from './resizeItem';
import ResizeHandler from './resizeHandler';

export interface ResizeContextProps {
    direction: 'horizontal' | 'vertical';
    getConstraintById: (id: number) => [number, number];
    registerItem: (ref: RefObject<HTMLDivElement>, min: string, max:string) => number;
    registerHandler: (ref: RefObject<HTMLDivElement>) => number;
    notifyResizeStart: (handlerIndex: number, e: MouseEvent) => void;
    getGroupSize: () => { width: number; height: number };
}

export const ResizeContext = createContext<ResizeContextProps>(undefined);

