/* eslint-disable prefer-template */
import React, { PureComponent } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { cssClasses } from '@douyinfe/semi-foundation/form/constants';
import { IconAlertTriangle, IconAlertCircle } from '@douyinfe/semi-icons';

const prefix = cssClasses.PREFIX;

export type ReactFieldError = boolean | string | Array<any> | React.ReactNode | undefined;

export interface ErrorMessageProps {
    error?: ReactFieldError;
    className?: string;
    style?: React.CSSProperties;
    showValidateIcon?: boolean;
    validateStatus?: string;
    helpText?: React.ReactNode;
    isInInputGroup?: boolean;
}

export default class ErrorMessage extends PureComponent<ErrorMessageProps> {
    static propTypes = {
        error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.array, PropTypes.node]),
        className: PropTypes.string,
        style: PropTypes.object,
        validateStatus: PropTypes.string,
        showValidateIcon: PropTypes.bool,
        helpText: PropTypes.node,
        isInInputGroup: PropTypes.bool,
    };

    generatorText(error: ReactFieldError) {
        if (typeof error === 'string') {
            return <span>{error}</span>;
        } else if (Array.isArray(error)) {
            const err = error.filter(e => e);
            return err.length ? <span>{err.join(', ')}</span> : null;
        } else if (React.isValidElement(error)) {
            return error;
        }
        return null;
    }

    render() {
        const { error, className, style, validateStatus, helpText, showValidateIcon, isInInputGroup } = this.props;
        const cls = classNames(
            {
                [prefix + '-field-error-message']: Boolean(error),
                [prefix + '-field-help-text']: Boolean(helpText),
            },
            className
        );

        if (!error && !helpText) {
            return null;
        }
        const iconMap = {
            warning: <IconAlertTriangle />,
            error: <IconAlertCircle />,
        };
        const text = error ? this.generatorText(error) : this.generatorText(helpText);
        const iconCls = `${prefix }-field-validate-status-icon`;
        let icon = null;
        if (isInInputGroup) {
            icon = <IconAlertCircle className={iconCls} />;
        } else {
            if (iconMap[validateStatus]) {
                icon = React.cloneElement(iconMap[validateStatus], { className: iconCls });
            }
        }

        return (
            <div className={cls} style={style}>
                {showValidateIcon && text ? icon : null}
                {text}
            </div>
        );
    }
}
