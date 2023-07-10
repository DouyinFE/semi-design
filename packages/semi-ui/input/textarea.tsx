/* eslint-disable no-unused-vars */
import React from 'react';
import cls from 'classnames';
import PropTypes from 'prop-types';
import TextAreaFoundation from '@douyinfe/semi-foundation/input/textareaFoundation';
import { cssClasses } from '@douyinfe/semi-foundation/input/constants';
import BaseComponent, { ValidateStatus } from '../_base/baseComponent';
import '@douyinfe/semi-foundation/input/textarea.scss';
import { noop, omit, isFunction } from 'lodash';
import { IconClear } from '@douyinfe/semi-icons';

const prefixCls = cssClasses.PREFIX;

type OmitTextareaAttr =
    | 'onChange'
    | 'onInput'
    | 'prefix'
    | 'size'
    | 'onFocus'
    | 'onBlur'
    | 'onKeyDown'
    | 'onKeyPress'
    | 'onKeyUp'
    | 'onResize'

export interface TextAreaProps extends
    Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, OmitTextareaAttr> {
    autosize?: boolean;
    borderless?: boolean;
    placeholder?: string;
    value?: string;
    rows?: number;
    cols?: number;
    maxCount?: number;
    validateStatus?: ValidateStatus;
    defaultValue?: string;
    disabled?: boolean;
    readonly?: boolean;
    autofocus?: boolean;
    showCounter?: boolean;
    showClear?: boolean;
    onClear?: (e: React.MouseEvent<HTMLTextAreaElement>) => void;
    onChange?: (value: string, e: React.MouseEvent<HTMLTextAreaElement>) => void;
    onBlur?: (e: React.MouseEvent<HTMLTextAreaElement>) => void;
    onFocus?: (e: React.MouseEvent<HTMLTextAreaElement>) => void;
    onInput?: (e: React.MouseEvent<HTMLTextAreaElement>) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
    onKeyUp?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
    onKeyPress?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
    onEnterPress?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
    onPressEnter?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
    onResize?: (data: {height: number}) => void;
    getValueLength?: (value: string) => number;
    forwardRef?: ((instance: HTMLTextAreaElement) => void) | React.MutableRefObject<HTMLTextAreaElement> | null
}

export interface TextAreaState {
    value: string;
    isFocus: boolean;
    isHover: boolean;
    height: number;
    minLength: number;
    cachedValue?: string
}

class TextArea extends BaseComponent<TextAreaProps, TextAreaState> {
    static propTypes = {
        autosize: PropTypes.bool,
        borderless: PropTypes.bool,
        placeholder: PropTypes.string,
        value: PropTypes.string,
        rows: PropTypes.number,
        cols: PropTypes.number,
        maxCount: PropTypes.number,
        onEnterPress: PropTypes.func,
        validateStatus: PropTypes.string,
        className: PropTypes.string,
        style: PropTypes.object,
        showClear: PropTypes.bool,
        onClear: PropTypes.func,
        onResize: PropTypes.func,
        getValueLength: PropTypes.func,
        // TODO
        // resize: PropTypes.bool,
    };

    static defaultProps = {
        autosize: false,
        borderless: false,
        rows: 4,
        cols: 20,
        showCounter: false,
        showClear: false,
        onEnterPress: noop,
        onChange: noop,
        onBlur: noop,
        onFocus: noop,
        onKeyDown: noop,
        onResize: noop,
        onClear: noop,
        // resize: false,
    };

    focusing: boolean;
    libRef: React.RefObject<HTMLInputElement>;
    _resizeLock: boolean;
    _resizeListener: any;
    foundation: TextAreaFoundation;

    constructor(props: TextAreaProps) {
        super(props);
        this.state = {
            value: '',
            isFocus: false,
            isHover: false,
            height: 0,
            minLength: props.minLength,
        };
        this.focusing = false;
        this.foundation = new TextAreaFoundation(this.adapter);

        this.libRef = React.createRef<HTMLInputElement>();
        this._resizeLock = false;
    }

