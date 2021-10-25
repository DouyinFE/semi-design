import React, { PureComponent, createRef, ReactNode } from 'react';
import PropTypes from 'prop-types';
import cls from 'classnames';
import { cssClasses } from '@douyinfe/semi-foundation/tabs/constants';
import getDataAttr from '@douyinfe/semi-foundation/utils/getDataAttr';
import TabsContext from './tabs-context';
import TabPaneTransition from './TabPaneTransition';
import { TabPaneProps, PlainTab } from './interface';

class TabPane extends PureComponent<TabPaneProps> {
    static isTabPane = true;
    static contextType = TabsContext;

    static propTypes = {
        className: PropTypes.string,
        style: PropTypes.object,
        children: PropTypes.node,
        disabled: PropTypes.bool,
        itemKey: PropTypes.string,
        tab: PropTypes.node,
        icon: PropTypes.node,
    };

    lastActiveKey: string = null;

    ref = createRef<HTMLDivElement>();
    isAnimating: boolean;
    _active: boolean;

    componentDidMount(): void {
        this.lastActiveKey = this.context.activeKey;
    }

    // get direction from current item key to activeKey
    getDirection = (activeKey: string, itemKey: string, panes: Array<PlainTab>): boolean => {
        if (itemKey !== null && activeKey !== null && Array.isArray(panes) && panes.length) {
            const activeIndex = panes.findIndex(pane => pane.itemKey === activeKey);
            const itemIndex = panes.findIndex(pane => pane.itemKey === itemKey);
            const lastActiveIndex = panes.findIndex(pane => pane.itemKey === this.lastActiveKey);

            this.lastActiveKey = activeKey;

            if (activeIndex === itemIndex) {
                return lastActiveIndex > activeIndex;
            } else {
                return itemIndex < activeIndex;
            }
        }

        return false;
    };

    hideScroll = (): void => {
        if (this.ref && this.ref.current) {
            this.ref.current.style.overflow = 'hidden';
            this.isAnimating = true;
        }
    };

    autoScroll = (): void => {
        if (this.ref && this.ref.current) {
            this.ref.current.style.overflow = '';
            this.isAnimating = false;
        }
    };

    shouldRender = (): boolean => {
        const { itemKey } = this.props;
        const { activeKey, lazyRender } = this.context;
        const active = activeKey === itemKey;
        this._active = this._active || active;
        return lazyRender ? this._active : true;
    };

    render(): ReactNode {
        const { tabPaneMotion: motion, tabPosition } = this.context;
        const { className, style, children, itemKey, ...restProps } = this.props;
        const active = this.context.activeKey === itemKey;
        const classNames = cls(className, {
            [cssClasses.TABS_PANE_INACTIVE]: !active,
            [cssClasses.TABS_PANE_ACTIVE]: active,
            [cssClasses.TABS_PANE]: true,
        });
        const shouldRender = this.shouldRender();
        return (
            <div
                ref={this.ref}
                role="tab-panel"
                className={classNames}
                style={style}
                aria-hidden={active ? 'false' : 'true'}
                {...getDataAttr(restProps)}
            >
                {motion ? (
                    <TabPaneTransition
                        direction={this.getDirection(this.context.activeKey, itemKey, this.context.panes)}
                        motion={motion}
                        mode={tabPosition === 'top' ? 'horizontal' : 'vertical'}
                        state={active ? 'enter' : 'leave'}
                    >
                        {(transitionStyle): ReactNode => (
                            <div className={`${cssClasses.TABS_PANE_MOTION_OVERLAY}`} style={{ ...transitionStyle }}>
                                {shouldRender ? children : null}
                            </div>
                        )}
                    </TabPaneTransition>
                ) : (
                    shouldRender ? children : null
                )}
            </div>
        );
    }
}

export default TabPane;