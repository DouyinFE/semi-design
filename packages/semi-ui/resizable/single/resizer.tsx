import React, { createRef, ReactNode } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { ResizerFoundation, ResizerAdapter } from '@douyinfe/semi-foundation/resizable/foundation';

import { cssClasses, styles, Direction, OnStartCallback } from '@douyinfe/semi-foundation/resizable/constants';
import BaseComponent from '../../_base/baseComponent';
import { noop } from 'lodash';

const prefixCls = cssClasses.PREFIX;

export interface ResizerProps {
    children?: ReactNode;
    direction?: Direction;
    onResizeStart?: OnStartCallback;
    className?: string;
    disabled?: boolean;
    style?: React.CSSProperties
}

export interface ResizerState {
    direction: Direction
}

class Resizer extends BaseComponent<ResizerProps, ResizerState> {
    static propTypes = {
        children: PropTypes.node,
        direction: PropTypes.string,
        onResizeStart: PropTypes.func,
        className: PropTypes.string,
        disabled: PropTypes.bool,
        style: PropTypes.object,
    };

    static defaultProps: Partial<ResizerProps> = {
    };

    constructor(props: ResizerProps) {
        super(props);
        this.state = {
            direction: this.props.direction
        };
        this.resizerRef = createRef();
        this.foundation = new ResizerFoundation(this.adapter);
        
    }

    componentDidMount() {
        this.foundation.init();
    }

    componentDidUpdate(_prevProps: ResizerProps) {
    }

    componentWillUnmount() {
        this.foundation.destroy();
    }

    get adapter(): ResizerAdapter<ResizerProps, ResizerState> {
        return {
            ...super.adapter,
            getResizer: this.getResizer,
        };
    }

    getResizer: () => HTMLElement = () => {
        return this.resizerRef.current;
    }

    resizerRef: React.RefObject<HTMLDivElement>
    render() {
        const { children, style, className } = this.props;
        return (
            <div 
                className={classNames(className, prefixCls)}
                style={{
                    position: 'absolute',
                    userSelect: 'none',
                    ...styles[this.props.direction],
                    ...style
                }} 
                ref={this.resizerRef}
            >
                { children }
            </div>
        ); 
    }
}

export default Resizer;
