import React, { MouseEvent, ReactElement, ReactNode } from 'react';
import PropTypes from 'prop-types';
import cls from 'classnames';
import { cssClasses, strings } from '@douyinfe/semi-foundation/tabs/constants';
import getDataAttr from '@douyinfe/semi-foundation/utils/getDataAttr';
import OverflowList from '../overflowList';
import Dropdown from '../dropdown';
import Button from '../button';
import { TabBarProps, PlainTab } from './interface';
import { isEmpty } from 'lodash';
import { IconChevronRight, IconChevronLeft, IconClose } from '@douyinfe/semi-icons';
import { getUuidv4 } from '@douyinfe/semi-foundation/utils/uuid';

export interface TabBarState {
    endInd: number;
    rePosKey: number;
    startInd: number;
}

export interface OverflowItem extends PlainTab {
    key: string;
    active: boolean;
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
        deleteTabItem: PropTypes.func
    };

    uuid: string;

    constructor(props: TabBarProps) {
        super(props);
        this.state = {
            endInd: props.list.length,
            rePosKey: 0,
            startInd: 0,
        };
        this.uuid = getUuidv4();
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
            // eslint-disable-next-line max-len
            const tabItem = document.querySelector(`[data-uuid="${this.uuid}"] .${cssClasses.TABS_TAB}[data-scrollkey="${key}"]`);
            tabItem.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
        }
    };

    handleKeyDown = (event: React.KeyboardEvent, itemKey: string, closable: boolean) => {
        this.props.handleKeyDown(event, itemKey, closable);
    }

    renderTabItem = (panel: PlainTab): ReactNode => {
        const { size, type, deleteTabItem } = this.props;
        const panelIcon = panel.icon ? this.renderIcon(panel.icon) : null;
        const closableIcon = (type === 'card' && panel.closable) ? <IconClose aria-label="Close" role="button" className={`${cssClasses.TABS_TAB}-icon-close`} onClick={(e: React.MouseEvent<HTMLSpanElement>) => deleteTabItem(panel.itemKey, e)} /> : null;
        let events = {};
        const key = panel.itemKey;
        if (!panel.disabled) {
            events = {
                onClick: (e: MouseEvent<HTMLDivElement>): void => this.handleItemClick(key, e),
            };
        }
        const isSelected = this._isActive(key);
        const className = cls(cssClasses.TABS_TAB, {
            [cssClasses.TABS_TAB_ACTIVE]: isSelected,
            [cssClasses.TABS_TAB_DISABLED]: panel.disabled,
            [`${cssClasses.TABS_TAB}-small`]: size === 'small',
            [`${cssClasses.TABS_TAB}-medium`]: size === 'medium',
        });
        return (
            <div
                role="tab"
                id={`semiTab${key}`}
                data-tabkey={`semiTab${key}`}
                aria-controls={`semiTabPanel${key}`}
                aria-disabled={panel.disabled ? 'true' : 'false'}
                aria-selected={isSelected ? 'true' : 'false'}
                tabIndex={isSelected ? 0 : -1}
                onKeyDown={e => this.handleKeyDown(e, key, panel.closable)}
                {...events}
                className={className}
                key={this._getItemKey(key)}
            >
                {panelIcon}
                {panel.tab}
                {closableIcon}
            </div>
        );
    };

    renderTabComponents = (list: Array<PlainTab>): Array<ReactNode> => list.map(panel => this.renderTabItem(panel));

    handleArrowClick = (items: Array<OverflowItem>, pos: 'start' | 'end'): void => {
        const inline = pos === 'start' ? 'end' : 'start';
        const lastItem = pos === 'start' ? items.pop() : items.shift();
        if (!lastItem) {
            return;
        }
        const key = this._getItemKey(lastItem.itemKey);
        // eslint-disable-next-line max-len
        const tabItem = document.querySelector(`[data-uuid="${this.uuid}"] .${cssClasses.TABS_TAB}[data-scrollkey="${key}"]`);
        tabItem.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline });
    };

    renderCollapse = (items: Array<OverflowItem>, icon: ReactNode, pos: 'start' | 'end'): ReactNode => {
        if (isEmpty(items)) {
            return null;
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
        const icon = ind === 0 ? <IconChevronLeft /> : <IconChevronRight />;
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
                rootMargin={'40px'}
                intersectionRatio={0.5}
                threshold={[0, 0.5, 0.75]}
                className={`${cssClasses.TABS_BAR}-overflow-list`}
                visibleItemRenderer={this.renderTabItem as any}
            />
        );
    };

    render(): ReactNode {
        const { type, style, className, list, tabPosition, collapsible, ...restProps } = this.props;
        const classNames = cls(className, {
            [cssClasses.TABS_BAR]: true,
            [cssClasses.TABS_BAR_LINE]: type === 'line',
            [cssClasses.TABS_BAR_CARD]: type === 'card',
            [cssClasses.TABS_BAR_BUTTON]: type === 'button',
            [`${cssClasses.TABS_BAR}-${tabPosition}`]: tabPosition,
            [`${cssClasses.TABS_BAR}-collapse`]: collapsible,
        });

        const extra = this.renderExtra();
        const contents = collapsible ? this.renderCollapsedTab() : this.renderTabComponents(list);

        return (
            <div role="tablist" aria-orientation={tabPosition === "left" ? "vertical" : "horizontal"} className={classNames} style={style} {...getDataAttr(restProps)} data-uuid={this.uuid}>
                {contents}
                {extra}
            </div>
        );
    }

    private _isActive = (key: string): boolean => key === this.props.activeKey;

    private _getItemKey = (key: string): string => `${key}-bar`;
}

export default TabBar;
