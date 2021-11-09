/* eslint-disable max-len */
import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { FixedSizeList as List } from 'react-window';
import { noop } from 'lodash';

import PaginationFoundation, {
    AdapterPageList,
    KeyDownHandler,
    PageList, PaginationAdapter
} from '@douyinfe/semi-foundation/pagination/foundation';
import { cssClasses, numbers } from '@douyinfe/semi-foundation/pagination/constants';
import '@douyinfe/semi-foundation/pagination/pagination.scss';
import { numbers as popoverNumbers } from '@douyinfe/semi-foundation/popover/constants';
import { IconChevronLeft, IconChevronRight } from '@douyinfe/semi-icons';

import ConfigContext from '../configProvider/context';
import LocaleConsumer from '../locale/localeConsumer';
import { Locale } from '../locale/interface';
import Select from '../select/index';
import InputNumber from '../inputNumber/index';
import BaseComponent from '../_base/baseComponent';
import Popover from '../popover/index';
import { Position } from '../tooltip';

const prefixCls = cssClasses.PREFIX;
const { Option } = Select;

export interface PaginationProps {
    total?: number;
    showTotal?: boolean;
    pageSize?: number;
    pageSizeOpts?: Array<number>;
    size?: 'small' | 'default';
    currentPage?: number;
    defaultCurrentPage?: number;
    onPageChange?: (currentPage: number) => void;
    onPageSizeChange?: (newPageSize: number) => void;
    onChange?: (currentPage: number, pageSize: number) => void;
    prevText?: React.ReactNode;
    nextText?: React.ReactNode;
    showSizeChanger?: boolean;
    showQuickJumper?: boolean;
    popoverZIndex?: number;
    popoverPosition?: PopoverPosition;
    style?: React.CSSProperties;
    className?: string;
    hideOnSinglePage?: boolean;
    hoverShowPageSelect?: boolean;
}

export interface PaginationState {
    total: number;
    showTotal: boolean;
    currentPage: number;
    pageSize: number;
    pageList: PageList;
    prevDisabled: boolean;
    quickJumpPage: string | number;
    nextDisabled: boolean;
    restLeftPageList: number[];
    restRightPageList: number[];
}

export type PaginationLocale = Locale['Pagination'];
export type PopoverPosition = Position;
export { PageList };

export default class Pagination extends BaseComponent<PaginationProps, PaginationState> {
    static contextType = ConfigContext;

    static propTypes = {
        total: PropTypes.number,
        showTotal: PropTypes.bool,
        pageSize: PropTypes.number,
        pageSizeOpts: PropTypes.array,
        size: PropTypes.string,
        currentPage: PropTypes.number,
        defaultCurrentPage: PropTypes.number,
        onPageChange: PropTypes.func,
        onPageSizeChange: PropTypes.func,
        onChange: PropTypes.func,
        prevText: PropTypes.node,
        nextText: PropTypes.node,
        showSizeChanger: PropTypes.bool,
        popoverZIndex: PropTypes.number,
        popoverPosition: PropTypes.string,
        style: PropTypes.object,
        className: PropTypes.string,
        hideOnSinglePage: PropTypes.bool,
        hoverShowPageSelect: PropTypes.bool,
        showQuickJumper: PropTypes.bool,
    };

    static defaultProps = {
        total: 1,
        popoverZIndex: popoverNumbers.DEFAULT_Z_INDEX,
        showTotal: false,
        pageSize: null as null,
        pageSizeOpts: numbers.PAGE_SIZE_OPTION,
        defaultCurrentPage: 1,
        size: 'default',
        onPageChange: noop,
        onPageSizeChange: noop,
        onChange: noop,
        showSizeChanger: false,
        className: '',
        hideOnSinglePage: false,
        showQuickJumper: false,
    };

    constructor(props: PaginationProps) {
        super(props);
        this.state = {
            total: props.total,
            showTotal: props.showTotal,
            currentPage: props.currentPage || props.defaultCurrentPage,
            pageSize: props.pageSize || props.pageSizeOpts[0] || numbers.DEFAULT_PAGE_SIZE, // Use pageSize first, use the first of pageSizeOpts when not, use the default value when none
            pageList: [],
            prevDisabled: false,
            nextDisabled: false,
            restLeftPageList: [],
            restRightPageList: [],
            quickJumpPage: '',
        };
        this.foundation = new PaginationFoundation(this.adapter);
        this.renderDefaultPage = this.renderDefaultPage.bind(this);
        this.renderSmallPage = this.renderSmallPage.bind(this);
    }

