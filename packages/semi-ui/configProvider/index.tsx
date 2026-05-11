import React from 'react';
import PropTypes from 'prop-types';
import { BASE_CLASS_PREFIX } from '@douyinfe/semi-foundation/base/constants';
import warning from '@douyinfe/semi-foundation/utils/warning';
import DefaultLocale from '../locale/source/zh_CN';
import Context, { ContextValue } from './context';
import { registerMediaQuery } from '../_utils';
import {
    ResponsiveMap,
    BreakpointScreens,
    OnBreakpointScreensCallback,
    OnBreakpointChangeCallback,
    Breakpoint,
} from './responsiveTypes';

export interface ConfigProviderProps extends Omit<ContextValue, 'onBreakpoint' | 'screens'> {
    /**
     * Custom responsive map configuration
     * If not provided, default responsive map will be used
     */
    responsiveMap?: ResponsiveMap;

    /**
     * Enable responsive observing in ConfigProvider.
     *
     * - When false (default): ConfigProvider will not register any matchMedia listeners.
     * - When true: listeners will be registered lazily on first subscription.
     */
    responsiveObserve?: boolean
}

interface ConfigProviderState {
    screens: BreakpointScreens
}

/**
 * Default responsive map configuration
 * Can be accessed via ConfigProvider.defaultResponsiveMap
 */
export const defaultResponsiveMap: ResponsiveMap = {
    xs: '(max-width: 575px)',
    sm: '(min-width: 576px)',
    md: '(min-width: 768px)',
    lg: '(min-width: 992px)',
    xl: '(min-width: 1200px)',
    xxl: '(min-width: 1600px)',
};

export const ConfigConsumer = Context.Consumer;

export default class ConfigProvider extends React.Component<ConfigProviderProps, ConfigProviderState> {

    static propTypes = {
        locale: PropTypes.object,
        timeZone: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        getPopupContainer: PropTypes.func,
        direction: PropTypes.oneOf(['ltr', 'rtl']),
        responsiveMap: PropTypes.object,
        responsiveObserve: PropTypes.bool,
    };

    static defaultProps = {
        locale: DefaultLocale,
        direction: 'ltr',
        responsiveObserve: false,
    };

    /**
     * Default responsive map - static property for backward compatibility
     */
    static defaultResponsiveMap = defaultResponsiveMap;

    private unRegisters: Array<() => void> = [];
    private hasRegisteredMediaQueries = false;
    private hasWarnedResponsiveObserve = false;
    private screensListeners: Set<OnBreakpointScreensCallback> = new Set();
    private changeListeners: Set<{
        breakpoints?: Breakpoint[];
        callback: OnBreakpointChangeCallback
    }> = new Set();
    /**
     * Synchronous source of truth for current breakpoint matches.
     * `setState` is async, so reading `this.state.screens` immediately after
     * registering listeners returns stale values. Subscriber callbacks read
     * from this ref to always get the freshest snapshot.
     */
    private currentScreensRef: BreakpointScreens | null = null;

    constructor(props: ConfigProviderProps) {
        super(props);
        this.state = {
            screens: {
                xs: false,
                sm: false,
                md: false,
                lg: false,
                xl: false,
                xxl: false,
            },
        };
    }

    componentDidMount() {
        // lazy register on demand (first subscription)
    }

    componentDidUpdate(prevProps: ConfigProviderProps) {
        // If toggle switched off, ensure unregister
        if (prevProps.responsiveObserve && !this.props.responsiveObserve) {
            this.unregisterMediaQueries();
        }

        // Re-register media queries if responsiveMap changes (only if already registered)
        if (this.hasRegisteredMediaQueries && prevProps.responsiveMap !== this.props.responsiveMap) {
            this.unregisterMediaQueries();
            this.registerMediaQueries();
        }

        // If toggle switched on and there are existing subscriptions, ensure register
        if (!prevProps.responsiveObserve && this.props.responsiveObserve) {
            this.ensureMediaQueriesRegistered();
        }
    }

    componentWillUnmount() {
        this.unregisterMediaQueries();
        this.screensListeners.clear();
        this.changeListeners.clear();
    }

    private ensureMediaQueriesRegistered = () => {
        if (!this.props.responsiveObserve) {
            if (!this.hasWarnedResponsiveObserve) {
                this.hasWarnedResponsiveObserve = true;
                const shouldWarn = typeof process !== 'undefined' && !!process.env && process.env.NODE_ENV !== 'production';
                warning(
                    shouldWarn,
                    '[Semi] ConfigProvider responsive observing is disabled by default. ' +
                    'Set <ConfigProvider responsiveObserve> to enable breakpoint subscriptions.'
                );
            }
            return;
        }
        const hasAnySubscriber = this.screensListeners.size > 0 || this.changeListeners.size > 0;
        if (!hasAnySubscriber) {
            return;
        }
        if (this.hasRegisteredMediaQueries) {
            return;
        }
        this.registerMediaQueries();
    };

