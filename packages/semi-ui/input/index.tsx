/* eslint-disable no-unused-vars, max-len, @typescript-eslint/no-unused-vars */
import React from 'react';
import cls from 'classnames';
import PropTypes from 'prop-types';
import InputFoundation from '@douyinfe/semi-foundation/input/foundation';
import { cssClasses, strings } from '@douyinfe/semi-foundation/input/constants';
import { isSemiIcon } from '../_utils';
import BaseComponent from '../_base/baseComponent';
import '@douyinfe/semi-foundation/input/input.scss';
import { isString, noop, isFunction } from 'lodash';
import { IconClear, IconEyeOpened, IconEyeClosedSolid } from '@douyinfe/semi-icons';

const prefixCls = cssClasses.PREFIX;

const sizeSet = strings.SIZE;
const statusSet = strings.STATUS;
const modeSet = strings.MODE;

export { InputGroupProps } from './inputGroup';
export { TextAreaProps } from './textarea';
export type InputSize = 'small' | 'large' | 'default';
export type InputMode = 'password';
// still keep success as ValidateStatus optional value because form will pass success as props.validateStatus in sometime
// Although we do not consume success in the input to configure special styles, we should allow it as a legal props value, otherwise a warning will be thrown
export type ValidateStatus = "default" | "error" | "warning" | "success";

