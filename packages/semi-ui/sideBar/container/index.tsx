import React from 'react';
import cls from 'classnames';
import CSSAnimation from '../../_cssAnimation';
import Resizable from '../../resizable/single/resizable';
import { IconClose } from '@douyinfe/semi-icons';
import { Button } from '../../index';
import { cssClasses, strings } from '@douyinfe/semi-foundation/sidebar/constants';
import BaseComponent from '../../_base/baseComponent';
import PropTypes from 'prop-types';
import "@douyinfe/semi-foundation/sidebar/sidebar.scss";
import ContainerFoundation, { ContainerAdapter, ContainerProps, ContainerState } from '@douyinfe/semi-foundation/sidebar/containerFoundation';
import { Enable } from '@douyinfe/semi-foundation/resizable/types';
import { ContainerReactProps } from '../interface';

const prefixCls = cssClasses.SIDEBAR;

class Container extends BaseComponent<ContainerReactProps, ContainerState> {
    static propTypes = {
        title: PropTypes.node,
        style: PropTypes.object,
        visible: PropTypes.bool,
        motion: PropTypes.bool,
        minWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        maxWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        onCancel: PropTypes.func,
        afterVisibleChange: PropTypes.func,
        resizable: PropTypes.bool,
        defaultSize: PropTypes.object,
        children: PropTypes.node,
        className: PropTypes.string,
        renderHeader: PropTypes.func,
        showClose: PropTypes.bool,
    };

    static __SemiComponentName__ = "Sidebar.Container";

    static defaultProps = {
        motion: true,
        minWidth: 150,
        showClose: true,
        resizable: true,
    };

    directionEnable: Enable;
    
    constructor(props: ContainerProps) {
        super(props);
        this.state = {
            displayNone: !props.visible,
        };
        this.foundation = new ContainerFoundation(this.adapter);
    }

    get adapter(): ContainerAdapter {
        return {
            ...super.adapter,
            notifyCancel: (e: React.MouseEvent | React.KeyboardEvent) => {
                this.props.onCancel && this.props.onCancel(e);
            },
            notifyVisibleChange: (visible: boolean) => {
                this.props.afterVisibleChange?.(visible);
            },
            setOnKeyDownListener: () => {
                if (typeof window !== 'undefined') {
                    window.addEventListener('keydown', this.handleKeyDown);
                }
            },
            removeKeyDownListener: () => {
                if (typeof window !== 'undefined') {
                    window.removeEventListener('keydown', this.handleKeyDown);
                }
            },
            toggleDisplayNone: (displayNone: boolean) => {
                if (displayNone !== this.state.displayNone) {
                    this.setState({ displayNone: displayNone });
                }
            },
        };
    }

    static getDerivedStateFromProps(props: ContainerReactProps, prevState: ContainerState) {
        const newState: Partial<ContainerState> = {};

        if (props.visible && prevState.displayNone) {
            newState.displayNone = false;
        }

        return newState;
    }

    componentDidMount() {
        if (this.props.visible) {
            this.foundation.beforeShow();
        }
    }

    componentDidUpdate(prevProps: ContainerProps, prevState: ContainerState, snapshot: any) {
        // hide => show
        if (!prevProps.visible && this.props.visible) {
            this.foundation.beforeShow();
        }

        if (!prevState.displayNone && this.state.displayNone) {
            this.foundation.afterHide();
        }
    }

    componentWillUnmount() {
        if (this.props.visible) {
            this.foundation.destroy();
        }
    }

    handleKeyDown = (e: KeyboardEvent) => {
        this.foundation.handleKeyDown(e);
    };

    handleCancel = (e: React.MouseEvent) => {
        this.foundation.handleCancel(e);
    };

    renderHeader = () => {
        const { renderHeader } = this.props;
        const { onCancel, title, showClose } = this.props;
        const result = renderHeader?.();
        if (result) {
            return result;
        }
        return <div className={`${prefixCls}-container-header`}>
            <div className={`${prefixCls}-container-header-title`}>{title}</div>
            {showClose && <Button
                className={`${prefixCls}-container-header-closeBtn`}
                icon={<IconClose />}
                theme="borderless"
                type="tertiary"
                aria-label="close"
                onClick={onCancel}
                size="small"
            />}
        </div>;
    }

    innerContent = (props) => {
        const { animationClassName, animationStyle, animationEventsNeedBind } = props;
        const { containerRef } = this.props;
        const { children, style = {}, className } = this.props;
        return <div 
            className={cls(`${prefixCls}-container`, {
                [className]: className,
                [animationClassName]: animationClassName
            })} 
            ref={containerRef}
            style={{ ...style, ...animationStyle }}
            {...animationEventsNeedBind}
        >
            {this.renderHeader?.()}
            <div className={`${prefixCls}-container-content`}>{children}</div>
        </div>;
    }

    renderContent = () => {
        const { visible, resizable, minWidth, maxWidth, motion, defaultSize } = this.props;
        // const shouldRender = (this.props.visible || this.props.keepDOM) || (this.props.motion && !this.state.displayNone;
        const shouldRender = this.props.visible || (this.props.motion && !this.state.displayNone);

        return <CSSAnimation
            startClassName={visible ? `${prefixCls}-animation-content_show` : `${prefixCls}-animation-content_hide`}
            animationState={visible ? 'enter' : 'leave'}
            motion={motion}
            onAnimationEnd={this.foundation.handleAnimationEnd}
        >
            {
                ({ animationClassName, animationStyle, animationEventsNeedBind }) => {
                    return shouldRender ? (
                        resizable ? 
                            <Resizable
                                enable={strings.DIRECTION}
                                minWidth={minWidth}
                                defaultSize={defaultSize}
                                maxWidth={maxWidth}
                            >
                                {this.innerContent({ animationClassName, animationStyle, animationEventsNeedBind })}
                            </Resizable> :
                            this.innerContent({ animationClassName, animationStyle, animationEventsNeedBind })
                    ) : <></>;
                }
            }
        </CSSAnimation>;
    }


    render() {
        return this.renderContent();
    }

}

export default Container;


