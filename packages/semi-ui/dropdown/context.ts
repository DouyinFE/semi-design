import React from 'react';

export interface DropdownContextType {
    level?: number;
    showTick?: boolean;
}

const DropdownContext = React.createContext<DropdownContextType>({
    level: 0,
});
export default DropdownContext;
