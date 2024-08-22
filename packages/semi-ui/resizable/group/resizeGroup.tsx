import React, { createRef, ReactNode } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { ResizeGroupFoundation, ResizeGroupAdapter } from '@douyinfe/semi-foundation/resizable/foundation';
import { Direction, GroupOnLayout, GroupStorage } from '@douyinfe/semi-foundation/resizable/groupConstants';


import { cssClasses } from '@douyinfe/semi-foundation/resizable/constants';

import BaseComponent from '../../_base/baseComponent';

const prefixCls = cssClasses.PREFIX;

export interface ResizeGroupProps {
    autoSaveId?: string | null;
    className?: string;
    direction: Direction;
    id?: string | null;
    keyboardResizeBy?: number | null;
    onLayout?: GroupOnLayout | null;
    storage?: GroupStorage;
    style?: React.CSSProperties;
    tagName?: keyof HTMLElementTagNameMap
}

export interface ResizeGroupState {
}

class ResizeGroup extends BaseComponent<ResizeGroupProps, ResizeGroupState> {
    static propTypes = {
    };

    static defaultProps: Partial<ResizeGroupProps> = {
    };

    constructor(props: ResizeGroupProps) {
        super(props);
        this.state = {
        };
        this.foundation = new ResizeGroupFoundation(this.adapter); 
    }

    componentDidMount() {
        this.foundation.init();
    }

    componentDidUpdate(_prevProps: ResizeGroupProps) {
    }

    componentWillUnmount() {
        this.foundation.destroy();
    }

    get adapter(): ResizeGroupAdapter<ResizeGroupProps, ResizeGroupState> {
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

export default ResizeGroup;
