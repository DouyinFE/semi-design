import React from 'react';
import BaseComponent from '../_base/baseComponent';
import cls from 'classnames';
import PropTypes from 'prop-types';
import { cssClasses } from '@douyinfe/semi-foundation/backtop/constants';
import BackTopFoundation, { BackTopAdapter } from '@douyinfe/semi-foundation/backtop/foundation';

import '@douyinfe/semi-foundation/backtop/backtop.scss';
import IconButton from '../iconButton';
import { IconChevronUp } from '@douyinfe/semi-icons';

const prefixCls = cssClasses.PREFIX;

const getDefaultTarget = () => window;

export interface BackTopProps {
    target?: () => any;
    visibilityHeight?: number;
    duration?: number;
    onClick?: (e: React.MouseEvent) => void;
    style?: React.CSSProperties;
    className?: string;
    children?: React.ReactNode | undefined;
}

export interface BackTopState {
    visible?: boolean;
}


export default class BackTop extends BaseComponent<BackTopProps, BackTopState> {
    static defaultProps = {
        visibilityHeight: 400,
        target: getDefaultTarget,
        duration: 450,
    };

    static propTypes = {
        target: PropTypes.func,
        visibilityHeight: PropTypes.number,
        duration: PropTypes.number,
        onClick: PropTypes.func,
        style: PropTypes.object,
        className: PropTypes.string,
    };

    constructor(props: BackTopProps) {
        super(props);
        this.state = {
            visible: false
        };
        this.foundation = new BackTopFoundation(this.adapter);
    }

    componentDidMount() {
        this.foundation.init();
    }

    componentWillUnmount() {
        this.foundation.destroy();
    }

    get adapter(): BackTopAdapter {
        return {
            ...super.adapter,
            updateVisible: (visible: boolean) => {
                this.setState({ visible });
            },
            notifyClick: (e: React.MouseEvent) => {
                this.props.onClick && this.props.onClick(e);
            },
            targetIsWindow: (target: any) => target === window,
            isWindowUndefined: () => window === undefined,
            targetScrollToTop: (targetNode: any, scrollTop: number) => {
                if (targetNode === window) {
                    document.body.scrollTop = scrollTop;
                    document.documentElement.scrollTop = scrollTop;
                } else {
                    targetNode.scrollTop = scrollTop;
                }
            }
        };
    }

    handleClick(e: React.MouseEvent<HTMLDivElement>) {
        this.foundation.onClick(e);
    }

    renderDefault() {
        return (
            <IconButton theme="light" icon={<IconChevronUp />} />
        );
    }

    render() {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { children, className, style, onClick, visibilityHeight, target, ...others } = this.props;
        const { visible } = this.state;
        const preCls = cls(
            prefixCls,
            className
        );
        const backtopBtn = children ? children : this.renderDefault();
        const content = visible ? (
            <div
                {...others} 
                className={preCls} 
                style={style} 
                onClick={e => this.handleClick(e)} 
                x-semi-prop="children"
            >
                {backtopBtn}
            </div>
        ) : null;
        return content;
    }
}
