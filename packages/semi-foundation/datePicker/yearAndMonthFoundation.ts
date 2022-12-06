import { setMonth, setYear } from 'date-fns';
import BaseFoundation, { DefaultAdapter } from '../base/foundation';
import { PresetPosition } from './foundation';

export interface YearAndMonthFoundationProps {
    currentYear?: number;
    currentMonth?: number;
    onSelect?: (obj: { currentMonth: number; currentYear: number }) => void;
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
    yearAndMonthOpts?: any
}

export interface YearAndMonthFoundationState {
    years: Array<{ value: number; year: number }>;
    months: Array<{ value: number; month: number }>;
    currentYear: number;
    currentMonth: number
}
export interface YearAndMonthAdapter extends DefaultAdapter<YearAndMonthFoundationProps, YearAndMonthFoundationState> {
    setCurrentYear: (currentYear: number, cb?: () => void) => void;
    setCurrentMonth: (currentMonth: number) => void;
    notifySelectYear: (year: number) => void;
    notifySelectMonth: (month: number) => void;
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

    selectYear(item: YearScrollItem) {
        const year = item.value;
        this._adapter.setCurrentYear(year, () => this.autoSelectMonth(item));
        this._adapter.notifySelectYear(year);
    }

    selectMonth(item: MonthScrollItem) {
        const { month } = item;
        this._adapter.setCurrentMonth(month);
        this._adapter.notifySelectMonth(month);
    }

    /**
     * After selecting a year, if the currentMonth is disabled, automatically select a non-disabled month
     */
    autoSelectMonth(item: YearScrollItem) {
        const { disabledDate, locale } = this._adapter.getProps();
        const { months, currentMonth } = this._adapter.getStates();

        const currentDate = setYear(Date.now(), item.year);
        const isCurrentMonthDisabled = disabledDate(setMonth(currentDate, currentMonth - 1));
        if (isCurrentMonthDisabled) {
            const currentIndex = months.findIndex(({ month }) => month === currentMonth);
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
