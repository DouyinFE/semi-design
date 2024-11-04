import React, { createRef } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { ResizeItemFoundation, ResizeItemAdapter } from '@douyinfe/semi-foundation/resizable/foundation';
import { cssClasses } from '@douyinfe/semi-foundation/resizable/constants';
import BaseComponent from '../../_base/baseComponent';
import { ResizeCallback, ResizeStartCallback } from '@douyinfe/semi-foundation/resizable/types';
import { ResizeContext, ResizeContextProps } from './resizeContext';
import { noop } from 'lodash';

const prefixCls = cssClasses.PREFIX;

export interface ResizeItemProps {
    style?: React.CSSProperties;
    className?: string;
    min?: string;
    max?: string;
    children?: React.ReactNode;
    onResizeStart?: ResizeStartCallback;
    onChange?: ResizeCallback;
    onResizeEnd?: ResizeCallback;
    defaultSize?: string | number
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
        defaultSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
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
        this.itemIndex = -1;
    }

    componentDidMount() {
        this.foundation.init();
        const { min, max, onResizeStart, onChange, onResizeEnd, defaultSize } = this.props;
        if (this.itemIndex === -1) {
            this.itemIndex = this.context.registerItem(this.itemRef, min, max, defaultSize, onResizeStart, onChange, onResizeEnd);
        }
    }

    componentDidUpdate(_prevProps: ResizeItemProps) {
        // console.log('item.context', this.context.direction)
    }

    componentWillUnmount() {
        this.foundation.destroy();
    }

    get adapter(): ResizeItemAdapter<ResizeItemProps, ResizeItemState> {
        return {
            ...super.adapter,
        };
    }
    static contextType = ResizeContext;
    context: ResizeContextProps;
    itemRef: React.RefObject<HTMLDivElement | null>;
    itemIndex: number;

    render() {
        const style: React.CSSProperties = {
            ...this.props.style,
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
