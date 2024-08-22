import React, { createRef, ReactNode } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { ResizeHandlerFoundation, ResizeHandlerAdapter } from '@douyinfe/semi-foundation/resizable/foundation';

import { cssClasses } from '@douyinfe/semi-foundation/resizable/constants';

import BaseComponent from '../../_base/baseComponent';

const prefixCls = cssClasses.PREFIX;

export interface ResizeHandlerProps {

}

export interface ResizeHandlerState {
}

class ResizeHandler extends BaseComponent<ResizeHandlerProps, ResizeHandlerState> {
    static propTypes = {
    
    };

    static defaultProps: Partial<ResizeHandlerProps> = {
    };

    constructor(props: ResizeHandlerProps) {
        super(props);
        this.state = {
        };
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
        };
    }

    render() {
        return (
            <div>
            </div>
        ); 
    }
}

export default ResizeHandler;
