import React, { MouseEvent, ReactElement, ReactNode } from 'react';
import PropTypes from 'prop-types';
import cls from 'classnames';
import { cssClasses, strings } from '@douyinfe/semi-foundation/tabs/constants';
import getDataAttr from '@douyinfe/semi-foundation/utils/getDataAttr';
import OverflowList from '../overflowList';
import Dropdown, { DropdownProps } from '../dropdown';
import Button from '../button';
import { TabBarProps, PlainTab } from './interface';
import { isEmpty, pick } from 'lodash';
import { IconChevronRight, IconChevronLeft } from '@douyinfe/semi-icons';
import { getUuidv4 } from '@douyinfe/semi-foundation/utils/uuid';
import TabItem from './TabItem';
import { IconChevronDown } from "@douyinfe/semi-icons";
import { Locale } from "../locale/interface";
import LocaleConsumer from "../locale/localeConsumer";

export interface TabBarState {
    endInd: number;
    rePosKey: number;
    startInd: number;
    uuid: string
}

export interface OverflowItem extends PlainTab {
    key: string;
    active: boolean
}

class TabBar extends React.Component<TabBarProps, TabBarState> {
    static propTypes = {
        activeKey: PropTypes.string,
        className: PropTypes.string,
        collapsible: PropTypes.bool,
        list: PropTypes.array,
        onTabClick: PropTypes.func,
        size: PropTypes.oneOf(strings.SIZE),
        style: PropTypes.object,
        tabBarExtraContent: PropTypes.node,
        tabPosition: PropTypes.oneOf(strings.POSITION_MAP),
        type: PropTypes.oneOf(strings.TYPE_MAP),
        closable: PropTypes.bool,
        deleteTabItem: PropTypes.func,
        more: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    };

    constructor(props: TabBarProps) {
        super(props);
        this.state = {
            endInd: props.list.length,
            rePosKey: 0,
            startInd: 0,
            uuid: '',
        };
    }

    componentDidMount() {
        this.setState({
            uuid: getUuidv4(),
        });
    }

    renderIcon(icon: ReactNode): ReactNode {
        return (
            <span>
                {icon}
            </span>
        );
    }

    renderExtra(): ReactNode {
        const { tabBarExtraContent, type, size } = this.props;
        const tabBarExtraContentDefaultStyle = { float: 'right' };
        const tabBarExtraContentStyle =
            tabBarExtraContent && (tabBarExtraContent as ReactElement).props ? (tabBarExtraContent as ReactElement).props.style : {};
        const extraCls = cls(cssClasses.TABS_BAR_EXTRA, {
            [`${cssClasses.TABS_BAR}-${type}-extra`]: type,
            [`${cssClasses.TABS_BAR}-${type}-extra-${size}`]: size,
        });
        if (tabBarExtraContent) {
            const tabBarStyle = { ...tabBarExtraContentDefaultStyle, ...tabBarExtraContentStyle };
            return (
                <div className={extraCls} style={tabBarStyle} x-semi-prop="tabBarExtraContent">
                    {tabBarExtraContent}
                </div>
            );
        }
        return null;
    }

    handleItemClick = (itemKey: string, e: MouseEvent<Element>): void => {
        this.props.onTabClick(itemKey, e);
        if (this.props.collapsible) {
            const key = this._getItemKey(itemKey);
            const tabItem = document.querySelector(`[data-uuid="${this.state.uuid}"] .${cssClasses.TABS_TAB}[data-scrollkey="${key}"]`);
            tabItem.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
        }
    };

    handleKeyDown = (event: React.KeyboardEvent, itemKey: string, closable: boolean) => {
        this.props.handleKeyDown(event, itemKey, closable);
    }

    renderTabItem = (panel: PlainTab): ReactNode => {
        const { size, type, deleteTabItem, handleKeyDown, tabPosition } = this.props;
        const isSelected = this._isActive(panel.itemKey);
        
        return (
            <TabItem
                {...pick(panel, ['disabled', 'icon', 'itemKey', 'tab', 'closable'])}
                key={this._getItemKey(panel.itemKey)}
                selected={isSelected}
                size={size}
                type={type}
                tabPosition={tabPosition}
                handleKeyDown={handleKeyDown}
                deleteTabItem={deleteTabItem}
                onClick={this.handleItemClick}
            />
        );
    };

    renderTabComponents = (list: Array<PlainTab>): Array<ReactNode> => list.map(panel => this.renderTabItem(panel));

    handleArrowClick = (items: Array<OverflowItem>, pos: 'start' | 'end'): void => {
        const lastItem = pos === 'start' ? items.pop() : items.shift();
        if (!lastItem) {
            return;
        }
        const key = this._getItemKey(lastItem.itemKey);
        const tabItem = document.querySelector(`[data-uuid="${this.state.uuid}"] .${cssClasses.TABS_TAB}[data-scrollkey="${key}"]`);
        tabItem.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    };

