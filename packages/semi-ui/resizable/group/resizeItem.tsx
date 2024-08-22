import React, { createRef, ReactNode } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { ResizeItemFoundation, ResizeItemAdapter } from '@douyinfe/semi-foundation/resizable/foundation';

import { cssClasses } from '@douyinfe/semi-foundation/resizable/constants';

import BaseComponent from '../../_base/baseComponent';

const prefixCls = cssClasses.PREFIX;

export interface ResizeItemProps {

}

export interface ResizeItemState {
}

class ResizeItem extends BaseComponent<ResizeItemProps, ResizeItemState> {
    static propTypes = {
    };

    static defaultProps: Partial<ResizeItemProps> = {
    };

    constructor(props: ResizeItemProps) {
        super(props);
        this.state = {
        };
        this.foundation = new ResizeItemFoundation(this.adapter); 
    }

    componentDidMount() {
        this.foundation.init();
    }

    componentDidUpdate(_prevProps: ResizeItemProps) {
    }

    componentWillUnmount() {
        this.foundation.destroy();
    }

    get adapter(): ResizeItemAdapter<ResizeItemProps, ResizeItemState> {
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

export default ResizeItem;
