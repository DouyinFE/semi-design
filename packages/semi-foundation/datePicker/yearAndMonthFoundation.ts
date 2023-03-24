import { setMonth, setYear } from 'date-fns';
import BaseFoundation, { DefaultAdapter } from '../base/foundation';
import { PresetPosition } from './foundation';
import { ArrayElement } from '../utils/type';
import { strings } from './constants';
import { PanelType } from './monthsGridFoundation';
import { cloneDeep } from 'lodash';

type Type = ArrayElement<typeof strings.TYPE_SET>;

export interface YearAndMonthFoundationProps {
    currentYear: { left: number; right: number };
    currentMonth: { left: number; right: number };
    onSelect?: (obj: { currentMonth: { left: number; right: number }; currentYear: { left: number; right: number } }) => void;
    onBackToMain?: () => void;
    locale?: any;
    localeCode?: string;
    monthCycled?: boolean;
    yearCycled?: boolean;
    noBackBtn?: boolean;
    disabledDate?: (date: Date) => boolean;
    density?: string;
    presetPosition?: PresetPosition;
    renderQuickControls?: any;
    renderDateInput?: any;
    type?: Type;
    yearAndMonthOpts?: any
}

export interface YearAndMonthFoundationState {
    years: Array<{ value: number; year: number }>;
    months: Array<{ value: number; month: number }>;
    currentYear: { left: number; right: number };
    currentMonth: { left: number; right: number }
}
export interface YearAndMonthAdapter extends DefaultAdapter<YearAndMonthFoundationProps, YearAndMonthFoundationState> {
    setCurrentYear: (currentYear: { left: number; right: number }, cb?: () => void) => void;
    setCurrentMonth: (currentMonth: { left: number; right: number }) => void;
    notifySelectYear: (year: { left: number; right: number }) => void;
    notifySelectMonth: (month: { left: number; right: number }) => void;
    notifyBackToMain: () => void
}

export interface MonthScrollItem {
    [k: string]: any;
    month: number;
    value: string;
    disabled: boolean
}

export interface YearScrollItem {
    [k: string]: any;
    year: number;
    value: number;
    disabled: boolean
}

export default class YearAndMonthFoundation extends BaseFoundation<YearAndMonthAdapter> {

    constructor(adapter: YearAndMonthAdapter) {
        super({ ...adapter });
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    init() {}

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    destroy() {}

    selectYear(item: YearScrollItem, panelType?: PanelType) {
        // const year = item.value;
        const { currentYear, currentMonth } = this.getStates();
        const { type } = this.getProps();
        const left = strings.PANEL_TYPE_LEFT;
        const right = strings.PANEL_TYPE_RIGHT;

        const year = cloneDeep(currentYear);
        year[panelType] = item.value;

        // make sure the right panel time is always less than the left panel time
        if (type === 'monthRange') {
            const isSameYearIllegalDate = year[left] === year[right] && currentMonth[left] > currentMonth[right];
            if ((panelType === left && item.value > year[right]) || (panelType === left && isSameYearIllegalDate)) {
                // 1. select left year and left year > right year
                // 2. select left year, left year = right year, but left date > right date
                year[right] = item.value + 1;
            } else if (panelType === right && isSameYearIllegalDate) {
                // 1. select right year, left year = right year, but left date > right date
                year[left] = item.value - 1;
            }
        }

        this._adapter.setCurrentYear(year, () => this.autoSelectMonth(item, panelType));
        this._adapter.notifySelectYear(year);
    }

    selectMonth(item: MonthScrollItem, panelType?: PanelType) {
        const { currentMonth, currentYear } = this.getStates();
        const { type } = this.getProps();
        const left = strings.PANEL_TYPE_LEFT;
        const right = strings.PANEL_TYPE_RIGHT;

        const month = cloneDeep(currentMonth);
        month[panelType] = item.month;

        // make sure the right panel time is always less than the left panel time
        if (type === 'monthRange' && panelType === left && currentYear[left] === currentYear[right] && item.value > month[right]) {
            month[right] = item.month + 1;
        } 

        this._adapter.setCurrentMonth(month);
        this._adapter.notifySelectMonth(month);
    }

    /**
     * After selecting a year, if the currentMonth is disabled, automatically select a non-disabled month
     */
    autoSelectMonth(item: YearScrollItem, panelType: PanelType) {
        const { disabledDate, locale } = this._adapter.getProps();
        const { months, currentMonth } = this._adapter.getStates();

        const currentDate = setYear(Date.now(), item.year);
        const isCurrentMonthDisabled = disabledDate(setMonth(currentDate, currentMonth[panelType] - 1));
        if (isCurrentMonthDisabled) {
            const currentIndex = months.findIndex(({ month }) => month === currentMonth[panelType]);
            let validMonth: typeof months[number];
            // First look in the back, if you can't find it in the back, then look in the front
            validMonth = months.slice(currentIndex).find(({ month }) => !disabledDate(setMonth(currentDate, month - 1)));
            if (!validMonth) {
                validMonth = months.slice(0, currentIndex).find(({ month }) => !disabledDate(setMonth(currentDate, month - 1)));
            }
            if (validMonth) {
                this.selectMonth({ month: validMonth.month, value: locale.fullMonths[validMonth.month], disabled: false });
            }
        }
    }

    backToMain() {
        this._adapter.notifyBackToMain();
    }
}
