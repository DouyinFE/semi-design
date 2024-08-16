import React, { KeyboardEvent, ReactNode } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import KeyboardShortCutFoudation, { KeyboardShortCutAdapter } from '@douyinfe/semi-foundation/keyboardShortCut/foundation';
import { cssClasses, strings } from '@douyinfe/semi-foundation/keyboardShortCut/constants';
import BaseComponent from '../_base/baseComponent';
import { noop } from 'lodash';
import '@douyinfe/semi-foundation/keyboardShortCut/keyboardShortCut.scss';

const prefixCls = cssClasses.PREFIX;

export interface KeyboardShortCutProps {
    hotKeys?: KeyboardEvent["key"][];
    content?: string[];
    onClick?: () => void;
    clickable?: boolean;
    disabled?: boolean;
    render?: () => ReactNode;
    getListenerTarget?: () => HTMLElement;
    className?: string;
    style?: React.CSSProperties
}

export interface KeyboardShortCutState {
    disabled: boolean
}

class KeyboardShortCut extends BaseComponent<KeyboardShortCutProps, KeyboardShortCutState> {
    static propTypes = {
        hotKeys: PropTypes.arrayOf(PropTypes.string),
        content: PropTypes.arrayOf(PropTypes.string),
        onClick: PropTypes.func,
        clickable: PropTypes.bool,
        disabled: PropTypes.bool,
        render: PropTypes.func,
        getListenerTarget: PropTypes.func,
        className: PropTypes.string,
        style: PropTypes.object,
    };

    static defaultProps: Partial<KeyboardShortCutProps> = {
        hotKeys: null,
        content: null,
        onClick: null,
        clickable: false,
        disabled: false,
        render: null,
        getListenerTarget: () => document.body,
        className: '',
        style: null,
    };

    constructor(props: KeyboardShortCutProps) {
        super(props);
        this.state = {
            disabled: false
        };
        this.foundation = new KeyboardShortCutFoudation(this.adapter);
    }

    componentDidMount() {
        this.foundation.init();
    }

    componentDidUpdate(_prevProps: KeyboardShortCutProps) {
        
    }

    componentWillUnmount() {
        this.foundation.destroy();
    }

    get adapter(): KeyboardShortCutAdapter<KeyboardShortCutProps, KeyboardShortCutState> {
        return {
            ...super.adapter,
            notifyClick: () => {
                this.props.onClick();
            },
            getListenerTarget: () => {
                return this.props.getListenerTarget();
            },
            getHotKeys: () => {
                return this.props.hotKeys;
            }
        };
    }

    
    render() {
        const { hotKeys, content, onClick, clickable, disabled, render, getListenerTarget, className, style, ...rest } = this.props;
        
        if (render !== null) {
            return render();
        }
        const renderContent = content === null ? hotKeys : content;
        
        return (
            <div 
                onClick={clickable ? onClick : noop}
                className={classNames(prefixCls, className)}
                style={style}
            >
                { renderContent.map((key: KeyboardEvent["key"], index) => {
                    return index === 0 ? 
                        (<span key={index}>
                            <span className={prefixCls + '-content'}>{key}</span>
                        </span>)
                        : 
                        (<span key={index}>
                            <span className={prefixCls + '-split'}>+</span>
                            <span className={prefixCls + '-content'}>{key}</span>
                        </span>);
                }) }
            </div>
        ); 
    }
}

export default KeyboardShortCut;
