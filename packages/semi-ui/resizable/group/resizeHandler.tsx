import React, { Children, createRef, ReactNode, useContext } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { ResizeHandlerFoundation, ResizeHandlerAdapter } from '@douyinfe/semi-foundation/resizable/foundation';
import { cssClasses } from '@douyinfe/semi-foundation/resizable/constants';
import { Direction, HandlerCallback } from '@douyinfe/semi-foundation/resizable/singleConstants';
import { directionStyles } from '@douyinfe/semi-foundation/resizable/groupConstants';
import BaseComponent from '../../_base/baseComponent';
import { ResizeContext, ResizeContextProps } from './resizeContext';
import { IconHandle } from '@douyinfe/semi-icons';


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
        };
        this.handlerRef = createRef();
        this.foundation = new ResizeHandlerFoundation(this.adapter);
    }

    componentDidMount() {
        this.foundation.init();
        this.handlerIndex = this.context.registerHandler(this.handlerRef);
    }

    componentDidUpdate(_prevProps: ResizeHandlerProps) {
    }

    componentWillUnmount() {
        this.foundation.destroy();
    }

    get adapter(): ResizeHandlerAdapter<ResizeHandlerProps, ResizeHandlerState> {
        return {
            ...super.adapter,
            getHandler: this.getHandler,
            getHandlerIndex: () => this.handlerIndex,
        };
    }

    getHandler: () => HTMLElement = () => {
        return this.handlerRef.current;
    }

    static contextType = ResizeContext;
    context: ResizeContextProps;
    handlerRef: React.RefObject<HTMLDivElement>
    handlerIndex: number;

    render() {
        
        const { style, className, children } = this.props;
        return (
            <div
                className={classNames(className, prefixCls + '-handler')}
                style={{
                    ...directionStyles[this.context.direction],
                    ...style
                }}
                ref={this.handlerRef}
            >
                {children ?? <IconHandle size='inherit' style={{
                    rotate: this.context.direction === 'horizontal' ? '0deg' : '90deg',
                }}/>}
            </div>
        );
    }
}

export default ResizeHandler;
