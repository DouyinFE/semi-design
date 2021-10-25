import React, { Component } from 'react';
import log from '@douyinfe/semi-foundation/utils/log';
import { DefaultAdapter } from '@douyinfe/semi-foundation/base/foundation';
import { VALIDATE_STATUS } from '@douyinfe/semi-foundation/base/constants';
import { ArrayElement } from './base';

const { hasOwnProperty } = Object.prototype;

export type ValidateStatus = ArrayElement<typeof VALIDATE_STATUS>;

export interface BaseProps {
    style?: React.CSSProperties;
    className?: string;
}

// eslint-disable-next-line
export default class BaseComponent<P extends BaseProps = {}, S = {}> extends Component<P, S> {
    static propTypes = {};

    static defaultProps = {};

    cache: any;
    foundation: any;

    constructor(props: P) {
        super(props);
        this.cache = {};
        this.foundation = null;
    }

    componentDidMount(): void {
        this.foundation && typeof this.foundation.init === 'function' && this.foundation.init();
    }

    componentWillUnmount(): void {
        this.foundation && typeof this.foundation.destroy === 'function' && this.foundation.destroy();
        this.cache = {};
    }

    get adapter(): DefaultAdapter<P, S> { // eslint-disable-line
        return {
            getContext: key => { // eslint-disable-line
                if (this.context && key) {
                    return this.context[key];
                }
            },
            getContexts: () => this.context, // eslint-disable-line
            getProp: key => this.props[key], // eslint-disable-line
            // return all props
            getProps: () => this.props, // eslint-disable-line
            getState: key => this.state[key], // eslint-disable-line
            getStates: () => this.state, // eslint-disable-line
            setState: (states, cb) => this.setState({ ...states }, cb), // eslint-disable-line
            getCache: key => key && this.cache[key], // eslint-disable-line
            getCaches: () => this.cache, // eslint-disable-line
            setCache: (key, value) => key && (this.cache[key] = value), // eslint-disable-line
            stopPropagation: e => { // eslint-disable-line
                try {
                    e.stopPropagation();
                    e.nativeEvent && e.nativeEvent.stopImmediatePropagation();
                } catch (error) {

                }
            }
        };
    }

    // eslint-disable-next-line
    isControlled = (key: any) => Boolean(key && this.props && typeof this.props === 'object' && hasOwnProperty.call(this.props, key));

    log(text: string, ...rest: any): any {
        return log(text, ...rest);
    }
}
