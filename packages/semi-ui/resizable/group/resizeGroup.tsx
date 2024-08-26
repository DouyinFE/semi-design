import React, { createContext, createRef, ReactNode, Ref, RefObject } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { ResizeGroupFoundation, ResizeGroupAdapter } from '@douyinfe/semi-foundation/resizable/foundation';
import { cssClasses } from '@douyinfe/semi-foundation/resizable/constants';
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

    registerItem = (r: RefObject<any>) => {
        if (this.childRefs.indexOf(r) == -1) {
            this.childRefs.push(r);
        }
    }

    registerHandler = (r: RefObject<any>) => {
        if (this.childRefs.indexOf(r) == -1) {
            this.childRefs.push(r);
        }
        // console.log(r.current.foundation)ß
    }

    render() {
        const { children } = this.props;
        console.log(this.context);
        return (
            <ResizeContext.Provider value={{ 
                direction: this.props.direction,
                registerItem: this.registerItem,
                registerHandler: this.registerHandler,
                getArray: () => console.log(this.childRefs)
            }}>
                <div>
                    {children}
                </div>
            </ResizeContext.Provider>
        );
    }
}

export default ResizeGroup;
