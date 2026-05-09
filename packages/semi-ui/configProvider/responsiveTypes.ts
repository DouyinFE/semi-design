/**
 * Responsive breakpoint types for ConfigProvider
 */

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export interface ResponsiveMap {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
}

export interface BreakpointScreens {
    xs: boolean;
    sm: boolean;
    md: boolean;
    lg: boolean;
    xl: boolean;
    xxl: boolean;
}

/**
 * Subscribe callback: get all breakpoint matches
 */
export type OnBreakpointScreensCallback = (screens: BreakpointScreens) => void;

/**
 * Subscribe callback: get single breakpoint change
 */
export type OnBreakpointChangeCallback = (screen: Breakpoint, match: boolean) => void;

export interface ResponsiveConfig {
    /**
     * Custom responsive map configuration
     */
    responsiveMap?: ResponsiveMap;
    
    /**
     * Subscribe to breakpoint changes
     * @param callback Function to call when breakpoint changes
     * @returns Unsubscribe function
     */
    /**
     * Subscribe to breakpoint changes.
     *
     * Overloads:
     * - onBreakpoint(callback): callback receives full screens map
     * - onBreakpoint(breakpoints, callback): callback receives (screen, match)
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
