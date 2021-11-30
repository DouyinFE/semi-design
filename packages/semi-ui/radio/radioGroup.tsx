import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { noop } from 'lodash';

import { radioGroupClasses as css, strings } from '@douyinfe/semi-foundation/radio/constants';
import RadioGroupFoundation, { RadioGroupAdapter } from '@douyinfe/semi-foundation/radio/radioGroupFoundation';
import { RadioChangeEvent } from '@douyinfe/semi-foundation/radio/radioInnerFoundation';

import BaseComponent from '../_base/baseComponent';
import { ArrayElement } from '../_base/base';
import Radio, { RadioType } from './radio';
import Context, { RadioGroupButtonSize, RadioMode } from './context';

export interface OptionItem {
    label?: React.ReactNode;
    value?: string | number;
    disabled?: boolean;
    extra?: React.ReactNode;
    style?: React.CSSProperties;
    className?: string;
}
export type Options = string[] | Array<OptionItem>;

export type RadioGroupProps = {
    defaultValue?: string | number;
    disabled?: boolean;
    name?: string;
    options?: Options;
    value?: string | number;
    onChange?: (event: RadioChangeEvent) => void;
    className?: string;
    style?: React.CSSProperties;
    direction?: ArrayElement<typeof strings.DIRECTION_SET>;
    mode?: RadioMode;
    type?: RadioType;
    buttonSize?: RadioGroupButtonSize;
    prefixCls?: string;
};

export interface RadioGroupState {
    value?: any;
}

class RadioGroup extends BaseComponent<RadioGroupProps, RadioGroupState> {
    static propTypes = {
        defaultValue: PropTypes.any,
        disabled: PropTypes.bool,
        name: PropTypes.string,
        options: PropTypes.array,
        buttonSize: PropTypes.oneOf(strings.BUTTON_SIZE),
        type: PropTypes.oneOf([strings.TYPE_DEFAULT, strings.TYPE_BUTTON, strings.TYPE_CARD, strings.TYPE_PURECARD]),
        value: PropTypes.any,
        onChange: PropTypes.func,
        children: PropTypes.node,
        prefixCls: PropTypes.string,
        className: PropTypes.string,
        style: PropTypes.object,
        direction: PropTypes.oneOf(strings.DIRECTION_SET),
        mode: PropTypes.oneOf(strings.MODE)
    };

    static defaultProps: Partial<RadioGroupProps> = {
        disabled: false,
        onChange: noop,
        direction: strings.DEFAULT_DIRECTION,
        mode: '',
        type: strings.TYPE_DEFAULT,
        buttonSize: 'middle'
    };

    constructor(props: RadioGroupProps) {
        super(props);
        this.state = {
            value: undefined,
        };
        this.foundation = new RadioGroupFoundation(this.adapter);
    }

    componentDidMount() {
        this.foundation.init();
    }

    componentDidUpdate(prevProps: RadioGroupProps) {
        if (prevProps.value !== this.props.value) {
            this.foundation.handlePropValueChange(this.props.value);
        }
    }

    componentWillUnmount() {
        this.foundation.destroy();
    }

    get adapter(): RadioGroupAdapter {
        return {
            ...super.adapter,
            setValue: (value: any) => {
                this.setState({ value });
            },
            getProps: () => this.props,
            isInProps: (name: string) => Boolean(name in this.props),
            notifyChange: (evt: RadioChangeEvent) => {
                this.props.onChange && this.props.onChange(evt);
            },
        };
    }

    onChange = (evt: RadioChangeEvent) => {
        this.foundation.handleChange(evt);
    };

    getFormatName = () => this.props.name || 'default';

    render() {
        const {
            children,
            options,
            mode,
            prefixCls,
            className,
            style,
            direction,
            type,
            buttonSize
        } = this.props;

        const isButtonRadio = type === strings.TYPE_BUTTON;
        const isPureCardRadio = type === strings.TYPE_PURECARD;
        const isCardRadio = type === strings.TYPE_CARD || isPureCardRadio;
        const isDefaultRadio = type === strings.TYPE_DEFAULT;

        const prefix = prefixCls || css.PREFIX;
        const prefixClsDisplay = classnames(className, {
            [prefix]: true,
            [`${prefix}-wrapper`]: true,
            [`${prefix}-${direction}`]: direction && !isButtonRadio,
            [`${prefix}-${direction}-default`]: direction && isDefaultRadio,
            [`${prefix}-${direction}-card`]: direction && isCardRadio,
            [`${prefix}-buttonRadio`]: isButtonRadio,
        });

        const realValue = this.state.value;

        let inner;

        if (options) {
            inner = (options || []).map((option, index) => {
                if (typeof option === 'string') {
                    return (
                        <Radio
                            key={index}
                            disabled={this.props.disabled}
                            value={option}
                        >
                            {option}
                        </Radio>
                    );
                } else {
                    return (
                        <Radio
                            key={index}
                            disabled={option.disabled || this.props.disabled}
                            value={option.value}
                            extra={option.extra}
                            className={option.className}
                            style={option.style}
                        >
                            {option.label}
                        </Radio>
                    );
                }
            });
        } else if (children) {
            inner = React.Children.map(children, (itm, index) => (React.isValidElement(itm) ?
                React.cloneElement(itm, { key: index }) :
                null));
        }

        return (
            <div className={prefixClsDisplay} style={style}>
                <Context.Provider
                    value={{
                        radioGroup: {
                            onChange: this.onChange,
                            value: realValue,
                            disabled: this.props.disabled,
                            name: this.getFormatName(),
                            isButtonRadio,
                            isCardRadio,
                            isPureCardRadio,
                            buttonSize,
                            prefixCls
                        },
                        mode
                    }}
                >
                    {inner}
                </Context.Provider>
            </div>
        );
    }
}

export default RadioGroup;
