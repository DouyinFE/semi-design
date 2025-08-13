import React from 'react';

export interface ContextValue {
    type?: 'nav' | 'fill' | 'basic' | 'dot'
}

export default React.createContext<ContextValue>(null);