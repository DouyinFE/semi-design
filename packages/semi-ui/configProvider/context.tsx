import React from 'react';
import { Locale } from '../locale/interface';
import { ResponsiveMap, BreakpointScreens, OnBreakpointScreensCallback, OnBreakpointChangeCallback, Breakpoint } from './responsiveTypes';

export interface ContextValue {
    direction?: 'ltr' | 'rtl';
    timeZone?: string | number;
    locale?: Locale;
    children?: React.ReactNode;
    getPopupContainer?(): HTMLElement;
    /**
     * Enable responsive observing in ConfigProvider (for consumers to know capability)
     */
    responsiveObserve?: boolean;
    /**
     * Custom responsive map configuration
     */
    responsiveMap?: ResponsiveMap;
    /**
     * Subscribe to breakpoint changes
     * @param callback Function to call when breakpoint changes
     * @returns Unsubscribe function
     */
    onBreakpoint?: {
        (callback: OnBreakpointScreensCallback): () => void;
        (breakpoints: Breakpoint[], callback: OnBreakpointChangeCallback): () => void;
    };
    /**
     * Current breakpoint screens state (read-only)
     */
    screens?: BreakpointScreens;
}

const ConfigContext = React.createContext<ContextValue>({});

export default ConfigContext;
