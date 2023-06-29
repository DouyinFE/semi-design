/* eslint-disable max-len */
import React, { PureComponent } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { isString } from 'lodash';
import { cssClasses } from '@douyinfe/semi-foundation/select/constants';
import LocaleConsumer from '../locale/localeConsumer';
import { IconTick } from '@douyinfe/semi-icons';
import { getHighLightTextHTML } from '../_utils/index';
import { Locale } from '../locale/interface';
import { BasicOptionProps } from '@douyinfe/semi-foundation/select/optionFoundation';

export interface OptionProps extends BasicOptionProps {
    [x: string]: any;
    value?: string | number;
    label?: string | number | React.ReactNode;
    children?: React.ReactNode;
    disabled?: boolean;
    showTick?: boolean;
    className?: string;
    style?: React.CSSProperties
}
interface renderOptionContentArgument {
    config: {
        searchWords: any;
        sourceString: React.ReactNode
    };
    children: React.ReactNode;
    inputValue: string;
    prefixCls: string
}
class Option extends PureComponent<OptionProps> {
    static isSelectOption = true;

    static propTypes = {
        children: PropTypes.node,
        disabled: PropTypes.bool,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        selected: PropTypes.bool,
        label: PropTypes.node,
        empty: PropTypes.bool,
        emptyContent: PropTypes.node,
        onSelect: PropTypes.func,
        focused: PropTypes.bool,
        showTick: PropTypes.bool,
        className: PropTypes.string,
        style: PropTypes.object,
        onMouseEnter: PropTypes.func,
        prefixCls: PropTypes.string,
        renderOptionItem: PropTypes.func,
        inputValue: PropTypes.string,
    };

    static defaultProps = {
        prefixCls: cssClasses.PREFIX_OPTION
    };

    onClick({ value, label, children, ...rest }: Partial<OptionProps>, event: React.MouseEvent) {
        const { props } = this;
        const isDisabled = props.disabled;
        if (!isDisabled) {
            props.onSelect({ ...rest, value, label: label || children }, event);
        }
    }

    renderOptionContent({ config, children, inputValue, prefixCls }: renderOptionContentArgument) {
        if (isString(children) && inputValue) {
            return getHighLightTextHTML(config as any);
        }
        return children;
    }

    render() {
        const {
            children,
            disabled,
            value,
            selected,
            label,
            empty,
            emptyContent,
            onSelect,
            focused,
            showTick,
            className,
            style,
            onMouseEnter,
            prefixCls,
            renderOptionItem,
            inputValue,
            optionId,
            ...rest
        } = this.props;
        const optionClassName = classNames(prefixCls, {
            [`${prefixCls}-disabled`]: disabled,
            [`${prefixCls}-selected`]: selected,
            [`${prefixCls}-focused`]: focused,
            [`${prefixCls}-empty`]: empty,
            [className]: className,
        });
        const selectedIconClassName = classNames([`${prefixCls}-icon`]);

        if (empty) {
            if (emptyContent === null) {
                return null;
            }
            return (
                <LocaleConsumer<Locale['Select']> componentName="Select">
                    {(locale: Locale['Select']) => (
                        <div className={optionClassName} x-semi-prop="emptyContent">
                            {emptyContent || locale.emptyText}
                        </div>
                    )}
                </LocaleConsumer>
            );
        }

        // Since there are empty, locale and other logic, the custom renderOptionItem is directly converged to the internal option instead of being placed in Select/index
        if (typeof renderOptionItem === 'function') {
            return renderOptionItem({
                disabled,
                focused,
                selected,
                style,
                label,
                value,
                inputValue,
                onMouseEnter: (e: React.MouseEvent) => onMouseEnter(e),
                onClick: (e: React.MouseEvent) => this.onClick({ value, label, children, ...rest }, e),
                ...rest
            });
        }

        const config = {
            searchWords: inputValue,
            sourceString: children,
            option: {
                highlightClassName: `${prefixCls}-keyword`
            }
        };
        return (
            // eslint-disable-next-line jsx-a11y/interactive-supports-focus,jsx-a11y/click-events-have-key-events
            <div
                className={optionClassName}
                onClick={e => {
                    this.onClick({ value, label, children, ...rest }, e);
                }}
                onMouseEnter={e => onMouseEnter && onMouseEnter(e)}
                role="option"
                id={optionId}
                aria-selected={selected ? "true" : "false"}
                aria-disabled={disabled ? "true" : "false"}
                style={style}
            >
                {showTick ? (
                    <div className={selectedIconClassName}>
                        <IconTick />
                    </div>
                ) : null}
                {isString(children) ? <div className={`${prefixCls}-text`}>{this.renderOptionContent({ children, config, inputValue, prefixCls })}</div> : children}
            </div>
        );
    }
}

export default Option;
