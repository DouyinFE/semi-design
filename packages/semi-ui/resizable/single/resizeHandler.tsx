import React, { createRef, ReactNode } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { ResizeHandlerFoundation, ResizeHandlerAdapter } from '@douyinfe/semi-foundation/resizable/foundation';

import { cssClasses } from '@douyinfe/semi-foundation/resizable/constants';
import { directionStyles, Direction, HandlerCallback } from '@douyinfe/semi-foundation/resizable/singleConstants';
import BaseComponent from '../../_base/baseComponent';

const prefixCls = cssClasses.PREFIX;

export interface ResizeHandlerProps {
    children?: ReactNode;
    direction?: Direction;
    onResizeStart?: HandlerCallback;
    className?: string;
    disabled?: boolean;
    style?: React.CSSProperties
}

export interface ResizeHandlerState {
    direction: Direction
}

class ResizeHandler extends BaseComponent<ResizeHandlerProps, ResizeHandlerState> {
    static propTypes = {
        children: PropTypes.node,
        direction: PropTypes.string,
        onResizeStart: PropTypes.func,
        className: PropTypes.string,
        disabled: PropTypes.bool,
        style: PropTypes.object,
    };

    static defaultProps: Partial<ResizeHandlerProps> = {
    };

    constructor(props: ResizeHandlerProps) {
        super(props);
        this.state = {
            direction: this.props.direction
        };
        this.resizeHandlerRef = createRef();
        this.foundation = new ResizeHandlerFoundation(this.adapter); 
    }

    componentDidMount() {
        this.foundation.init();
    }

    componentDidUpdate(_prevProps: ResizeHandlerProps) {
    }

    componentWillUnmount() {
        this.foundation.destroy();
    }

    get adapter(): ResizeHandlerAdapter<ResizeHandlerProps, ResizeHandlerState> {
        return {
            ...super.adapter,
            getResizeHandler: this.getResizeHandler,
        };
    }

    getResizeHandler: () => HTMLElement = () => {
        return this.resizeHandlerRef.current;
    }

    resizeHandlerRef: React.RefObject<HTMLDivElement>
    render() {
        const { children, style, className } = this.props;
        return (
            <div 
                className={classNames(className, prefixCls)}
                style={{
                    position: 'absolute',
                    userSelect: 'none',
                    ...directionStyles[this.props.direction],
                    ...style
                }} 
                ref={this.resizeHandlerRef}
            >
                { children }
            </div>
        ); 
    }
}

export default ResizeHandler;
