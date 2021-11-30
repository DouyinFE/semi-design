
import React, { createRef, MouseEvent, ReactElement, ReactNode, RefCallback, RefObject, isValidElement } from 'react';
import cls from 'classnames';
import PropTypes from 'prop-types';
import { cssClasses, strings } from '@douyinfe/semi-foundation/tabs/constants';
import isNullOrUndefined from '@douyinfe/semi-foundation/utils/isNullOrUndefined';
import getDataAttr from '@douyinfe/semi-foundation/utils/getDataAttr';
import TabsFoundation, { TabsAdapter } from '@douyinfe/semi-foundation/tabs/foundation';
import { isEqual, pick, omit } from 'lodash';
import BaseComponent from '../_base/baseComponent';
import '@douyinfe/semi-foundation/tabs/tabs.scss';

import TabBar from './TabBar';
import TabPane from './TabPane';
import TabsContext from './tabs-context';
import { TabsProps, PlainTab, TabBarProps } from './interface';

const panePickKeys = Object.keys(omit(TabPane.propTypes, ['children']));

export * from './interface';

export interface TabsState {
    activeKey: string;
    panes: Array<PlainTab>;
}

class Tabs extends BaseComponent<TabsProps, TabsState> {
    static TabPane = TabPane;

    static propTypes = {
        activeKey: PropTypes.string,
        className: PropTypes.string,
        collapsible: PropTypes.bool,
        contentStyle: PropTypes.oneOfType([PropTypes.object]),
        defaultActiveKey: PropTypes.string,
        keepDOM: PropTypes.bool,
        lazyRender: PropTypes.bool,
        onChange: PropTypes.func,
        onTabClick: PropTypes.func,
        renderTabBar: PropTypes.func,
        size: PropTypes.oneOf(strings.SIZE),
        style: PropTypes.object,
        tabBarClassName: PropTypes.string,
        tabBarExtraContent: PropTypes.node,
        tabBarStyle: PropTypes.object,
        tabList: PropTypes.array,
        tabPaneMotion: PropTypes.oneOfType([PropTypes.bool, PropTypes.object, PropTypes.func]),
        tabPosition: PropTypes.oneOf(strings.POSITION_MAP),
        type: PropTypes.oneOf(strings.TYPE_MAP),
        onTabClose: PropTypes.func,
    };

    static defaultProps: TabsProps = {
        children: [],
        collapsible: false,
        keepDOM: true,
        lazyRender: false,
        onChange: () => undefined,
        onTabClick: () => undefined,
        size: 'large',
        tabPaneMotion: true,
        tabPosition: 'top',
        type: 'line',
        onTabClose: () => undefined
    };

    contentRef: RefObject<HTMLDivElement>;
    contentHeight: string;
    foundation: TabsFoundation;

    constructor(props: TabsProps) {
        super(props);

        this.foundation = new TabsFoundation(this.adapter);

        this.state = {
            activeKey: this.foundation.getDefaultActiveKey(),
            panes: [],
        };
        this.contentRef = createRef();
        this.contentHeight = 'auto';
    }

    get adapter(): TabsAdapter<TabsProps, TabsState> {
        return {
            ...super.adapter,
            collectPane: (): void => {
                const { tabList, children } = this.props;
                if (Array.isArray(tabList) && tabList.length) {
                    this.setState({ panes: tabList });
                    return;
                }
                const panes = React.Children.map(children, (child: any) => {
                    if (child) {
                        const { tab, icon, disabled, itemKey, closable } = child.props;
                        return { tab, icon, disabled, itemKey, closable };
                    }
                    return undefined;
                });
                this.setState({ panes });
            },
            collectActiveKey: (): void => {
                let panes = [];
                const { tabList, children, activeKey: propsActiveKey } = this.props;
                if (typeof propsActiveKey !== 'undefined') {
                    return;
                }
                const { activeKey } = this.state;
                if (Array.isArray(tabList) && tabList.length) {
                    panes = tabList;
                } else {
                    panes = React.Children.map(children, (child: any) => {
                        if (child) {
                            const { tab, icon, disabled, itemKey, closable } = child.props;
                            return { tab, icon, disabled, itemKey, closable };
                        }
                        return undefined;
                    });
                }
                if (panes.findIndex(p => p.itemKey === activeKey) === -1){
                    if (panes.length>0){
                        this.setState({activeKey: panes[0].itemKey});
                    } else {
                        this.setState({activeKey: ''});
                    }
                }
                
            },
            notifyTabClick: (activeKey: string, event: MouseEvent<HTMLDivElement>): void => {
                this.props.onTabClick(activeKey, event);
            },
            notifyChange: (activeKey: string): void => {
                this.props.onChange(activeKey);
            },
            setNewActiveKey: (activeKey: string): void => {
                this.setState({ activeKey });
            },
            getDefaultActiveKeyFromChildren: (): string => {
                const { tabList, children } = this.props;
                let activeKey = '';
                const list = tabList ? tabList : React.Children.toArray(children).map((child) => isValidElement(child) ? child.props : null);
                list.forEach(item => {
                    if (item && !activeKey && !item.disabled) {
                        activeKey = item.itemKey;
                    }
                });
                return activeKey;
            },
            notifyTabDelete: (tabKey: string) => {
                this.props.onTabClose && this.props.onTabClose(tabKey);
            }
        };
    }

