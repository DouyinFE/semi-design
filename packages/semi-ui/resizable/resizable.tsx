import React, { KeyboardEvent, ReactNode, useRef } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import ResizableFoudation, { ResizableAdapter } from '@douyinfe/semi-foundation/resizable/foundation';

import { cssClasses, strings } from '@douyinfe/semi-foundation/resizable/constants';
import BaseComponent from '../_base/baseComponent';
import { noop } from 'lodash';

const prefixCls = cssClasses.PREFIX;

export interface ResizableProps {
    children?: ReactNode | Array<ReactNode>;
    className?: string;
    disabled?: boolean;
    style?: React.CSSProperties
}

export interface ResizableState {
    direction: null | string // | 's' | 'e' | 'n' | 'w' | 'se' | 'ne' | 'sw' | 'nw'
}

class Resizable extends BaseComponent<ResizableProps, ResizableState> {
    static propTypes = {
        children: PropTypes.node,
        className: PropTypes.string,
        disabled: PropTypes.bool,
        style: PropTypes.object,
    };

    static defaultProps: Partial<ResizableProps> = {
    };

    constructor(props: ResizableProps) {
        super(props);
        this.state = {
            direction: 'a'
        };
        this.componentRef = React.createRef();
        this.foundation = new ResizableFoudation(this.adapter);
    }

    componentDidMount() {
        this.foundation.init();
        
    }

    componentDidUpdate(_prevProps: ResizableProps) {
        
    }

    componentWillUnmount() {
        this.foundation.destroy();
    }

    componentRef: React.RefObject<HTMLDivElement>;
    get adapter(): ResizableAdapter<ResizableProps, ResizableState> {
        return {
            ...super.adapter,
            getComponent: () => {
                return this.componentRef.current;
            },
        };
    }

    render() {
        const { children, style } = this.props;
        return (
            <div ref={this.componentRef} style={style}>
                { children }
            </div>
        ); 
    }
}

export default Resizable;
