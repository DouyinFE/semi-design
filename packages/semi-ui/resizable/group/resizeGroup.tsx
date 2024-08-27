import React, { createContext, createRef, ReactNode, Ref, RefObject } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { ResizeGroupFoundation, ResizeGroupAdapter } from '@douyinfe/semi-foundation/resizable/foundation';
import { cssClasses } from '@douyinfe/semi-foundation/resizable/constants';
import { getItemDirection, getHandlerDirection } from '@douyinfe/semi-foundation/resizable/groupConstants';
import BaseComponent from '../../_base/baseComponent';
import { ResizeContext } from './resizeContext';
import ResizeItem from './resizeItem';
import ResizeHandler from './resizeHandler';

const prefixCls = cssClasses.PREFIX;

export interface ResizeGroupProps {
    children: ReactNode;
    direction: 'horizontal' | 'vertical'
}

export interface ResizeGroupState {
}



class ResizeGroup extends BaseComponent<ResizeGroupProps, ResizeGroupState> {
    static propTypes = {
    };

    static defaultProps: Partial<ResizeGroupProps> = {
        direction: 'vertical'
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

    static contextType = ResizeContext;
    context: ResizeGroupProps;
    childRefs: RefObject<any>[] = [];

    render() {
        const { children, direction } = this.props;
        this.childRefs = [];
        const childrenWithRefs = React.Children.map(children, (child, index) => {
            if (React.isValidElement(child)) {
                const ref = React.createRef();
                this.childRefs.push(ref);
                if (child.type === ResizeItem) {
                    return React.cloneElement(child as React.ReactElement, { ref, boundElement: 'parent' });
                } else if (child.type === ResizeHandler) {
                    const onResizeStart = (e: MouseEvent) => {
                        let [dir_last, dir_next] = getItemDirection(direction);
                        this.childRefs[index - 1].current?.foundation.onResizeStart(e, dir_last);
                        this.childRefs[index + 1].current?.foundation.onResizeStart(e, dir_next);
                    };
                    return React.cloneElement(child as React.ReactElement, { ref, direction: getHandlerDirection(direction), onResizeStart });
                }
            }
            return child;
        });

        return (
            <ResizeContext.Provider value={{ 
                direction: this.props.direction
            }}>
                <div style={{ 
                    display: 'flex',
                    flexDirection: direction === 'vertical' ? 'column' : 'row',
                    width: '100%',
                    height: '100%'
                }}>
                    {childrenWithRefs}
                </div>
            </ResizeContext.Provider>
        );
    }
}

export default ResizeGroup;
