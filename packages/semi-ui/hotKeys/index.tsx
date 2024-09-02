import React, { ReactNode } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import HotKeysFoudation, { HotKeysAdapter } from '@douyinfe/semi-foundation/hotKeys/foundation';
import { cssClasses, Keys } from '@douyinfe/semi-foundation/hotKeys/constants';
import BaseComponent from '../_base/baseComponent';
import { noop } from 'lodash';
import '@douyinfe/semi-foundation/hotKeys/hotKeys.scss';

const prefixCls = cssClasses.PREFIX;

export { Keys };
export interface HotKeysProps {
    hotKeys?: KeyboardEvent["key"][];
    content?: string[];
    onClick?: () => void;
    clickable?: boolean;
    disabled?: boolean;
    render?: () => ReactNode | ReactNode;
    getListenerTarget?: () => HTMLElement;
    className?: string;
    style?: React.CSSProperties
}

export interface HotKeysState {
    disabled: boolean
}

class HotKeys extends BaseComponent<HotKeysProps, HotKeysState> {
    static propTypes = {
        hotKeys: PropTypes.arrayOf(PropTypes.string),
        content: PropTypes.arrayOf(PropTypes.string),
        onClick: PropTypes.func,
        clickable: PropTypes.bool,
        disabled: PropTypes.bool,
        render: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
        getListenerTarget: PropTypes.func,
        className: PropTypes.string,
        style: PropTypes.object,
    };

    static defaultProps: Partial<HotKeysProps> = {
        hotKeys: null,
        content: null,
        onClick: noop,
        clickable: false,
        disabled: false,
        render: undefined,
        getListenerTarget: () => document.body,
        className: '',
        style: null,
    };

    constructor(props: HotKeysProps) {
        super(props);
        this.state = {
            disabled: false
        };
        this.foundation = new HotKeysFoudation(this.adapter);
    }

    componentDidMount() {
        this.foundation.init();
    }

    componentDidUpdate(_prevProps: HotKeysProps) {
    }

    componentWillUnmount() {
        this.foundation.destroy();
    }

    get adapter(): HotKeysAdapter<HotKeysProps, HotKeysState> {
        return {
            ...super.adapter,
            notifyClick: () => {
                if (this.props.onClick) {
                    this.props.onClick();
                }
            },
            getListenerTarget: () => {
                if (this.props.getListenerTarget) {
                    return this.props.getListenerTarget();
                }
                return document.body;
            },
        };
    }


    render() {
        const { hotKeys, content, onClick, clickable, disabled, render, getListenerTarget, className, style, ...rest } = this.props;
 
        if (typeof render !== 'undefined') {
            if (render === null || (typeof render === 'function' && render() === null)) {
                return null;
            }
            return (
                <div 
                    onClick={clickable ? onClick : noop}
                    className={classNames(prefixCls, className)}
                    style={style}>
                    { typeof render === 'function' ? render() : render }
                </div>
            );
        }
        const renderContent = content ?? hotKeys;

        return (
            <div
                onClick={clickable ? onClick : noop}
                className={classNames(prefixCls, className)}
                style={style}
            >
                {renderContent.map((key: KeyboardEvent["key"], index) => {
                    return index === 0 ?
                        (<span key={index}>
                            <span className={prefixCls + '-content'}>{key}</span>
                        </span>)
                        :
                        (<span key={index}>
                            <span className={prefixCls + '-split'}>+</span>
                            <span className={prefixCls + '-content'}>{key}</span>
                        </span>);
                })}
            </div>
        );
    }
}

export default HotKeys;