export interface InputProps extends
    Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'prefix' | 'size' | 'autoFocus' | 'placeholder' | 'onFocus' | 'onBlur'> {
    addonBefore?: React.ReactNode;
    addonAfter?: React.ReactNode;
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
    mode?: InputMode;
    value?: React.ReactText;
    defaultValue?: React.ReactText;
    disabled?: boolean;
    readonly?: boolean;
    autofocus?: boolean;
    type?: string;
    showClear?: boolean;
    hideSuffix?: boolean;
    placeholder?: React.ReactText;
    insetLabel?: React.ReactNode;
    size?: InputSize;
    className?: string;
    style?: React.CSSProperties;
    validateStatus?: ValidateStatus;
    onClear?: (e: React.MouseEvent<HTMLDivElement>) => void;
    onChange?: (value: string, e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
    onInput?: (e: React.MouseEvent<HTMLInputElement>) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onEnterPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    inputStyle?: React.CSSProperties;
    getValueLength?: (value: string) => number;
    forwardRef?: ((instance: any) => void) | React.MutableRefObject<any> | null;
}

export interface InputState {
    value: React.ReactText;
    cachedValue: React.ReactText;
    disabled: boolean;
    props: Record<string, any>;
    paddingLeft: string;
    isFocus: boolean;
    isHovering: boolean;
    eyeClosed: boolean;
    minLength: number;
}

class Input extends BaseComponent<InputProps, InputState> {
    static propTypes = {
        addonBefore: PropTypes.node,
        addonAfter: PropTypes.node,
        prefix: PropTypes.node,
        suffix: PropTypes.node,
        mode: PropTypes.oneOf(modeSet),
        value: PropTypes.any,
        defaultValue: PropTypes.any,
        disabled: PropTypes.bool,
        readonly: PropTypes.bool,
        autofocus: PropTypes.bool,
        type: PropTypes.string,
        showClear: PropTypes.bool,
        hideSuffix: PropTypes.bool,
        placeholder: PropTypes.any,
        size: PropTypes.oneOf(sizeSet),
        className: PropTypes.string,
        style: PropTypes.object,
        validateStatus: PropTypes.oneOf(statusSet),
        onClear: PropTypes.func,
        onChange: PropTypes.func,
        onBlur: PropTypes.func,
        onFocus: PropTypes.func,
        onInput: PropTypes.func,
        onKeyDown: PropTypes.func,
        onKeyUp: PropTypes.func,
        onKeyPress: PropTypes.func,
        onEnterPress: PropTypes.func,
        insetLabel: PropTypes.node,
        inputStyle: PropTypes.object,
        getValueLength: PropTypes.func,
    };

    static defaultProps = {
        addonBefore: '',
        addonAfter: '',
        prefix: '',
        suffix: '',
        disabled: false,
        readonly: false,
        type: 'text',
        showClear: false,
        hideSuffix: false,
        placeholder: '',
        size: 'default',
        className: '',
        onClear: noop,
        onChange: noop,
        onBlur: noop,
        onFocus: noop,
        onInput: noop,
        onKeyDown: noop,
        onKeyUp: noop,
        onKeyPress: noop,
        onEnterPress: noop,
        validateStatus: 'default'
    };

    inputRef!: React.RefObject<HTMLInputElement>;
    prefixRef!: React.RefObject<React.ReactNode>;
    suffixRef!: React.RefObject<React.ReactNode>;
    foundation!: InputFoundation;

    constructor(props: InputProps) {
        super(props);
        this.state = {
            value: '',
            cachedValue: null, // Cache current props.value value
            disabled: false,
            props: {},
            paddingLeft: '',
            isFocus: false,
            isHovering: false,
            eyeClosed: props.mode === 'password',
            minLength: props.minLength,
        };
        this.inputRef = React.createRef();
        this.prefixRef = React.createRef();
        this.suffixRef = React.createRef();
        this.foundation = new InputFoundation(this.adapter);
    }

    get adapter() {
        return {
            ...super.adapter,
            setValue: (value: string) => this.setState({ value }),
            setEyeClosed: (value: boolean) => this.setState({ eyeClosed: value }),
            toggleFocusing: (isFocus: boolean) => {
                const input = this.inputRef && this.inputRef.current;
                if (isFocus) {
                    input && input.focus();
                } else {
                    input && input.blur();
                }
                this.setState({ isFocus });
            },
            toggleHovering: (isHovering: boolean) => this.setState({ isHovering }),
            getIfFocusing: () => this.state.isFocus,
            notifyChange: (cbValue: string, e: React.ChangeEvent<HTMLInputElement>) => this.props.onChange(cbValue, e),
            notifyBlur: (val: string, e: React.FocusEvent<HTMLInputElement>) => this.props.onBlur(e),
            notifyFocus: (val: string, e: React.FocusEvent<HTMLInputElement>) => this.props.onFocus(e),
            notifyInput: (e: React.MouseEvent<HTMLInputElement>) => this.props.onInput(e),
            notifyKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => this.props.onKeyPress(e),
            notifyKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => this.props.onKeyDown(e),
            notifyKeyUp: (e: React.KeyboardEvent<HTMLInputElement>) => this.props.onKeyUp(e),
            notifyEnterPress: (e: React.KeyboardEvent<HTMLInputElement>) => this.props.onEnterPress(e),
            notifyClear: (e: React.MouseEvent<HTMLDivElement>) => this.props.onClear(e),
            setPaddingLeft: (paddingLeft: string) => this.setState({ paddingLeft }),
            setMinLength: (minLength: number) => this.setState({ minLength }),
            isEventTarget: (e: React.MouseEvent) => e && e.target === e.currentTarget
        };
    }

    static getDerivedStateFromProps(props: InputProps, state: InputState) {
        const willUpdateStates: Partial<InputState> = {};

        if (props.value !== state.cachedValue) {
            willUpdateStates.value = props.value;
            willUpdateStates.cachedValue = props.value;
        }

        return willUpdateStates;
    }

    componentDidUpdate(prevProps: InputProps) {
        const { mode } = this.props;
        if (prevProps.mode !== mode) {
            this.handleModeChange(mode);
        }
    }

    handleClear = (e: React.MouseEvent<HTMLInputElement>) => {
        this.foundation.handleClear(e);
    };

    handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        this.foundation.handleClick(e);
    };

    handleMouseOver = (e: React.MouseEvent<HTMLDivElement>) => {
        this.setState({ isHovering: true });
    };

    handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
        this.setState({ isHovering: false });
    };

    handleModeChange = (mode: string) => {
        this.foundation.handleModeChange(mode);
    };

    handleClickEye = (e: React.MouseEvent<HTMLInputElement>) => {
        this.foundation.handleClickEye(e);
    };

    handleMouseDown = (e: React.MouseEvent<HTMLInputElement>) => {
        this.foundation.handleMouseDown(e);
    };

    handleMouseUp = (e: React.MouseEvent<HTMLInputElement>) => {
        this.foundation.handleMouseUp(e);
    };

    handleClickPrefixOrSuffix = (e: React.MouseEvent<HTMLInputElement>) => {
        this.foundation.handleClickPrefixOrSuffix(e);
    };

    handlePreventMouseDown = (e: React.MouseEvent<HTMLInputElement>) => {
        this.foundation.handlePreventMouseDown(e);
    };

    renderPrepend() {
        const { addonBefore } = this.props;
        if (addonBefore) {
            const prefixWrapperCls = cls({
                [`${prefixCls}-prepend`]: true,
                [`${prefixCls}-prepend-text`]: addonBefore && isString(addonBefore),
                [`${prefixCls}-prepend-icon`]: isSemiIcon(addonBefore),
            });
            return <div className={prefixWrapperCls}>{addonBefore}</div>;
        }
        return null;
    }

    renderAppend() {
        const { addonAfter } = this.props;
        if (addonAfter) {
            const prefixWrapperCls = cls({
                [`${prefixCls}-append`]: true,
                [`${prefixCls}-append-text`]: addonAfter && isString(addonAfter),
                [`${prefixCls}-append-icon`]: isSemiIcon(addonAfter),
            });
            return <div className={prefixWrapperCls}>{addonAfter}</div>;
        }
        return null;
    }

    renderClearBtn() {
        const clearCls = cls(`${prefixCls}-clearbtn`);
        const allowClear = this.foundation.isAllowClear();
        // use onMouseDown to fix issue 1203
        if (allowClear) {
            return (
                <div className={clearCls} onMouseDown={this.handleClear}>
                    <IconClear />
                </div>
            );
        }
        return null;
    }

    renderModeBtn() {
        const { value, isFocus, isHovering, eyeClosed } = this.state;
        const { mode, disabled } = this.props;
        const modeCls = cls(`${prefixCls}-modebtn`);
        const modeIcon = eyeClosed ? <IconEyeClosedSolid /> : <IconEyeOpened />;
        const showModeBtn = mode === 'password' && value && !disabled && (isFocus || isHovering);
        if (showModeBtn) {
            return (
                <div className={modeCls} onClick={this.handleClickEye} onMouseDown={this.handleMouseDown} onMouseUp={this.handleMouseUp}>
                    {modeIcon}
                </div>
            );
        }
        return null;
    }

    renderPrefix() {
        const { prefix, insetLabel } = this.props;
        const labelNode = prefix || insetLabel;
        if (!labelNode) {
            return null;
        }
        const prefixWrapperCls = cls({
            [`${prefixCls}-prefix`]: true,
            [`${prefixCls}-inset-label`]: insetLabel,
            [`${prefixCls}-prefix-text`]: labelNode && isString(labelNode),
            [`${prefixCls}-prefix-icon`]: isSemiIcon(labelNode),
        });

        return <div className={prefixWrapperCls} onMouseDown={this.handlePreventMouseDown} onClick={this.handleClickPrefixOrSuffix}>{labelNode}</div>;
    }

    showClearBtn() {
        const { value, isFocus, isHovering } = this.state;
        const { disabled, showClear } = this.props;
        return Boolean(value) && showClear && !disabled && (isFocus || isHovering);
    }

    renderSuffix(suffixAllowClear: boolean) {
        const { suffix, hideSuffix } = this.props;
        if (!suffix) {
            return null;
        }
        const suffixWrapperCls = cls({
            [`${prefixCls }-suffix`]: true,
            [`${prefixCls }-suffix-text`]: suffix && isString(suffix),
            [`${prefixCls }-suffix-icon`]: isSemiIcon(suffix),
            [`${prefixCls}-suffix-hidden`]: suffixAllowClear && Boolean(hideSuffix),
        });
        return <div className={suffixWrapperCls} onMouseDown={this.handlePreventMouseDown} onClick={this.handleClickPrefixOrSuffix}>{suffix}</div>;
    }

    render() {
        const {
            addonAfter,
            addonBefore,
            autofocus,
            className,
            disabled,
            placeholder,
            prefix,
            mode,
            insetLabel,
            validateStatus,
            type,
            readonly,
            size,
            suffix,
            style,
            showClear,
            onEnterPress,
            onClear,
            hideSuffix,
            inputStyle,
            forwardRef,
            maxLength,
            getValueLength,
            ...rest
        } = this.props;
        const { value, paddingLeft, isFocus, minLength: stateMinLength } = this.state;
        const suffixAllowClear = this.showClearBtn();
        const suffixIsIcon = isSemiIcon(suffix);
        const ref = forwardRef || this.inputRef;
        const wrapperPrefix = `${prefixCls}-wrapper`;
        const wrapperCls = cls(wrapperPrefix, className, {
            [`${prefixCls}-wrapper__with-prefix`]: prefix || insetLabel,
            [`${prefixCls}-wrapper__with-suffix`]: suffix,
            [`${prefixCls}-wrapper__with-suffix-hidden`]: suffixAllowClear && Boolean(hideSuffix),
            [`${prefixCls}-wrapper__with-suffix-icon`]: suffixIsIcon,
            [`${prefixCls}-wrapper__with-append`]: addonBefore,
            [`${prefixCls}-wrapper__with-prepend`]: addonAfter,
            [`${prefixCls}-wrapper__with-append-only`]: addonBefore && !addonAfter,
            [`${prefixCls}-wrapper__with-prepend-only`]: !addonBefore && addonAfter,
            [`${wrapperPrefix}-readonly`]: readonly,
            [`${wrapperPrefix}-disabled`]: disabled,
            [`${wrapperPrefix}-warning`]: validateStatus === 'warning',
            [`${wrapperPrefix}-error`]: validateStatus === 'error',
            [`${wrapperPrefix}-focus`]: isFocus,
            [`${wrapperPrefix}-clearable`]: showClear,
            [`${wrapperPrefix}-modebtn`]: mode === 'password',
            [`${wrapperPrefix}-hidden`]: type === 'hidden',
            [`${wrapperPrefix}-${size}`]: size,
        });
        const inputCls = cls(prefixCls, {
            [`${prefixCls}-${size}`]: size,
            [`${prefixCls}-disabled`]: disabled,
            [`${prefixCls}-sibling-clearbtn`]: this.foundation.isAllowClear(),
            [`${prefixCls}-sibling-modebtn`]: mode === 'password',
        });
        const inputValue = value === null || value === undefined ? '' : value;
        const inputProps: React.InputHTMLAttributes<HTMLInputElement> = {
            ...rest,
            style: { paddingLeft, ...inputStyle },
            autoFocus: autofocus,
            className: inputCls,
            disabled,
            readOnly: readonly,
            type: this.foundation.handleInputType(type),
            placeholder: placeholder as string,
            onInput: e => this.foundation.handleInput(e),
            onChange: e => this.foundation.handleChange(e.target.value, e),
            onFocus: e => this.foundation.handleFocus(e),
            onBlur: e => this.foundation.handleBlur(e),
            onKeyUp: e => this.foundation.handleKeyUp(e),
            onKeyDown: e => this.foundation.handleKeyDown(e),
            onKeyPress: e => this.foundation.handleKeyPress(e),
            value: inputValue,
        };
        if (!isFunction(getValueLength)) {
            inputProps.maxLength = maxLength;
        }
        if (stateMinLength) {
            inputProps.minLength = stateMinLength;
        }
        return (
            <div
                className={wrapperCls}
                style={style}
                onMouseEnter={e => this.handleMouseOver(e)}
                onMouseLeave={e => this.handleMouseLeave(e)}
                onClick={e => this.handleClick(e)}
            >
                {this.renderPrepend()}
                {this.renderPrefix()}
                <input {...inputProps} ref={ref} />
                {this.renderClearBtn()}
                {this.renderSuffix(suffixAllowClear)}
                {this.renderModeBtn()}
                {this.renderAppend()}
            </div>
        );
    }
}

const ForwardInput = React.forwardRef<HTMLInputElement, Omit<InputProps, 'forwardRef'>>((props, ref) => <Input {...props} forwardRef={ref} />);

export default ForwardInput;

export { Input };
