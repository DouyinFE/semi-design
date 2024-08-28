import React, { createContext, RefObject } from 'react';
import ResizeItem from './resizeItem';
import ResizeHandler from './resizeHandler';

export interface ResizeContextProps {
    direction: 'horizontal' | 'vertical';
    getConstraintById: (id: number) => [number, number]
}

export const ResizeContext = createContext<ResizeContextProps>(undefined);

