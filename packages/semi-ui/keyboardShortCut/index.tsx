import React, { ReactNode } from 'react';
import cls from 'classnames';
import PropTypes from 'prop-types';
import KeyboardShortCutFoudation, { KeyboardShortCutAdapter } from '@douyinfe/semi-foundation/keyboardShortCut/foundation';
import { cssClasses, strings } from '@douyinfe/semi-foundation/keyboardShortCut/constants';
import BaseComponent from '../_base/baseComponent';
import { noop } from 'lodash';
// import '@douyinfe/semi-foundation/switch/switch.scss';

export interface KeyboardShortCutProps {
    hotKeys?: KeyboardEvent["key"][];
    content?: string[];
    onClick?: () => {};
    clickable: Boolean;
    render?: () => ReactNode;
    getListenerTarget?: () => HTMLElement;
    className?: string;
    style?: React.CSSProperties;
}

export interface KeyboardShortCutState {

}

class KeyboardShortCut extends BaseComponent<KeyboardShortCutProps, KeyboardShortCutState> {
    static propTypes = {
        hotKeys: PropTypes.arrayOf(PropTypes.string),
        content: PropTypes.arrayOf(PropTypes.string),
        onClick: PropTypes.func,
        clickable :PropTypes.bool,
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
        render: null,
        getListenerTarget: () => document.body,
        className: '',
    };

    constructor(props: KeyboardShortCutProps) {
        super(props);
        this.state = {
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
                return this.props.getListenerTarget()
            },
            getHotKeys: () => {
                return this.props.hotKeys
            }
        };
    }

    
    render() {
        const { hotKeys, content, onClick, clickable, render, getListenerTarget, ...rest } = this.props;
        if (hotKeys?.length !== content?.length) {
            // TODO:error
        }
        if (render !== null) {
            return render()
        }
        return (
            <div onClick={clickable ? onClick : noop}>
                { content === null ? hotKeys.join('+') : content.join('+') }
            </div>
        ) 
    }
}

export default KeyboardShortCut;
