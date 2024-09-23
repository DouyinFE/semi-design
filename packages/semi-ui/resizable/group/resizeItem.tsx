import React, { createRef, ReactNode, useContext } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { ResizeItemFoundation, ResizeItemAdapter } from '@douyinfe/semi-foundation/resizable/foundation';
import { cssClasses } from '@douyinfe/semi-foundation/resizable/constants';
import BaseComponent from '../../_base/baseComponent';
import { ResizeCallback, ResizeStartCallback } from '@douyinfe/semi-foundation/resizable/singleConstants';
import { ResizeContext, ResizeContextProps } from './resizeContext';
import { noop } from 'lodash';

const prefixCls = cssClasses.PREFIX;

export interface ResizeItemProps {
    style?: React.CSSProperties;
    className?: string;
    min?: string ;
    max?: string;
    children?: React.ReactNode;
    onResizeStart?: ResizeStartCallback;
    onChange?: ResizeCallback;
    onResizeEnd?: ResizeCallback;
    defaultSize?: string
}

export interface ResizeItemState {
}

class ResizeItem extends BaseComponent<ResizeItemProps, ResizeItemState> {
    static propTypes = {
        style: PropTypes.object,
        className: PropTypes.string,
        min: PropTypes.string,
        max: PropTypes.string,
        children: PropTypes.object,
        onResizeStart: PropTypes.func,
        onChange: PropTypes.func,
        onResizeEnd: PropTypes.func,
        defaultSize: PropTypes.string,
    };

    static defaultProps: Partial<ResizeItemProps> = {
        onResizeStart: noop,
        onChange: noop,
        onResizeEnd: noop,
    };

    constructor(props: ResizeItemProps) {
        super(props);
        this.itemRef = createRef<HTMLDivElement | null>();
        this.foundation = new ResizeItemFoundation(this.adapter);
        this.state = {
            isResizing: false,
        };

    }

    componentDidMount() {
        this.foundation.init();
        const { min, max, onResizeStart, onChange, onResizeEnd, defaultSize } = this.props;
        this.itemIndex = this.context.registerItem(this.itemRef, min, max, defaultSize, onResizeStart, onChange, onResizeEnd);
    }

    componentDidUpdate(_prevProps: ResizeItemProps) {
    }

    componentWillUnmount() {
        this.foundation.destroy();
    }

    get adapter(): ResizeItemAdapter<ResizeItemProps, ResizeItemState> {
        return {
            ...super.adapter,
            getItemRef: () => this.itemRef?.current,
            getItemIndex: () => this.itemIndex,
        };
    }
    static contextType = ResizeContext;
    context: ResizeContextProps;
    itemRef: React.RefObject<HTMLDivElement | null>;
    itemIndex: number;

    render() {
        const style: React.CSSProperties = {
            ...this.props.style,
            ...this.foundation.sizeStyle,
        };

        return (
            <div
                style={style}
                className={classNames(this.props.className, prefixCls + '-item')}
                ref={this.itemRef}
            >
                {this.props.children}
            </div>
        );
    }
}


export default ResizeItem;
