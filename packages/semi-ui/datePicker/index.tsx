import React from 'react';

import { forwardStatics } from '@douyinfe/semi-foundation/utils/object';
import DatePicker, { DatePickerProps } from './datePicker';
import ConfigContext from '../configProvider/context';
import LocaleConsumer from '../locale/localeConsumer';
import { Locale } from '../locale/interface';

export { DateInputProps } from './dateInput';
export { DatePickerProps } from './datePicker';
export { MonthProps } from './month';
export { MonthsGridProps } from './monthsGrid';
export { QuickControlProps } from './quickControl';
export { YearAndMonthProps } from './yearAndMonth';

export default forwardStatics(
    React.forwardRef<DatePicker, DatePickerProps>((props, ref) => {
        const propsObj = { ...props };
        const { type, format, rangeSeparator } = propsObj;

        if (typeof format === 'string' && format) {
            if (!/[Hhms]+/.test(format)) {
                if (type === 'dateTime') {
                    propsObj.type = 'date';
                } else if (type === 'dateTimeRange') {
                    propsObj.type = 'dateRange';
                }
            }
        }

        // Add spaces at both ends to prevent conflicts with characters in the date when separating
        if (rangeSeparator && typeof rangeSeparator === 'string') {
            propsObj.rangeSeparator = ` ${rangeSeparator.trim()} `;
        }

        return (
            <ConfigContext.Consumer>
                {({ timeZone }: { timeZone: string | number }) => (
                    <LocaleConsumer componentName={'DatePicker'}>
                        {(locale: Locale['DatePicker'], localeCode: string, dateFnsLocale: Locale['dateFnsLocale']) => (
                            <DatePicker
                                timeZone={timeZone}
                                localeCode={localeCode}
                                locale={locale}
                                dateFnsLocale={dateFnsLocale}
                                {...propsObj}
                                ref={ref}
                            />
                        )}
                    </LocaleConsumer>
                )}
            </ConfigContext.Consumer>
        );
    }),
    DatePicker
);

export {
    BaseValueType,
    DayStatusType,
    DisabledDateOptions,
    DisabledDateType,
    DisabledTimeType,
    InputSize,
    Position,
    PresetType,
    PresetsType,
    TriggerRenderProps,
    ValidateStatus,
    ValueType,
} from '@douyinfe/semi-foundation/datePicker/foundation';