    get adapter(): PaginationAdapter<PaginationProps, PaginationState> {
        return {
            ...super.adapter,
            setPageList: (pageListState: AdapterPageList) => {
                const { pageList, restLeftPageList, restRightPageList } = pageListState;
                this.setState({ pageList, restLeftPageList, restRightPageList });
            },
            setDisabled: (prevIsDisabled: boolean, nextIsDisabled: boolean) => {
                this.setState({ prevDisabled: prevIsDisabled, nextDisabled: nextIsDisabled });
            },
            updateTotal: (total: number) => this.setState({ total }),
            updatePageSize: (pageSize: number) => this.setState({ pageSize }),
            updateQuickJumpPage: (quickJumpPage: string | number) => this.setState({ quickJumpPage }),
            // updateRestPageList: () => {},
            setCurrentPage: (pageIndex: number) => {
                this.setState({ currentPage: pageIndex });
            },
            registerKeyDownHandler: (handler: KeyDownHandler) => {
                document.addEventListener('keydown', handler);
            },
            unregisterKeyDownHandler: (handler: KeyDownHandler) => {
                document.removeEventListener('keydown', handler);
            },
            notifyPageChange: (pageIndex: number) => {
                this.props.onPageChange(pageIndex);
            },
            notifyPageSizeChange: (pageSize: number) => {
                this.props.onPageSizeChange(pageSize);
            },
            notifyChange: (pageIndex: number, pageSize: number) => {
                this.props.onChange(pageIndex, pageSize);
            }
        };
    }

    componentDidMount() {
        this.foundation.init();
    }

    componentWillUnmount() {
        this.foundation.destroy();
    }

    componentDidUpdate(prevProps: PaginationProps) {
        const pagerProps = {
            currentPage: this.props.currentPage,
            total: this.props.total,
            pageSize: this.props.pageSize,
        };

        let pagerHasChanged = false;

        if (prevProps.currentPage !== this.props.currentPage) {
            pagerHasChanged = true;
            // this.foundation.updatePage(this.props.currentPage);
        }

        if (prevProps.total !== this.props.total) {
            pagerHasChanged = true;
        }

        if (prevProps.pageSize !== this.props.pageSize) {
            pagerHasChanged = true;
        }

        if (pagerHasChanged) {
            this.foundation.updatePage(pagerProps.currentPage, pagerProps.total, pagerProps.pageSize);
        }
    }

    renderPrevBtn() {
        const { prevText } = this.props;
        const { prevDisabled } = this.state;
        const preClassName = classNames({
            [`${prefixCls}-item`]: true,
            [`${prefixCls}-prev`]: true,
            [`${prefixCls}-item-disabled`]: prevDisabled,
        });
        return (
            <li onClick={e => !prevDisabled && this.foundation.goPrev(e)} className={preClassName} tab-index={0}>
                {prevText || <IconChevronLeft size="large" />}
            </li>
        );
    }

    renderNextBtn() {
        const { nextText } = this.props;
        const { nextDisabled } = this.state;
        const nextClassName = classNames({
            [`${prefixCls}-item`]: true,
            [`${prefixCls}-item-disabled`]: nextDisabled,
            [`${prefixCls}-next`]: true,
        });
        return (
            <li onClick={e => !nextDisabled && this.foundation.goNext(e)} className={nextClassName} tab-index={0}>
                {nextText || <IconChevronRight size="large" />}
            </li>
        );
    }

    renderPageSizeSwitch(locale: PaginationLocale) {
        // rtl modify the default position
        const { direction } = this.context;
        const defaultPopoverPosition = direction === 'rtl' ? 'bottomRight' : 'bottomLeft';
        const { showSizeChanger, popoverPosition = defaultPopoverPosition } = this.props;
        const { pageSize } = this.state;
        const switchCls = classNames(`${prefixCls}-switch`);
        if (!showSizeChanger) {
            return null;
        }
        const pageSizeText = locale.pageSize;
        const newPageSizeOpts = this.foundation.pageSizeInOpts();
        const options = newPageSizeOpts.map((size: number) => (
            <Option value={size} key={size}>
                <span>
                    {`${size} `}
                    {pageSizeText}
                </span>
            </Option>
        ));
        return (
            <div className={switchCls}>
                <Select
                    onChange={newPageSize => this.foundation.changePageSize(newPageSize)}
                    value={pageSize}
                    key={pageSizeText}
                    position={popoverPosition || 'bottomRight'}
                    clickToHide
                    dropdownClassName={`${prefixCls}-select-dropdown`}
                >
                    {options}
                </Select>
            </div>
        );
    }

    renderQuickJump(locale: PaginationLocale) {
        const { showQuickJumper } = this.props;
        const { quickJumpPage, total, pageSize } = this.state;
        if (!showQuickJumper) {
            return null;
        }
        const totalPageNum = this.foundation._getTotalPageNumber(total, pageSize);
        const isDisabled = totalPageNum === 1;
        const quickJumpCls = classNames({
            [`${prefixCls}-quickjump`]: true,
            [`${prefixCls}-quickjump-disabled`]: isDisabled
        });

        return (
            <div className={quickJumpCls}>
                <span>{locale.jumpTo}</span>
                <InputNumber
                    value={quickJumpPage}
                    className={`${prefixCls}-quickjump-input-number`}
                    hideButtons
                    disabled={isDisabled}
                    onBlur={(e: React.MouseEvent) => this.foundation.handleQuickJumpBlur()}
                    onEnterPress={(e: React.KeyboardEvent) => this.foundation.handleQuickJumpEnterPress((e.target as any).value)}
                    onChange={(v: string | number) => this.foundation.handleQuickJumpNumberChange(v)}
                />
                <span>{locale.page}</span>
            </div>
        );
    }

