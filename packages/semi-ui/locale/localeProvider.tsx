import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { changeConfirmLocale } from '../modal/local';
import LocaleContext from './context';
import DefaultLocale from './source/zh_CN';
import { Locale } from './interface';

export interface LocaleProviderProps {
    children?: React.ReactNode;
    locale?: Locale
}

export default class LocaleProvider extends Component<LocaleProviderProps> {
    static propTypes = {
        locale: PropTypes.object,
        children: PropTypes.node,
    };

    static defaultProps = {
        locale: DefaultLocale
    };

    constructor(props: LocaleProviderProps) {
        super(props);
        this.state = {};
        changeConfirmLocale(props.locale?.Modal);
    }

    componentDidUpdate(prevProps: Readonly<LocaleProviderProps>): void {
        if (prevProps.locale?.Modal !== this.props.locale?.Modal) {
            changeConfirmLocale(this.props.locale.Modal);
        }
    }

    componentWillUnmount(): void {
        changeConfirmLocale();
    }

    render() {
        const { children, locale } = this.props;
        return (
            <LocaleContext.Provider value={locale}>
                {children}
            </LocaleContext.Provider>
        );
    }
}
