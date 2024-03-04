import React from 'react';
import type {
    CollapsibleAdapter,
    CollapsibleFoundationProps,
    CollapsibleFoundationState
} from "@douyinfe/semi-foundation/collapsible/foundation";
import CollapsibleFoundation from "@douyinfe/semi-foundation/collapsible/foundation";
import BaseComponent from "../_base/baseComponent";
import PropTypes from "prop-types";
import cls from "classnames";
import { cssClasses } from "@douyinfe/semi-foundation/collapsible/constants";
import { isEqual } from "lodash";
import "@douyinfe/semi-foundation/collapsible/collapsible.scss";
import { getDefaultPropsFromGlobalConfig } from "../_utils";

export interface CollapsibleProps extends CollapsibleFoundationProps {
    motion?: boolean;
    children?: React.ReactNode;
    isOpen?: boolean;
    duration?: number;
    keepDOM?: boolean;
    lazyRender?: boolean;
    className?: string;
    style?: React.CSSProperties;
    collapseHeight?: number;
    reCalcKey?: number | string;
    id?: string;
    onMotionEnd?: () => void
}

interface CollapsibleState extends CollapsibleFoundationState {
    domInRenderTree: boolean;
    domHeight: number;
    visible: boolean;
    isTransitioning: boolean
}

class Collapsible extends BaseComponent<CollapsibleProps, CollapsibleState> {
    static __SemiComponentName__ = "Collapsible";

    static defaultProps = getDefaultPropsFromGlobalConfig(Collapsible.__SemiComponentName__, {
        isOpen: false,
        duration: 250,
        motion: true,
        keepDOM: false,
        lazyRender: true,
        collapseHeight: 0,
        fade: false
    }) 
    public foundation: CollapsibleFoundation;
    private domRef = React.createRef<HTMLDivElement>();
    private resizeObserver: ResizeObserver | null;

    constructor(props: CollapsibleProps) {
        super(props);
        this.state = {
            domInRenderTree: false,
            domHeight: 0,
            visible: this.props.isOpen,
            isTransitioning: false
        };
        this.foundation = new CollapsibleFoundation(this.adapter);
    }

    get adapter(): CollapsibleAdapter<CollapsibleProps, CollapsibleState> {
        return {
            ...super.adapter,
            setDOMInRenderTree: (domInRenderTree) => {
                if (this.state.domInRenderTree !== domInRenderTree) {
                    this.setState({ domInRenderTree });
                }
            },
            setDOMHeight: (domHeight) => {
                if (this.state.domHeight !== domHeight) {
                    this.setState({ domHeight });
                }
            },
            setVisible: (visible) => {
                if (this.state.visible !== visible) {
                    this.setState({ visible });
                }
            },
            setIsTransitioning: (isTransitioning) => {
                if (this.state.isTransitioning !== isTransitioning) {
                    this.setState({ isTransitioning });
                }
            }
        };
    }

    static getEntryInfo = (entry: ResizeObserverEntry) => {
        //judge whether parent or self display none
        let inRenderTree: boolean;
        if (entry.borderBoxSize) {
            inRenderTree = !(entry.borderBoxSize[0].blockSize === 0 && entry.borderBoxSize[0].inlineSize === 0);
        } else {
            inRenderTree = !(entry.contentRect.height === 0 && entry.contentRect.width === 0);
        }

        let height = 0;
        if (entry.borderBoxSize) {
            height = Math.ceil(entry.borderBoxSize[0].blockSize);
        } else {
            const target = entry.target as HTMLElement;
            height = target.clientHeight;
        }

        return {
            isShown: inRenderTree, height
        };
    }

    componentDidMount() {
        super.componentDidMount();
        this.resizeObserver = new ResizeObserver(this.handleResize);
        this.resizeObserver.observe(this.domRef.current);
        const domInRenderTree = this.isChildrenInRenderTree();
        this.foundation.updateDOMInRenderTree(domInRenderTree);
        if (domInRenderTree) {
            this.foundation.updateDOMHeight(this.domRef.current.scrollHeight);
        }
    }

    componentDidUpdate(prevProps: Readonly<CollapsibleProps>, prevState: Readonly<CollapsibleState>, snapshot?: any) {
        const changedPropKeys = Object.keys(this.props).filter(key => !isEqual(this.props[key], prevProps[key]));
        const changedStateKeys = Object.keys(this.state).filter(key => !isEqual(this.state[key], prevState[key]));
        if (changedPropKeys.includes("reCalcKey")) {
            this.foundation.updateDOMHeight(this.domRef.current.scrollHeight);
        }
        if (changedStateKeys.includes("domInRenderTree") && this.state.domInRenderTree) {
            this.foundation.updateDOMHeight(this.domRef.current.scrollHeight);
        }
        if (changedPropKeys.includes("isOpen")) {
            if (this.props.isOpen || !this.props.motion) {
                this.foundation.updateVisible(this.props.isOpen);
            }
        }

        if (this.props.motion && (prevProps.isOpen !== this.props.isOpen)) {
            this.foundation.updateIsTransitioning(true);
        }

    }

    componentWillUnmount() {
        super.componentWillUnmount();
        this.resizeObserver.disconnect();
    }

    handleResize = (entryList: ResizeObserverEntry[]) => {
        const entry = entryList[0];
        if (entry) {
            const entryInfo = Collapsible.getEntryInfo(entry);
            this.foundation.updateDOMHeight(entryInfo.height);
            this.foundation.updateDOMInRenderTree(entryInfo.isShown);
        }
    }

    isChildrenInRenderTree = () => {
        if (this.domRef.current) {
            return this.domRef.current.offsetHeight > 0;
        }
        return false;
    }

    render() {
        const wrapperStyle: React.CSSProperties = {
            overflow: 'hidden',
            height: this.props.isOpen ? this.state.domHeight : this.props.collapseHeight,
            opacity: (this.props.isOpen || !this.props.fade || this.props.collapseHeight !== 0) ? 1 : 0,
            transitionDuration: `${this.props.motion && this.state.isTransitioning ? this.props.duration : 0}ms`,
            ...this.props.style
        };
        const wrapperCls = cls(`${cssClasses.PREFIX}-wrapper`, {
            [`${cssClasses.PREFIX}-transition`]: this.props.motion && this.state.isTransitioning
        }, this.props.className);

        const shouldRender = (this.props.keepDOM && !this.props.lazyRender) || this.props.collapseHeight !== 0 || this.state.visible || this.props.isOpen;

        return (
            <div
                className={wrapperCls}
                style={wrapperStyle}
                onTransitionEnd={() => {
                    if (!this.props.isOpen) {
                        this.foundation.updateVisible(false);
                    }
                    this.foundation.updateIsTransitioning(false);
                    this.props.onMotionEnd?.();
                }}
                {...this.getDataAttr(this.props)}
            >
                <div
                    x-semi-prop="children"
                    ref={this.domRef}
                    style={{ overflow: 'hidden' }}
                    id={this.props.id}
                >
                    {
                        shouldRender && this.props.children
                    }
                </div>
            </div>
        );
    }
}

Collapsible.propTypes = {
    motion: PropTypes.bool,
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
