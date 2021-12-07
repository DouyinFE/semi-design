/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { checkboxGroupClasses as css, strings } from '@douyinfe/semi-foundation/checkbox/constants';
import CheckboxGroupFoudation, { CheckboxGroupAdapter } from '@douyinfe/semi-foundation/checkbox/checkboxGroupFoundation';
import BaseComponent from '../_base/baseComponent';
import { Context } from './context';
import { isEqual } from 'lodash';
import Checkbox, { CheckboxEvent } from './checkbox';

export type CheckboxDirection = 'horizontal' | 'vertical';
export type CheckboxType = 'default' | 'card' | 'pureCard';

export type CheckboxGroupProps = {
    defaultValue?: any[];
    disabled?: boolean;
    name?: string;
    options?: any[];
    value?: any[];
    onChange?: (value: any[]) => void;
    children?: React.ReactNode;
    prefixCls?: string;
    direction?: CheckboxDirection;
    style?: React.CSSProperties;
    className?: string;
    type?: CheckboxType;
    id?: string;
};

export type CheckboxGroupState = {
    value?: any[];
};
class CheckboxGroup extends BaseComponent<CheckboxGroupProps, CheckboxGroupState> {

    static propTypes = {
        defaultValue: PropTypes.array,
        disabled: PropTypes.bool,
        name: PropTypes.string,
        options: PropTypes.array,
        value: PropTypes.array,
        onChange: PropTypes.func,
        children: PropTypes.node,
        prefixCls: PropTypes.string,
        direction: PropTypes.oneOf<CheckboxGroupProps['direction']>(strings.DIRECTION_SET),
        className: PropTypes.string,
        type: PropTypes.oneOf([strings.TYPE_DEFAULT, strings.TYPE_CARD, strings.TYPE_PURECARD]),
        style: PropTypes.object,
    };

    static defaultProps: Partial<CheckboxGroupProps> = {
        disabled: false,
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onChange: () => {},
        type: strings.TYPE_DEFAULT,
        defaultValue: [] as any,
        direction: strings.DEFAULT_DIRECTION,
    };

    get adapter(): CheckboxGroupAdapter {
        return {
            ...super.adapter,
            updateGroupValue: value => {
                this.setState({ value });
            },
            notifyChange: evt => {
                this.props.onChange && this.props.onChange(evt);
            },
        };
    }

    constructor(props: CheckboxGroupProps) {
        super(props);
        this.state = {
            value: props.value || props.defaultValue,
        };
        this.foundation = new CheckboxGroupFoudation(this.adapter);
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        this.foundation.init();
    }

    componentDidUpdate(prevProps: CheckboxGroupProps) {
        if (!isEqual(prevProps.value, this.props.value)) {
            this.foundation.handlePropValueChange(this.props.value);
        }
    }

    componentWillUnmount() {
        this.foundation.destroy();
    }

    onChange(evt: CheckboxEvent) {
        this.foundation.handleChange(evt);
    }

    render() {
        const { children, options, prefixCls, direction, className, id, style, type } = this.props;

        const isPureCardType = type === strings.TYPE_PURECARD;
        const isCardType = type === strings.TYPE_CARD || isPureCardType;

        const prefix = prefixCls || css.PREFIX;
        const prefixClsDisplay = classnames({
            [prefix as string]: true,
            [`${prefix }-wrapper`]: true,
            [`${prefix }-${ direction}`]: direction,
            [`${prefix}-${direction}-cardType`]: direction && isCardType,
        }, className);

        const realValue = this.state.value.slice();

        let inner;

        if (options) {
            inner = (options || []).map((option, index) => {
                if (typeof option === 'string') {
                    return (
                        <Checkbox
                            key={index}
                            disabled={this.props.disabled}
                            value={option}
                            prefixCls={prefixCls}
                        >
                            {option}
                        </Checkbox>
                    );
                } else {
                    return (
                        <Checkbox
                            key={index}
                            disabled={option.disabled || this.props.disabled}
                            value={option.value}
                            prefixCls={prefixCls}
                            extra={option.extra}
                            className={option.className}
                            style={option.style}
                            onChange={option.onChange}
                        >
                            {option.label}
                        </Checkbox>
                    );
                }
            });
        } else if (children) {
            inner = (React.Children.toArray(children) as React.ReactElement[]).map((itm, index) => React.cloneElement(itm, { key: index }));
        }

        return (
            <div className={prefixClsDisplay} style={style} id={id}>
                <Context.Provider
                    value={{
                        checkboxGroup: {
                            onChange: this.onChange,
                            value: realValue,
                            disabled: this.props.disabled,
                            name: this.foundation.getFormatName(),
                            isCardType,
                            isPureCardType,
                        },
                    }}
                >
                    {inner}
                </Context.Provider>
            </div>
        );
    }
}

export default CheckboxGroup;
