import BaseFoundation, { DefaultAdapter } from '../base/foundation';

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
}

export interface YearAndMonthFoundationState {
    years: Array<{ value: number; year: number }>;
    months: Array<{ value: number; month: number }>;
    currentYear: number;
    currentMonth: number;
}
export interface YearAndMonthAdapter extends DefaultAdapter<YearAndMonthFoundationProps, YearAndMonthFoundationState> {
    setCurrentYear: (currentYear: number) => void;
    setCurrentMonth: (currentMonth: number) => void;
    notifySelectYear: (year: number) => void;
    notifySelectMonth: (month: number) => void;
    notifyBackToMain: () => void;
}

export interface MonthScrollItem {
    [k: string]: any;
    month: number;
    value: string;
    disabled: boolean;
}

export interface YearScrollItem {
    [k: string]: any;
    year: number;
    value: number;
    disabled: boolean;
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
        this._adapter.setCurrentYear(year);
        this._adapter.notifySelectYear(year);
    }

    selectMonth(item: MonthScrollItem) {
        const { month } = item;
        this._adapter.setCurrentMonth(month);
        this._adapter.notifySelectMonth(month);
    }

    backToMain() {
        this._adapter.notifyBackToMain();
    }
}
