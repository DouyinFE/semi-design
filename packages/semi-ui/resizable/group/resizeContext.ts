import React, { createContext, RefObject } from 'react';
import ResizeItem from './resizeItem';
import ResizeHandler from './resizeHandler';

export interface ResizeContextProps {
    direction: 'horizontal' | 'vertical';
    registerItem: (r: RefObject<any>) => void;
    registerHandler: (r: RefObject<any>) => void;
    getArray: () => void
}

export const ResizeContext = createContext<ResizeContextProps>(undefined);

