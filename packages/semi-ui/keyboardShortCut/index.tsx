import React, { ReactNode } from 'react';
import cls from 'classnames';
import PropTypes from 'prop-types';
import KeyboardShortCutFoudation, { KeyboardShortCutAdapter } from '@douyinfe/semi-foundation/keyboardShortCut/foundation';
// import { cssClasses, strings } from '@douyinfe/semi-foundation/switch/constants';
import BaseComponent from '../_base/baseComponent';
// import '@douyinfe/semi-foundation/switch/switch.scss';

export interface KeyboardShortCutProps {
    hotKeys?: string[];
    onClick?: () => {};
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
        onClick: PropTypes.func,
        render: PropTypes.func,
        getListenerTarget: PropTypes.func,
        className: PropTypes.string,
        style: PropTypes.object,
    };

    static defaultProps: Partial<KeyboardShortCutProps> = {
        hotKeys: null,
        onClick: null,
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
        const { hotKeys, onClick, render, getListenerTarget, ...rest } = this.props;
        if (render !== null) {
            return render()
        }
        return (
            <div onClick={onClick}>
                { hotKeys.join('+') }
            </div>
        );
    }
}

export default KeyboardShortCut;