    renderCollapse = (items: Array<OverflowItem>, icon: ReactNode, pos: 'start' | 'end'): ReactNode => {
        if (isEmpty(items)) {
            return (
                <Button
                    disabled={true}
                    icon={icon}
                    theme="borderless"
                />
            );
        }
        const { dropdownClassName, dropdownStyle } = this.props;
        const { rePosKey } = this.state;
        const disabled = !items.length;
        const menu = (
            <Dropdown.Menu>
                {items.map(panel => {
                    const { icon: i, tab, itemKey } = panel;
                    const panelIcon = i ? this.renderIcon(panel.icon) : null;
                    return (
                        <Dropdown.Item
                            key={itemKey}
                            onClick={(e): void => this.handleItemClick(itemKey, e)}
                            active={this._isActive(itemKey)}
                        >
                            {panelIcon}
                            {tab}
                        </Dropdown.Item>
                    );
                })}
            </Dropdown.Menu>
        );

        const arrowCls = cls({
            [`${cssClasses.TABS_BAR}-arrow-${pos}`]: pos,
            [`${cssClasses.TABS_BAR}-arrow`]: true,
        });

        const dropdownCls = cls(dropdownClassName, {
            [`${cssClasses.TABS_BAR}-dropdown`]: true,
        });

        return (
            <Dropdown
                className={dropdownCls}
                clickToHide
                clickTriggerToHide
                key={`${rePosKey}-${pos}`}
                position={pos === 'start' ? 'bottomLeft' : 'bottomRight'}
                render={disabled ? null : menu}
                showTick
                style={dropdownStyle}
                trigger={'hover'}
                disableFocusListener // prevent the panel from popping up again after clicking
            >
                <div role="presentation" className={arrowCls} onClick={(e): void => this.handleArrowClick(items, pos)}>
                    <Button
                        disabled={disabled}
                        icon={icon}
                        // size="small"
                        theme="borderless"
                    />
                </div>
            </Dropdown>
        );
    };

    renderOverflow = (items: any[]): Array<ReactNode> => items.map((item, ind) => {
        const icon = ind === 0 ? <IconChevronLeft/> : <IconChevronRight/>;
        const pos = ind === 0 ? 'start' : 'end';
        return this.renderCollapse(item, icon, pos);
    });


    renderCollapsedTab = (): ReactNode => {
        const { list } = this.props;
        const renderedList = list.map(item => {
            const { itemKey } = item;
            return { key: this._getItemKey(itemKey), active: this._isActive(itemKey), ...item };
        });
        return (
            <OverflowList
                items={renderedList}
                overflowRenderer={this.renderOverflow}
                renderMode="scroll"
                className={`${cssClasses.TABS_BAR}-overflow-list`}
                visibleItemRenderer={this.renderTabItem as any}
            />
        );
    };

    renderWithMoreTrigger = (): ReactNode => {
        const { list, more } = this.props;
        let tabElements: ReactNode[] = [];
        let moreTrigger: ReactNode = <div className={cls({
            [`${cssClasses.TABS_BAR}-more-trigger`]: true,
            [`${cssClasses.TABS_BAR}-more-trigger-${this.props.type}`]: true
        })}>
            <LocaleConsumer componentName="Tabs">
                {(locale: Locale['Tabs'], localeCode: Locale['code']) => (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div>{locale.more}</div>
                        <IconChevronDown style={{ margin: '0 8px', flexShrink: 0 }}/>
                    </div>
                )}
            </LocaleConsumer>
        </div>;
        let keepCount: number;
        if (typeof more === "number") {
            keepCount = list.length - more;
            tabElements = list.slice(0, keepCount).map(panel => this.renderTabItem(panel));
        } else if (typeof more === 'object') {
            keepCount = list.length - more.count;
            tabElements = list.slice(0, keepCount).map(panel => this.renderTabItem(panel));
            if (more.render) {
                moreTrigger = more.render();
            }

        } else if (more !== undefined) {
            throw new Error("Semi Tabs: invalid tab props format: more");
        }
        return <>
            {tabElements}
            {this.renderMoreDropdown(list.slice(keepCount), more?.['dropdownProps'], moreTrigger)}
        </>;
    }

    renderMoreDropdown = (panels: PlainTab[], dropDownProps: DropdownProps, trigger: ReactNode): ReactNode => {

        return <Dropdown trigger={'hover'} showTick position={'bottomLeft'}
            className={`${cssClasses.TABS_BAR}-more-dropdown-${this.props.type}`}
            clickToHide={true}
            menu={panels.map(panel => ({
                node: 'item',
                name: panel.tab as string,
                icon: panel.icon,
                onClick: (e) => this.props.onTabClick(panel.itemKey, e),
                active: this.props.activeKey === panel.itemKey
            }))}
            {...dropDownProps}
        >
            {trigger}
        </Dropdown>;
    }

    render(): ReactNode {
        const { type, style, className, list, tabPosition, more, collapsible, ...restProps } = this.props;
        const classNames = cls(className, {
            [cssClasses.TABS_BAR]: true,
            [cssClasses.TABS_BAR_LINE]: type === 'line',
            [cssClasses.TABS_BAR_CARD]: type === 'card',
            [cssClasses.TABS_BAR_BUTTON]: type === 'button',
            [`${cssClasses.TABS_BAR}-${tabPosition}`]: tabPosition,
            [`${cssClasses.TABS_BAR}-collapse`]: collapsible,
        });

        const extra = this.renderExtra();
        const contents = collapsible ? this.renderCollapsedTab() : (more ? this.renderWithMoreTrigger() : this.renderTabComponents(list));

        return (
            <div role="tablist" aria-orientation={tabPosition === "left" ? "vertical" : "horizontal"}
                className={classNames} style={style} {...getDataAttr(restProps)} data-uuid={this.state.uuid}>
                {contents}
                {extra}
            </div>
        );
    }

    private _isActive = (key: string): boolean => key === this.props.activeKey;

    private _getItemKey = (key: string): string => `${key}-bar`;
}

export default TabBar;