    static getDerivedStateFromProps(props: TabsProps, state: TabsState): Partial<TabsState> {
        const states: Partial<TabsState> = {};
        if (!isNullOrUndefined(props.activeKey) && props.activeKey !== state.activeKey) {
            states.activeKey = props.activeKey;
        }
        return states;
    }

    componentDidUpdate(prevProps: TabsProps): void {
        // Panes state acts on tab bar, no need to compare TabPane children
        const prevChildrenProps = React.Children.toArray(prevProps.children).map((child) =>
            pick(isValidElement(child) ? child.props : null, panePickKeys)
        );
        const nowChildrenProps = React.Children.toArray(this.props.children).map((child) =>
            pick(isValidElement(child) ? child.props : null, panePickKeys)
        );

        const isTabListType = this.props.tabList || prevProps.tabList;

        if (!isEqual(this.props.tabList, prevProps.tabList)) {
            this.foundation.handleTabListChange();
        }

        // children变化，tabList方式使用时，啥也不用做
        // children变化，非tabList方式使用，需要重新取activeKey。TabPane可能是异步更新的，若不重新取，未设activeKey时，第一个不会自动激活
        // children changed: do nothing in tabList case
        // children changed: recalc activeKey. TabPane could be updated async. If not recalc the first panel will not be activated
        if (!isEqual(prevChildrenProps, nowChildrenProps) && !isTabListType) {
            this.foundation.handleTabPanesChange();
        }
    }

    setContentRef: RefCallback<HTMLDivElement> = ref => {
        this.contentRef = { current: ref };
    };

    onTabClick = (activeKey: string, event: MouseEvent<HTMLDivElement>): void => {
        this.foundation.handleTabClick(activeKey, event);
    };

    rePosChildren = (children: ReactElement[], activeKey: string): ReactElement[] => {
        const newChildren: ReactElement[] = [];

        const falttenChildren = React.Children.toArray(children) as ReactElement[];

        if (children.length) {
            newChildren.push(...falttenChildren.filter(child => child.props && child.props.itemKey === activeKey));
            newChildren.push(...falttenChildren.filter(child => child.props && child.props.itemKey !== activeKey));
        }

        return newChildren;
    };

    getActiveItem = (): ReactNode | ReactNode[] => {
        const { activeKey } = this.state;
        const { children, tabList } = this.props;
        if (tabList || !Array.isArray(children)) {
            return children;
        }
        return React.Children.toArray(children).filter((pane) => {
            if (isValidElement(pane) && pane.type && (pane.type as any).isTabPane) {
                return pane.props.itemKey === activeKey;
            }
            return true;
        });
    };

    deleteTabItem = (tabKey: string, event: MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        this.foundation.handleTabDelete(tabKey);
    }

    render(): ReactNode {
        const {
            children,
            className,
            collapsible,
            contentStyle,
            keepDOM,
            lazyRender,
            renderTabBar,
            size,
            style,
            tabBarClassName,
            tabBarExtraContent,
            tabBarStyle,
            tabPaneMotion,
            tabPosition,
            type,
            ...restProps
        } = this.props;
        const { panes, activeKey } = this.state;
        const tabWrapperCls = cls(className, {
            [cssClasses.TABS]: true,
            [`${cssClasses.TABS}-${tabPosition}`]: tabPosition,
        });

        const tabContentCls = cls({
            [cssClasses.TABS_CONTENT]: true,
            [`${cssClasses.TABS_CONTENT}-${tabPosition}`]: tabPosition,
        });

        const tabBarProps = {
            activeKey,
            className: tabBarClassName,
            collapsible,
            list: panes,
            onTabClick: this.onTabClick,
            size,
            style: tabBarStyle,
            tabBarExtraContent,
            tabPosition,
            type,
            deleteTabItem: this.deleteTabItem
        } as TabBarProps;

        const tabBar = renderTabBar ? renderTabBar(tabBarProps, TabBar) : <TabBar {...tabBarProps} />;
        const content = keepDOM ? children : this.getActiveItem();

        return (
            <div className={tabWrapperCls} style={style} {...getDataAttr(restProps)}>
                {tabBar}
                <TabsContext.Provider
                    value={{
                        activeKey,
                        lazyRender,
                        panes,
                        tabPaneMotion,
                        tabPosition,
                    }}
                >
                    <div
                        ref={this.setContentRef}
                        role="tab-content"
                        className={tabContentCls}
                        style={{ ...contentStyle }}
                    >
                        {content}
                    </div>
                </TabsContext.Provider>
            </div>
        );
    }
}

export default Tabs;