    renderPageList() {
        const {
            pageList,
            currentPage,
            restLeftPageList,
            restRightPageList,
        } = this.state;
        const { popoverPosition, popoverZIndex } = this.props;

        return pageList.map((page, i) => {
            const pageListClassName = classNames(`${prefixCls}-item`, {
                [`${prefixCls}-item-active`]: currentPage === page,
                // [`${prefixCls}-item-rest-opening`]: (i < 3 && isLeftRestHover && page ==='...') || (i > 3 && isRightRestHover && page === '...')
            });
            const pageEl = (
                <li
                    key={`${page}${i}`}
                    onClick={() => this.foundation.goPage(page, i)}
                    className={pageListClassName}
                    tab-index={0}

                >
                    {page}
                </li>
            );
            if (page === '...') {
                let content;
                i < 3 ? (content = restLeftPageList) : (content = restRightPageList);
                return (
                    <Popover
                        trigger="hover"
                        // onVisibleChange={visible=>this.handleRestHover(visible, i < 3 ? 'left' : 'right')}
                        content={this.renderRestPageList(content)}
                        key={`${page}${i}`}
                        position={popoverPosition}
                        zIndex={popoverZIndex}
                    >
                        {pageEl}
                    </Popover>
                );
            }
            return pageEl;
        });
    }

    renderRestPageList(restList: ('...' | number)[]) {
        // The number of pages may be tens of thousands, here is virtualized with the help of react-window
        const { direction } = this.context;
        const className = classNames(`${prefixCls}-rest-item`);
        const count = restList.length;
        const row = (item: { index: number; style: React.CSSProperties }) => {
            const { index, style } = item;
            const page = restList[index];
            return (
                <div
                    key={`${page}${index}`}
                    className={className}
                    onClick={() => this.foundation.goPage(page, index)}
                    style={style}
                >
                    {page}
                </div>
            );
        };
        const itemHeight = 32;
        const listHeight = count >= 5 ? itemHeight * 5 : itemHeight * count;
        return (
            <List
                className={`${prefixCls}-rest-list`}
                itemData={restList}
                itemSize={itemHeight}
                width={78}
                itemCount={count}
                height={listHeight}
                style={{ direction }}
            >
                {row}
            </List>
        );
    }

    renderSmallPage(locale: PaginationLocale) {
        const { className, style, hideOnSinglePage, hoverShowPageSelect } = this.props;
        const paginationCls = classNames(`${prefixCls}-small`, prefixCls, className);
        const { currentPage, total, pageSize } = this.state;
        const totalPageNum = Math.ceil(total / pageSize);
        if (totalPageNum < 2 && hideOnSinglePage) {
            return null;
        }

        const pageNumbers = Array.from({ length: Math.ceil(total / pageSize) }, (v, i) => i + 1);
        const pageList = this.renderRestPageList(pageNumbers);

        const page = (<div className={`${prefixCls}-item ${prefixCls}-item-small`}>{currentPage}/{totalPageNum} </div>);

        return (
            <div className={paginationCls} style={style}>
                {this.renderPrevBtn()}
                {
                    hoverShowPageSelect ? (
                        <Popover
                            content={pageList}
                        >
                            {page}
                        </Popover>
                    ) : page
                }
                {this.renderNextBtn()}
                {this.renderQuickJump(locale)}
            </div>
        );
    }

    renderDefaultPage(locale: PaginationLocale) {
        const { total, pageSize } = this.state;
        const { showTotal, className, style, hideOnSinglePage } = this.props;
        const paginationCls = classNames(className, `${prefixCls}`);
        const showTotalCls = `${prefixCls }-total`;
        const totalPageNum = Math.ceil(total / pageSize);
        if (totalPageNum < 2 && hideOnSinglePage) {
            return null;
        }
        return (
            <ul className={paginationCls} style={style}>
                {showTotal ? (
                    <span className={showTotalCls}>
                        {locale.total}
                        {` ${Math.ceil(total / pageSize)} `}
                        {locale.page}
                    </span>
                ) : null}
                {this.renderPrevBtn()}
                {this.renderPageList()}
                {this.renderNextBtn()}
                {this.renderPageSizeSwitch(locale)}
                {this.renderQuickJump(locale)}
            </ul>
        );
    }

    render() {
        const { size } = this.props;
        return (
            <LocaleConsumer componentName="Pagination">
                {
                    (locale: PaginationLocale) => (
                        size === 'small' ? this.renderSmallPage(locale) : this.renderDefaultPage(locale)
                    )
                }
            </LocaleConsumer>
        );
    }
}
