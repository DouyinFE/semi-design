/* eslint-disable max-len, jsx-a11y/role-supports-aria-props */
import React from 'react';
import cls from 'classnames';
import PropTypes from 'prop-types';
import SwitchFoudation, { SwitchAdapter } from '@douyinfe/semi-foundation/switch/foundation';
import { cssClasses, strings } from '@douyinfe/semi-foundation/switch/constants';
import BaseComponent from '../_base/baseComponent';
import '@douyinfe/semi-foundation/switch/switch.scss';

import { noop } from 'lodash';
import Spin from '../spin';
export interface SwitchProps {
    'aria-label'?: React.AriaAttributes['aria-label'];
    'aria-describedby'?: React.AriaAttributes['aria-describedby'];
    'aria-errormessage'?: React.AriaAttributes['aria-errormessage'];
    'aria-invalid'?: React.AriaAttributes['aria-invalid'];
    'aria-labelledby'?: React.AriaAttributes['aria-labelledby'];
    defaultChecked?: boolean;
    checked?: boolean;
    disabled?: boolean;
    onChange?: (checked: boolean, e: React.ChangeEvent<HTMLInputElement>) => void;
    loading?: boolean;
    className?: string;
    style?: React.CSSProperties;
    onMouseEnter?: (e: React.MouseEvent) => any;
    onMouseLeave?: (e: React.MouseEvent) => any;
    size?: 'large' | 'default' | 'small';
    checkedText?: React.ReactNode;
    uncheckedText?: React.ReactNode;
    id?: string;
} 

export interface SwitchState {
    nativeControlChecked: boolean;
    nativeControlDisabled: boolean;
}

class Switch extends BaseComponent<SwitchProps, SwitchState> {
    static propTypes = {
        'aria-label': PropTypes.string,
        'aria-labelledby': PropTypes.string,
        'aria-invalid': PropTypes.bool,
        'aria-errormessage': PropTypes.string,
        'aria-describedby': PropTypes.string,
        className: PropTypes.string,
        checked: PropTypes.bool,
        checkedText: PropTypes.node,
        defaultChecked: PropTypes.bool,
        disabled: PropTypes.bool,
        loading: PropTypes.bool,
        onChange: PropTypes.func,
        onMouseEnter: PropTypes.func,
        onMouseLeave: PropTypes.func,
        style: PropTypes.object,
        size: PropTypes.oneOf<SwitchProps['size']>(strings.SIZE_MAP),
        uncheckedText: PropTypes.node,
        id: PropTypes.string,
    };

    static defaultProps: Partial<SwitchProps> = {
        disabled: false,
        className: '',
        onChange: noop,
        loading: false,
        onMouseEnter: noop,
        onMouseLeave: noop,
        size: 'default',
    };

    private switchRef: React.RefObject<HTMLInputElement>;

    constructor(props: SwitchProps) {
        super(props);
        this.state = {
            nativeControlChecked: false,
            nativeControlDisabled: false,
        };
        this.switchRef = React.createRef();
        this.foundation = new SwitchFoudation(this.adapter);
    }

    componentDidMount() {
        this.foundation.init();
    }

    componentDidUpdate(prevProps: SwitchProps) {
        if (this.props.checked !== prevProps.checked) {
            this.foundation.setChecked(this.props.checked);
        }
        if (this.props.disabled !== prevProps.disabled) {
            this.foundation.setDisabled(this.props.disabled);
        }
    }

    componentWillUnmount() {
        this.foundation.destroy();
    }

    get adapter(): SwitchAdapter<SwitchProps, SwitchState> {
        return {
            ...super.adapter,
            setNativeControlChecked: (nativeControlChecked: boolean): void => {
                this.setState({ nativeControlChecked });
            },
            setNativeControlDisabled: (nativeControlDisabled: boolean): void => {
                this.setState({ nativeControlDisabled });
            },
            notifyChange: (checked: boolean, e: React.ChangeEvent<HTMLInputElement>): void => {
                this.props.onChange(checked, e);
            },
        };
    }

    render() {
        const { nativeControlChecked, nativeControlDisabled } = this.state;
        const { className, style, onMouseEnter, onMouseLeave, size, checkedText, uncheckedText, loading, id } = this.props;
        const wrapperCls = cls(className, {
            [cssClasses.PREFIX]: true,
            [cssClasses.CHECKED]: nativeControlChecked,
            [cssClasses.DISABLED]: nativeControlDisabled,
            [cssClasses.LARGE]: size === 'large',
            [cssClasses.SMALL]: size === 'small',
            [cssClasses.LOADING]: loading,
        });
        const switchProps = {
            type: 'checkbox',
            role: 'switch',
            className: cssClasses.NATIVE_CONTROL,
            disabled: nativeControlDisabled || loading,
            checked: nativeControlChecked || false,
        };
        const showCheckedText = checkedText && nativeControlChecked && size !== 'small';
        const showUncheckedText = uncheckedText && !nativeControlChecked && size !== 'small';
        return (
            <div className={wrapperCls} style={style} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
                {
                    loading
                        ? (
                            <Spin
                                wrapperClassName={cssClasses.LOADING_SPIN}
                                size={size === 'default' ? 'middle' : size}
                            />
                        )
                        : <div className={cssClasses.KNOB} aria-hidden={true} />
                }
                {showCheckedText ? (
                    <div className={cssClasses.CHECKED_TEXT}>
                        {checkedText}
                    </div>
                ) : null}
                {showUncheckedText ? (
                    <div className={cssClasses.UNCHECKED_TEXT}>
                        {uncheckedText}
                    </div>
                ) : null}
                <input
                    {...switchProps}
                    ref={this.switchRef}
                    id={id}
                    aria-checked={nativeControlChecked}
                    aria-invalid={this.props['aria-invalid']}
                    aria-errormessage={this.props['aria-errormessage']}
                    aria-label={this.props['aria-label']}
                    aria-labelledby={this.props['aria-labelledby']}
                    aria-describedby={this.props["aria-describedby"]}
                    onChange={e => this.foundation.handleChange(e.target.checked, e)}
                />
            </div>
        );
    }
}

export default Switch;
