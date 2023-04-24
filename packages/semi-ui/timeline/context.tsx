import React from 'react';

export type ModeType = 'left' | 'right' | 'center' | 'alternate';

export interface TimelineContextValue {
    mode?: ModeType;
    sum?: number
}

const Context = React.createContext<TimelineContextValue>(null);

export default Context;