    /**
     * Register media query listeners.
     *
     * To avoid stale-state bug in immediate subscriber callbacks, we
     * synchronously read all `matchMedia(...).matches` once *before* attaching
     * the change listeners, write the result to both `currentScreensRef` and
     * `state.screens` in a single batched setState, and only then start
     * tracking changes (with `callInInit: false` so we don't double-fire).
     */
    private registerMediaQueries = () => {
        if (this.hasRegisteredMediaQueries) {
            return;
        }
        const responsiveMap = this.props.responsiveMap || defaultResponsiveMap;
        const breakpointKeys = Object.keys(responsiveMap) as Array<keyof ResponsiveMap>;

        const initialScreens: BreakpointScreens = {
            xs: false, sm: false, md: false, lg: false, xl: false, xxl: false,
        };
        if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
            breakpointKeys.forEach(screen => {
                initialScreens[screen] = window.matchMedia(responsiveMap[screen]).matches;
            });
        }
        this.currentScreensRef = initialScreens;

        this.unRegisters = breakpointKeys.map(screen =>
            registerMediaQuery(responsiveMap[screen], {
                match: () => {
                    this.updateScreen(screen, true);
                },
                unmatch: () => {
                    this.updateScreen(screen, false);
                },
                callInInit: false,
            })
        );

        this.hasRegisteredMediaQueries = true;
        this.setState({ screens: initialScreens });
    };

    /**
     * Unregister all media query listeners
     */
    private unregisterMediaQueries = () => {
        this.unRegisters.forEach(unRegister => unRegister());
        this.unRegisters = [];

        this.hasRegisteredMediaQueries = false;
        this.currentScreensRef = null;
    };

    /**
     * Update screen state and notify listeners
     */
    private updateScreen = (screen: keyof ResponsiveMap, matches: boolean) => {
        if (this.currentScreensRef && this.currentScreensRef[screen] !== matches) {
            this.currentScreensRef = { ...this.currentScreensRef, [screen]: matches };
        }
        this.setState(prevState => {
            if (prevState.screens[screen] === matches) {
                return null;
            }
            return {
                screens: {
                    ...prevState.screens,
                    [screen]: matches,
                },
            };
        }, () => {
            this.notifyListeners(screen as Breakpoint, matches);
        });
    };

    /**
     * Notify all registered listeners
     */
    private notifyListeners = (changedScreen?: Breakpoint, match?: boolean) => {
        const { screens } = this.state;
        // full screens subscriptions
        this.screensListeners.forEach(listener => {
            listener(screens);
        });
        // single change subscriptions
        if (changedScreen != null && match != null) {
            this.changeListeners.forEach(({ breakpoints, callback }) => {
                if (!breakpoints || breakpoints.includes(changedScreen)) {
                    callback(changedScreen, match);
                }
            });
        }
    };

    /**
     * Subscribe to breakpoint changes
     * @param callback Function to call when breakpoint changes
     * @returns Unsubscribe function
     */
    private handleBreakpoint: {
        (callback: OnBreakpointScreensCallback): () => void;
        (breakpoints: Breakpoint[], callback: OnBreakpointChangeCallback): () => void
    } = (arg1: any, arg2?: any) => {
        // onBreakpoint(callback)
        if (typeof arg1 === 'function') {
            const cb: OnBreakpointScreensCallback = arg1;
            this.screensListeners.add(cb);
            this.ensureMediaQueriesRegistered();
            // Read from currentScreensRef so we deliver the freshly-computed
            // matches (set synchronously inside registerMediaQueries) instead
            // of the still-async this.state.screens.
            const initialScreens = this.currentScreensRef ?? this.state.screens;
            cb(initialScreens);
            return () => {
                this.screensListeners.delete(cb);
                if (this.props.responsiveObserve && this.screensListeners.size === 0 && this.changeListeners.size === 0) {
                    this.unregisterMediaQueries();
                }
            };
        }

        // onBreakpoint(breakpoints, callback)
        const breakpoints: Breakpoint[] = Array.isArray(arg1) ? arg1 : undefined;
        const cb: OnBreakpointChangeCallback = arg2;
        const entry = { breakpoints, callback: cb };
        this.changeListeners.add(entry);

        this.ensureMediaQueriesRegistered();

        const initialScreens = this.currentScreensRef ?? this.state.screens;
        if (breakpoints && typeof cb === 'function') {
            breakpoints.forEach(bp => {
                cb(bp, initialScreens[bp]);
            });
        }

        return () => {
            this.changeListeners.delete(entry);
            // if no subscribers remain, unregister to save resources
            if (this.props.responsiveObserve && this.screensListeners.size === 0 && this.changeListeners.size === 0) {
                this.unregisterMediaQueries();
            }
        };
    };

    renderChildren() {
        const { direction, children } = this.props;
        if (direction === 'rtl') {
            return (
                <div className={`${BASE_CLASS_PREFIX}-rtl`}>
                    {children}
                </div>
            );
        }
        return children;
    }

    render() {
        const { children, direction, responsiveMap, ...rest } = this.props;
        const { screens } = this.state;

        return (
            <Context.Provider
                value={{
                    ...rest,
                    direction,
                    // internal values should not be overridden by props
                    responsiveMap: responsiveMap || defaultResponsiveMap,
                    onBreakpoint: this.handleBreakpoint,
                    screens,
                }}
            >
                {this.renderChildren()}
            </Context.Provider>
        );
    }
}

// Export types for external use
export {
    ResponsiveMap,
    BreakpointScreens,
    Breakpoint,
    OnBreakpointScreensCallback,
    OnBreakpointChangeCallback,
} from './responsiveTypes';
