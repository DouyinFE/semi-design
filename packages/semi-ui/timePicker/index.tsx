import React from 'react';
import LocaleConsumer from '../locale/localeConsumer';
import BaseTimePicker, { TimePickerProps as BasePickerProps, BaseValueType } from './TimePicker';
import { ValidateStatus } from '../_base/baseComponent';
import { ScrollItemProps } from '../scrollList/scrollItem';
import ConfigContext from '../configProvider/context';
import { get } from 'lodash-es';
import { Locale } from '../locale/interface';

export { TimeInputProps } from './TimeInput';
export { TimePickerProps } from './TimePicker';

export {
    BaseValueType,
    ScrollItemProps,
    ValidateStatus
}

export type LocalePickerProps = BasePickerProps;

export default class LocaleTimePicker extends React.PureComponent<LocalePickerProps> {
    static propTypes = BaseTimePicker.propTypes;
    static defaultProps = BaseTimePicker.defaultProps;

    render() {
        const { type } = this.props;
        return (
            <ConfigContext.Consumer>
                {({ timeZone }: { timeZone: string | number }) => (
                    <LocaleConsumer componentName="TimePicker">
                        {(locale: Locale['TimePicker'], localeCode: string, dateFnsLocale: Locale['dateFnsLocale']) => (
                            <BaseTimePicker
                                timeZone={timeZone}
                                placeholder={get(locale, ['placeholder', type])}
                                {...this.props}
                                locale={locale}
                                localeCode={localeCode}
                                dateFnsLocale={dateFnsLocale}
                            />
                        )}
                    </LocaleConsumer>
                )}
            </ConfigContext.Consumer>
        );
    }
}

