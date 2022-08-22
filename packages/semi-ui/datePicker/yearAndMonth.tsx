/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';
import YearAndMonthFoundation, { MonthScrollItem, YearAndMonthAdapter, YearAndMonthFoundationProps, YearAndMonthFoundationState, YearScrollItem } from '@douyinfe/semi-foundation/datePicker/yearAndMonthFoundation';
import BaseComponent, { BaseProps } from '../_base/baseComponent';
import ScrollList from '../scrollList/index';
import ScrollItem from '../scrollList/scrollItem';
import { getYears } from '@douyinfe/semi-foundation/datePicker/_utils/index';
import isNullOrUndefined from '@douyinfe/semi-foundation/utils/isNullOrUndefined';

import IconButton from '../iconButton';
import { IconChevronLeft } from '@douyinfe/semi-icons';
import { BASE_CLASS_PREFIX } from '@douyinfe/semi-foundation/base/constants';

import { noop, stubFalse } from 'lodash';
import { setYear, setMonth } from 'date-fns';
import { Locale } from '../locale/interface';
import { strings } from '@douyinfe/semi-foundation/datePicker/constants';


const prefixCls = `${BASE_CLASS_PREFIX}-datepicker`;

export interface YearAndMonthProps extends YearAndMonthFoundationProps, BaseProps {
    locale?: Locale['DatePicker'];
}

export type YearAndMonthState = YearAndMonthFoundationState;

class YearAndMonth extends BaseComponent<YearAndMonthProps, YearAndMonthState> {
    static propTypes = {
        currentYear: PropTypes.number,
        currentMonth: PropTypes.number,
        onSelect: PropTypes.func,
        locale: PropTypes.object,
        localeCode: PropTypes.string,
        monthCycled: PropTypes.bool,
        yearCycled: PropTypes.bool,
        noBackBtn: PropTypes.bool,
        disabledDate: PropTypes.func,
        density: PropTypes.string,
        presetPosition: PropTypes.oneOf(strings.PRESET_POSITION_SET),
        renderQuickControls: PropTypes.node,
        renderDateInput: PropTypes.node
    };

    static defaultProps = {
        disabledDate: stubFalse,
        monthCycled: false,
        yearCycled: false,
        noBackBtn: false,
        onSelect: noop,
    };
    foundation: YearAndMonthFoundation;
    yearRef: React.RefObject<ScrollItem<YearScrollItem>>;
    monthRef: React.RefObject<ScrollItem<MonthScrollItem>>;

    constructor(props: YearAndMonthProps) {
        super(props);
        const now = new Date();

        let { currentYear, currentMonth } = props;
        currentYear = currentYear || now.getFullYear();
        currentMonth = currentMonth || now.getMonth() + 1;

        this.state = {
            years: getYears().map(year => ({
                value: year,
                year,
            })),
            months: Array(12)
                .fill(0)
                .map((v, idx) => ({
                    value: idx + 1,
                    month: idx + 1,
                })),
            currentYear,
            currentMonth,
        };

        this.yearRef = React.createRef();
        this.monthRef = React.createRef();
        this.foundation = new YearAndMonthFoundation(this.adapter);
    }

    get adapter(): YearAndMonthAdapter {
        return {
            ...super.adapter,
            // updateYears: years => this.setState({ years }),
            // updateMonths: months => this.setState({ months }),
            setCurrentYear: currentYear => this.setState({ currentYear }),
            setCurrentMonth: currentMonth => this.setState({ currentMonth }),
            notifySelectYear: year =>
                this.props.onSelect({
                    currentMonth: this.state.currentMonth,
                    currentYear: year,
                }),
            notifySelectMonth: month =>
                this.props.onSelect({
                    currentYear: this.state.currentYear,
                    currentMonth: month,
                }),
            notifyBackToMain: () => this.props.onBackToMain(),
        };
    }

    static getDerivedStateFromProps(props: YearAndMonthProps, state: YearAndMonthState) {
        const willUpdateStates: Partial<YearAndMonthState> = {};
        const now = new Date();

        if (!isNullOrUndefined(props.currentMonth) && props.currentMonth !== state.currentMonth && props.currentMonth !== 0) {
            willUpdateStates.currentMonth = props.currentMonth || now.getMonth() + 1;
        }

        if (isNullOrUndefined(props.currentYear) && props.currentYear !== state.currentYear && props.currentYear !== 0) {
            willUpdateStates.currentYear = props.currentYear || now.getFullYear();
        }

        return willUpdateStates;
    }

