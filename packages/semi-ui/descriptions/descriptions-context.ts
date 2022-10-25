import React from 'react';

export type DescriptionsAlign = 'center' | 'justify' | 'left' | 'plain';

export interface DescriptionsContextValue {
    align?: DescriptionsAlign
}

const DescriptionsContext = React.createContext<DescriptionsContextValue>(null);

export default DescriptionsContext;