    get adapter() {
        return {
            ...super.adapter,
            setValue: (value: string) => this.setState({ value }, () => {
                if (this.props.autosize) {
                    this.foundation.resizeTextarea();
                }
            }),
            getRef: () => this.libRef.current,
            toggleFocusing: (focusing: boolean) => this.setState({ isFocus: focusing }),
            toggleHovering: (hovering: boolean) => this.setState({ isHover: hovering }),
            notifyChange: (val: string, e: React.MouseEvent<HTMLTextAreaElement>) => {
                this.props.onChange(val, e);
            },
            notifyClear: (e: React.MouseEvent<HTMLTextAreaElement>) => this.props.onClear(e),
            notifyBlur: (val: string, e: React.MouseEvent<HTMLTextAreaElement>) => this.props.onBlur(e),
            notifyFocus: (val: string, e: React.MouseEvent<HTMLTextAreaElement>) => this.props.onFocus(e),
            notifyKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                this.props.onKeyDown(e);
            },
            notifyHeightUpdate: (height: number) => {
                this.setState({ height });
                this.props.onResize({ height });
            },
            notifyPressEnter: (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                this.props.onEnterPress && this.props.onEnterPress(e);
            },
            setMinLength: (minLength: number) => this.setState({ minLength }),
        };
    }

    static getDerivedStateFromProps(props: TextAreaProps, state: TextAreaState) {
        const willUpdateStates: Partial<TextAreaState> = {};

        if (props.value !== state.cachedValue) {
            willUpdateStates.value = props.value;
            willUpdateStates.cachedValue = props.value;
        }

        return willUpdateStates;
    }

    componentDidMount() {
        this.foundation.init();
        this._resizeListener = null;
        if (this.props.autosize) {
            // Working around Firefox bug which runs resize listeners even when other JS is running at the same moment
            // causing competing rerenders (due to setState in the listener) in React.
            // More can be found here - facebook/react#6324
            // // Reference to https://github.com/andreypopp/react-textarea-autosize/
            this._resizeListener = () => {
                if (this._resizeLock) {
                    return;
                }
                this._resizeLock = true;
                this.foundation.resizeTextarea(() => {
                    this._resizeLock = false;
                });
            };
            window.addEventListener('resize', this._resizeListener);
        }
    }

    componentWillUnmount() {
        this.foundation.destroy();
        this._resizeListener && window.removeEventListener('resize', this._resizeListener);
    }

    componentDidUpdate(prevProps: TextAreaProps, prevState: TextAreaState) {

        if ((this.props.value !== prevProps.value || this.props.placeholder !== prevProps.placeholder) && this.props.autosize) {
            this.foundation.resizeTextarea();
        }
    }

    handleClear = (e: React.MouseEvent<HTMLDivElement>) => {
        this.foundation.handleClear(e);
    };

    renderClearBtn() {
        const { showClear } = this.props;
        const displayClearBtn = this.foundation.isAllowClear();
        const clearCls = cls(`${prefixCls}-clearbtn`, {
            [`${prefixCls}-clearbtn-hidden`]: !displayClearBtn,
        });
        if (showClear) {
            return (
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
                <div
                    className={clearCls}
                    onClick={this.handleClear}
                >
                    <IconClear />
                </div>
            );
        }
        return null;
    }

    renderCounter() {
        let counter: React.ReactNode,
            current: number,
            total: number,
            countCls: string;
        const { showCounter, maxCount, getValueLength } = this.props;
        if (showCounter || maxCount) {
            const { value } = this.state;
            // eslint-disable-next-line no-nested-ternary
            current = value ? isFunction(getValueLength) ? getValueLength(value) : value.length : 0;
            total = maxCount || null;
            countCls = cls(
                `${prefixCls}-textarea-counter`,
                {
                    [`${prefixCls}-textarea-counter-exceed`]: current > total
                }
            );
            counter = (
                <div className={countCls}>
                    {current}{total ? '/' : null}{total}
                </div>
            );
        } else {
            counter = null;
        }
        return counter;
    }

    setRef = (node: HTMLTextAreaElement) => {
        (this.libRef as any).current = node;
        const { forwardRef } = this.props;
        if (typeof forwardRef === 'function') {
            forwardRef(node);
        } else if (forwardRef && typeof forwardRef === 'object') {
            forwardRef.current = node;
        }
    };

    render() {
        const {
            autosize,
            placeholder,
            onEnterPress,
            onResize,
            // resize,
            disabled,
            readonly,
            className,
            showCounter,
            validateStatus,
            maxCount,
            defaultValue,
            style,
            forwardRef,
            getValueLength,
            maxLength,
            minLength,
            showClear,
            borderless,
            ...rest
        } = this.props;
        const { isFocus, value, minLength: stateMinLength } = this.state;
        const wrapperCls = cls(
            className,
            `${prefixCls}-textarea-wrapper`,
            {
                [`${prefixCls}-textarea-borderless`]: borderless,
                [`${prefixCls}-textarea-wrapper-disabled`]: disabled,
                [`${prefixCls}-textarea-wrapper-readonly`]: readonly,
                [`${prefixCls}-textarea-wrapper-${validateStatus}`]: Boolean(validateStatus),
                [`${prefixCls}-textarea-wrapper-focus`]: isFocus,
                // [`${prefixCls}-textarea-wrapper-resize`]: !autosize && resize,
            }
        );
        // const ref = this.props.forwardRef || this.textAreaRef;
        const itemCls = cls(
            `${prefixCls}-textarea`,
            {
                [`${prefixCls}-textarea-disabled`]: disabled,
                [`${prefixCls}-textarea-readonly`]: readonly,
                [`${prefixCls}-textarea-autosize`]: autosize,
                [`${prefixCls}-textarea-showClear`]: showClear,
            }
        );
        const itemProps = {
            ...omit(rest, 'insetLabel', 'insetLabelId', 'getValueLength', 'onClear', 'showClear'),
            className: itemCls,
            disabled,
            readOnly: readonly,
            placeholder: !placeholder ? null : placeholder,
            onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => this.foundation.handleChange(e.target.value, e),
            onFocus: (e: React.FocusEvent<HTMLTextAreaElement>) => this.foundation.handleFocus(e),
            onBlur: (e: React.FocusEvent<HTMLTextAreaElement>) => this.foundation.handleBlur(e.nativeEvent),
            onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => this.foundation.handleKeyDown(e),
            value: value === null || value === undefined ? '' : value,
        };
        if (!isFunction(getValueLength)) {
            (itemProps as any).maxLength = maxLength;
        }
        if (stateMinLength) {
            (itemProps as any).minLength = stateMinLength;
        }

        return (
            <div
                className={wrapperCls}
                style={style}
                onMouseEnter={e => this.foundation.handleMouseEnter(e)}
                onMouseLeave={e => this.foundation.handleMouseLeave(e)}
            >
                <textarea {...itemProps} ref={this.setRef} />
                {this.renderClearBtn()}
                {this.renderCounter()}
            </div>
        );
    }
}

const ForwardTextarea = React.forwardRef<HTMLTextAreaElement, Omit<TextAreaProps, 'forwardRef'>>((props, ref) => <TextArea {...props} forwardRef={ref} />);

export default ForwardTextarea;