    renderColYear() {
        const { years, currentYear, currentMonth } = this.state;
        const { disabledDate, localeCode, yearCycled } = this.props;
        const currentDate = setMonth(Date.now(), currentMonth - 1);
        const list: any[] = years.map(({ value, year }) => ({
            year,
            value, // Actual rendered text
            disabled: disabledDate(setYear(currentDate, year)),
        }));
        let transform = (val: string) => val;
        if (localeCode === 'zh-CN' || localeCode === 'zh-TW') {
            // Only Chinese needs to add [year] after the selected year
            transform = val => `${val }年`;
        }
        return (
            <ScrollItem
                ref={this.yearRef}
                cycled={yearCycled}
                list={list}
                transform={transform}
                selectedIndex={years.findIndex(item => item.value === currentYear)}
                type="year"
                onSelect={this.selectYear}
            />
        );
    }

    selectYear = (item: YearScrollItem) => {
        this.foundation.selectYear(item);
    };

    selectMonth = (item: MonthScrollItem) => {
        this.foundation.selectMonth(item);
    };

    reselect = () => {
        const refKeys = ['yearRef', 'monthRef'];

        refKeys.forEach(key => {
            const ref = this[key];

            if (ref && ref.current && ref.current.scrollToIndex) {
                ref.current.scrollToIndex();
            }
        });
    };

    renderColMonth() {
        const { months, currentMonth, currentYear } = this.state;
        const { locale, localeCode, monthCycled, disabledDate } = this.props;
        let transform = (val: string) => val;
        const currentDate = setYear(Date.now(), currentYear);
        if (localeCode === 'zh-CN' || localeCode === 'zh-TW') {
            // Only Chinese needs to add [month] after the selected month
            transform = val => `${val }月`;
        }
        // i18n
        const list: MonthScrollItem[] = months.map(({ value, month }) => ({
            month,
            disabled: disabledDate(setMonth(currentDate, month - 1)),
            value: locale.fullMonths[value], // Actual rendered text
        }));
        const selectedIndex = list.findIndex(item => item.month === currentMonth);
        return (
            <ScrollItem
                ref={this.monthRef}
                cycled={monthCycled}
                list={list}
                transform={transform}
                selectedIndex={selectedIndex}
                type="month"
                onSelect={this.selectMonth}
            />
        );
    }

    backToMain: React.MouseEventHandler<HTMLButtonElement> = e => {
        e.nativeEvent.stopImmediatePropagation();
        this.foundation.backToMain();
    };

    render() {
        const { locale, noBackBtn, density, presetPosition, renderQuickControls, renderDateInput } = this.props;
        const prefix = `${prefixCls}-yearmonth-header`;
        // i18n
        const selectDateText = locale.selectDate;
        const iconSize = density === 'compact' ? 'default' : 'large';
        const buttonSize = density === 'compact' ? 'small' : 'default';

        return (
            <React.Fragment>
                {noBackBtn ? null : (
                    <div className={prefix}>
                        <IconButton
                            noHorizontalPadding={false}
                            icon={<IconChevronLeft aria-hidden size={iconSize} />}
                            size={buttonSize}
                            onClick={this.backToMain}
                        >
                            <span>{selectDateText}</span>
                        </IconButton>
                    </div>
                )}
                {
                    presetPosition ? (
                        <div style={{ display: 'flex' }}> 
                            {presetPosition === "left" && renderQuickControls}
                            <div>
                                {renderDateInput}
                                <ScrollList>
                                    {this.renderColYear()}
                                    {this.renderColMonth()}
                                </ScrollList>
                            </div>
                            {presetPosition === "right" && renderQuickControls}
                        </div>
                    ) : 
                        <>
                            {renderDateInput}
                            <ScrollList>
                                {this.renderColYear()}
                                {this.renderColMonth()}
                            </ScrollList>
                        </>

                    
                }
             
            </React.Fragment>
        );
    }
}

export default YearAndMonth;
