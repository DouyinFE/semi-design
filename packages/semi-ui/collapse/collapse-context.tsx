import React from 'react';
import { Motion } from '../_base/base';


export interface CollapseContextType{
    activeSet: Set<string>;
    expandIcon: React.ReactNode;
    collapseIcon: React.ReactNode;
    keepDOM: boolean;
    expandIconPosition: 'left' | 'right';
    onClick: (activeKey: string, e: React.MouseEvent) => void;
    motion: Motion
}


const CollapseContext = React.createContext<CollapseContextType>({} as CollapseContextType);

export default CollapseContext;