import React, { ReactNode } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import HotKeysFoudation, { HotKeysAdapter } from '@douyinfe/semi-foundation/hotKeys/foundation';
import { cssClasses } from '@douyinfe/semi-foundation/hotKeys/constants';
import BaseComponent from '../_base/baseComponent';
import { noop } from 'lodash';
import '@douyinfe/semi-foundation/hotKeys/hotKeys.scss';
export { Keys } from '@douyinfe/semi-foundation/hotKeys/constants';
const prefixCls = cssClasses.PREFIX;

export interface HotKeysProps {
    blockDefault?: boolean;
    hotKeys?: KeyboardEvent["key"][];
    content?: string[];
    onClick?: () => void;
    onHotKey?: () => void;
    mergeMetaCtrl?: boolean;
    render?: () => ReactNode | ReactNode;
    getListenerTarget?: () => HTMLElement;
    className?: string;
    style?: React.CSSProperties
}

export interface HotKeysState {
}

class HotKeys extends BaseComponent<HotKeysProps, HotKeysState> {
    static propTypes = {
        blockDefalut: PropTypes.bool,
        hotKeys: PropTypes.arrayOf(PropTypes.string),
        content: PropTypes.arrayOf(PropTypes.string),
        onClick: PropTypes.func,
        onHotKey: PropTypes.func,
        mergeMetaCtrl: PropTypes.bool,
        render: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
        getListenerTarget: PropTypes.func,
        className: PropTypes.string,
        style: PropTypes.object,
    };

    static defaultProps: Partial<HotKeysProps> = {
        blockDefault: false,
        hotKeys: null,
        content: null,
        onClick: noop,
        onHotKey: noop,
        mergeMetaCtrl: false,
        render: undefined,
        getListenerTarget: () => document.body,
        className: '',
        style: null,
    };

    constructor(props: HotKeysProps) {
        super(props);
        this.state = {
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
            notifyHotKey: () => {
                if (this.props.onHotKey && typeof this.props.onHotKey === 'function') {
                    this.props.onHotKey();
                }
            },
            getListenerTarget: () => {
                if (this.props.getListenerTarget && typeof this.props.getListenerTarget === 'function') {
                    return this.props.getListenerTarget();
                }
                return document.body;
            },
        };
    }


    render() {
        const { hotKeys, content, onClick, render, getListenerTarget, className, style, ...rest } = this.props;
 
        if (typeof render !== 'undefined') {
            if (render === null || (typeof render === 'function' && render() === null)) {
                return null;
            }
            return (
                <div 
                    onClick={onClick}
                    className={classNames(prefixCls, className)}
                    style={style}
                    {...this.getDataAttr(rest)}    
                >
                    { typeof render === 'function' ? render() : render }
                </div>
            );
        }
        const renderContent = content ?? hotKeys;

        return (
            <div
                onClick={onClick}
                className={classNames(prefixCls, className)}
                style={style}
                {...this.getDataAttr(rest)}  
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
