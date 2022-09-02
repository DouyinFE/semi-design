import React, { ReactNode } from 'react';
import { PreviewContext } from './previewContext';
import BaseComponent from '../_base/baseComponent';
import PropTypes from 'prop-types';
import { PreviewProps, PreviewState } from './interface';
import PreviewInner from './previewInner';
import PreviewFoundation from '@douyinfe/semi-foundation/image/previewFoundation';
import { getUuidShort } from '@douyinfe/semi-foundation/utils/uuid';
import { cssClasses } from '@douyinfe/semi-foundation/image/constants';

const prefixCls = cssClasses.PREFIX;

export default class Preview extends BaseComponent<PreviewProps, PreviewState> {
    static propTypes = {
        srcList: PropTypes.string,
        visible: PropTypes.bool,
        onChange: PropTypes.func,
        preview: PropTypes.object,
        currentIndex: PropTypes.number,
        defaultCurrentIndex: PropTypes.number,
        onVisibleChange: PropTypes.func,
    }

    static defaultProps = {
        visible: false,
        srcList: [],
        preview: {},
    };

    get adapter() {
        return {
            ...super.adapter,
        };
    }

    foundation: PreviewFoundation;
    previewGroupId: string;

    constructor(props) {
        super(props);
        this.state = {
            currentIndex: props.defaultCurrentIndex || props.currentIndex || 0,
        };
        this.foundation = new PreviewFoundation(this.adapter);
        this.previewGroupId = getUuidShort({ prefix: 'semi-preview-group', length: 4 });
    }

    componentDidMount() {
        const allElement = document.querySelectorAll(`.${prefixCls}-img`);
        const observer = new IntersectionObserver(entries => {
            entries.forEach(item => {
                const src = (item.target as any).dataset?.src;
                if (item.isIntersecting && src) {
                    (item.target as any).src = src;
                    observer.unobserve(item.target);
                }
            });
        },
        {
            root: document.querySelector(`#${this.previewGroupId}`),
            // 交叉过视图的100，才开始派发事件
            rootMargin: "0px 0px -100px 0px" 
        }
        );
        allElement.forEach(item => observer.observe(item));
    }

    static getDerivedStateFromProps(props: PreviewProps, state: PreviewState) {
        const willUpdateStates: Partial<PreviewState> = {};
        if ( props.currentIndex && (props.currentIndex !== state.currentIndex) ) {
            willUpdateStates.currentIndex = props.currentIndex;
        }
        return willUpdateStates;
    }

    previewRef = React.createRef<PreviewInner>();

    handleVisibleChange = (newVisible : boolean) => {
        this.foundation.handleVisibleChange(newVisible);
    };

    handleSwitch = (index: number) => {
        this.foundation.handleSwitch(index);
    };
    
    loopImageIndex = () => {
        const { children } = this.props;
        let index = 0;
        const srcListInChildren = [];
        const titles: ReactNode [] = [];
        const loop = (children) => {
            return React.Children.map(children, (child) => {
                if (child && child.props && child.type) {
                    if (child.type.isSemiImage) {
                        const { src, preview, alt } = child.props;
                        if (preview) {
                            srcListInChildren.push(src);
                            titles.push(preview?.previewTitle);
                            return React.cloneElement(child, { imageID: index++ });
                        }
                        return child;
                    }
                }
        
                if (child && child.props && child.props.children) {
                    return React.cloneElement(child, {
                        children: loop(child.props.children),
                    });
                }
        
                return child;
            });
        };
        
        return {
            srcListInChildren,
            newChildren: loop(children),
            titles,
        };
    };

    render() {
        const { srcList, visible, preview, style } = this.props;
        const { currentIndex } = this.state;
        const { srcListInChildren, newChildren, titles } = this.loopImageIndex();
        const finalSrcList = [...srcList, ...srcListInChildren];
        return (
            <PreviewContext.Provider
                value={{
                    isGroup: finalSrcList.length > 1,
                    previewSrc: finalSrcList,
                    titles: titles,
                    currentIndex,
                    visible,
                    setCurrentIndex: this.handleSwitch,
                    handleVisibleChange: this.handleVisibleChange,
                }}
            >
                <div id={this.previewGroupId} style={style} className={`${prefixCls}-preview-group`}>
                    {newChildren}
                </div>
                <PreviewInner
                    ref={this.previewRef}
                    src={finalSrcList}
                    currentIndex={currentIndex}
                    visible={visible}
                    onVisibleChange={this.handleVisibleChange}
                    {...preview}
                />
            </PreviewContext.Provider>
        );
    }
}