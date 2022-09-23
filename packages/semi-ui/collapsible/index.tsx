import React from 'react';
import type {CollapsibleAdapter, CollapsibleFoundationProps, CollapsibleFoundationState} from "@douyinfe/semi-foundation/collapsible/foundation";
import BaseComponent from "@douyinfe/semi-ui/_base/baseComponent";
import {Motion} from "@douyinfe/semi-ui/_base/base";
import PropTypes from "prop-types";
import cls from "classnames";
import {cssClasses} from "@douyinfe/semi-foundation/collapsible/constants";
import CollapsibleOld from "@douyinfe/semi-ui/collapsible/index.old";
import {isEqual} from "lodash";
interface CollapsibleProps extends CollapsibleFoundationProps{
    motion?: Motion;
    children?: React.ReactNode;
    isOpen?: boolean;
    duration?: number;
    keepDOM?: boolean;
    className?: string;
    style?: React.CSSProperties;
    collapseHeight?: number;
    reCalcKey?: number | string;
    id?:string,
}

interface CollapsibleState extends CollapsibleFoundationState{
    domInRenderTree:boolean
    domHeight:number
}

class Collapsible extends BaseComponent<CollapsibleProps, CollapsibleState> {
    static defaultProps = {
        isOpen: false,
        duration: 250,
        motion: true,
        keepDOM: false,
        collapseHeight: 0
    };

    private domRef = React.createRef<HTMLDivElement>();
    private wrapperRef = React.createRef<HTMLDivElement>();
    private resizeObserver: ResizeObserver | null;
    constructor(props: CollapsibleProps) {
        super(props);
        this.state = {
            domInRenderTree:false,
            domHeight: 0,
        }
    }

    get adapter(): CollapsibleAdapter<CollapsibleProps,CollapsibleState> {
        return {
            ...super.adapter,
        };
    }

    componentDidMount() {
        super.componentDidMount();
        this.resizeObserver = new ResizeObserver(this.handleResize);
        this.resizeObserver.observe(this.domRef.current);
        const domInRenderTree = this.isChildrenInRenderTree();
        this.setState({domInRenderTree})
        if(domInRenderTree){
            this.setState({domHeight:this.domRef.current.scrollHeight})
        }
    }

    componentDidUpdate(prevProps: Readonly<CollapsibleProps>, prevState: Readonly<CollapsibleState>, snapshot?: any) {
        const changedPropKeys = Object.keys(this.props).filter(key => !isEqual(this.props[key], prevProps[key]));
        const changedStateKeys = Object.keys(this.state).filter(key => !isEqual(this.state[key], prevState[key]));
        if(changedPropKeys.includes("reCalcKey")){
            this.setState({domHeight:this.domRef.current.scrollHeight})
        }
        if(changedStateKeys.includes("domInRenderTree") && this.state.domInRenderTree){
            this.setState({domHeight:this.domRef.current.scrollHeight})
        }
    }

    handleResize = (entryList:ResizeObserverEntry[]) => {
        const entry = entryList[0];
        if(entry){
            const entryInfo  = Collapsible.getEntryInfo(entry);
            this.setState({domInRenderTree:entryInfo.isShown,domHeight:entryInfo.height})
        }
    }

    static getEntryInfo = (entry:ResizeObserverEntry)=>{
        //judge whether parent or self display none
        let inRenderTree:boolean;
        if(entry.borderBoxSize){
            inRenderTree= !(entry.borderBoxSize[0].blockSize===0 && entry.borderBoxSize[0].inlineSize===0);
        }else {
            inRenderTree = !(entry.contentRect.height===0 && entry.contentRect.width===0);
        }

        let height = 0;
        if(entry.borderBoxSize){
            height = Math.ceil(entry.borderBoxSize[0].blockSize);
        }else{
            const target = entry.target as HTMLElement;
            height = target.clientHeight;
        }

        return {
            isShown: inRenderTree,height
        }


    }

    isChildrenInRenderTree = ()=>{
        if(this.domRef.current){
            return this.domRef.current.offsetHeight >0
        }else{
            return false
        }
    }

    render() {
        const wrapperStyle:React.CSSProperties = {
            overflow: 'hidden',
            height: this.props.isOpen ? this.state.domHeight : 0,
            transition: `height ${this.props.duration}ms ease-in-out`,
            ...this.props.style
        }
        const wrapperCls = cls(`${cssClasses.PREFIX}-wrapper`, this.props.className);
        return <div ref={this.wrapperRef} className={wrapperCls} style={wrapperStyle} >
            <div
                x-semi-prop="children"
                ref={this.domRef}
                style={{ overflow: 'hidden' }}
            >
                {(this.props.keepDOM || this.props.isOpen ) && this.props.children}
            </div>
        </div>
    }
}

Collapsible.propTypes = {
    motion: PropTypes.oneOfType([PropTypes.bool, PropTypes.func, PropTypes.object]),
    children: PropTypes.node,
    isOpen: PropTypes.bool,
    duration: PropTypes.number,
    keepDOM: PropTypes.bool,
    collapseHeight: PropTypes.number,
    style: PropTypes.object,
    className: PropTypes.string,
    reCalcKey: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
};

export default Collapsible;
