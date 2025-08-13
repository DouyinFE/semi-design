import React from 'react';
import cls from 'classnames';
import PropTypes from 'prop-types';
import TextAreaFoundation from '@douyinfe/semi-foundation/input/textareaFoundation';
import { cssClasses } from '@douyinfe/semi-foundation/input/constants';
import BaseComponent, { ValidateStatus } from '../_base/baseComponent';
import '@douyinfe/semi-foundation/input/textarea.scss';
import { noop, omit, isFunction, isUndefined, isObject, throttle } from 'lodash';
import type { DebouncedFunc } from 'lodash';
import { IconClear } from '@douyinfe/semi-icons';
import ResizeObserver from '../resizeObserver';

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
    | 'onResize';

export type AutosizeRow = {
    minRows?: number;
    maxRows?: number
};

export interface TextAreaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, OmitTextareaAttr> {
    autosize?: boolean | AutosizeRow;
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
    autoFocus?: boolean;
    showCounter?: boolean;
    showClear?: boolean;
    /** 是否显示行号 */
    showLineNumbers?: boolean;
    /** 行号起始值，默认 1 */
    lineNumberStart?: number;
    /** 行号列宽度（px），默认 40 */
    lineNumberWidth?: number;
    /** 预留的行号最大位数，设置后行号栏宽度将固定，不会随位数变化抖动 */
    lineNumberMaxDigits?: number;
    /** 自定义渲染行号 */
    renderLineNumber?: (lineNumber: number) => React.ReactNode;
    onClear?: (e: React.MouseEvent<HTMLTextAreaElement>) => void;
    onChange?: (value: string, e: React.MouseEvent<HTMLTextAreaElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
    onFocus?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
    onInput?: (e: React.MouseEvent<HTMLTextAreaElement>) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
    onKeyUp?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
    onKeyPress?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
    onEnterPress?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
    onPressEnter?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
    onResize?: (data: { height: number }) => void;
    getValueLength?: (value: string) => number;
    forwardRef?: ((instance: HTMLTextAreaElement) => void) | React.MutableRefObject<HTMLTextAreaElement> | null;
    /* Inner params for TextArea, Chat use it, 。
       Used to disable line breaks by pressing the enter key。
       Press enter + shift at the same time can start new line.
    */
    disabledEnterStartNewLine?: boolean
}

export interface TextAreaState {
    value: string;
    isFocus: boolean;
    isHover: boolean;
    height: number;
    minLength: number;
    /** 视口可见行数（用于保证行号填满可视区） */
    displayLineCount?: number;
    cachedValue?: string
}

class TextArea extends BaseComponent<TextAreaProps, TextAreaState> {
    static propTypes = {
        autosize: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
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
        showLineNumbers: PropTypes.bool,
        lineNumberStart: PropTypes.number,
        lineNumberWidth: PropTypes.number,
        renderLineNumber: PropTypes.func,
        onClear: PropTypes.func,
        onResize: PropTypes.func,
        getValueLength: PropTypes.func,
        disabledEnterStartNewLine: PropTypes.bool,
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
        showLineNumbers: false,
        lineNumberStart: 1,
        lineNumberWidth: 40,
        lineNumberMaxDigits: undefined,
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
    foundation: TextAreaFoundation;
    throttledResizeTextarea: DebouncedFunc<typeof this.foundation.resizeTextarea>;
    lineNumberGutterRef: React.RefObject<HTMLDivElement>;
    lineNumberContentRef: React.RefObject<HTMLDivElement>;

    constructor(props: TextAreaProps) {
        super(props);
        const initValue = 'value' in props ? props.value : props.defaultValue;
        this.state = {
            value: initValue,
            isFocus: false,
            isHover: false,
            height: 0,
            minLength: props.minLength,
            displayLineCount: props?.rows || 1,
            cachedValue: props.value,
        };
        this.focusing = false;
        this.foundation = new TextAreaFoundation(this.adapter);

        this.libRef = React.createRef<HTMLInputElement>();
        this.throttledResizeTextarea = throttle(this.foundation.resizeTextarea, 10);
        this.lineNumberGutterRef = React.createRef<HTMLDivElement>();
        this.lineNumberContentRef = React.createRef<HTMLDivElement>();
    }

    get adapter() {
        return {
            ...super.adapter,
            setValue: (value: string) =>
                this.setState({ value }, () => {
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
            notifyBlur: (val: string, e: React.FocusEvent<HTMLTextAreaElement>) => this.props.onBlur(e),
            notifyFocus: (val: string, e: React.FocusEvent<HTMLTextAreaElement>) => this.props.onFocus(e),
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

    componentWillUnmount(): void {
        if (this.throttledResizeTextarea) {
            this.throttledResizeTextarea?.cancel?.();
            this.throttledResizeTextarea = null;
        }
    }

    componentDidMount(): void {
        this.syncLineNumberLineHeight();
        this.updateDisplayLineCount();
    }

    componentDidUpdate(prevProps: TextAreaProps, prevState: TextAreaState) {
        if (
            (this.props.value !== prevProps.value || this.props.placeholder !== prevProps.placeholder) &&
            this.props.autosize
        ) {
            this.foundation.resizeTextarea();
        }
        // 同步滚动位置（通过内容容器 translateY，实现与 textarea 垂直滚动同步）
        const textEl = this.libRef?.current as unknown as HTMLTextAreaElement;
        const contentEl = this.lineNumberContentRef?.current as HTMLDivElement;
        if (textEl && contentEl) {
            contentEl.style.transform = `translateY(${-textEl.scrollTop}px)`;
        }
        this.syncLineNumberLineHeight();
        this.updateDisplayLineCount();
    }

    private syncLineNumberLineHeight() {
        const textEl = this.libRef?.current as unknown as HTMLTextAreaElement;
        const gutter = this.lineNumberGutterRef?.current as HTMLDivElement;
        if (!textEl || !gutter) return;
        if (typeof window === 'undefined' || typeof window.getComputedStyle !== 'function') return;
        const computed = window.getComputedStyle(textEl);
        const lh = computed.lineHeight;
        if (lh && gutter.style.getPropertyValue('--semi-input-textarea-lineheight') !== lh) {
            gutter.style.setProperty('--semi-input-textarea-lineheight', lh);
        }
        const fs = computed.fontSize;
        if (fs) {
            gutter.style.setProperty('font-size', fs);
        }
    }

    private updateDisplayLineCount() {
        const textEl = this.libRef?.current as unknown as HTMLTextAreaElement;
        if (!textEl) return;
        if (typeof window === 'undefined' || typeof window.getComputedStyle !== 'function') return;
        const computed = window.getComputedStyle(textEl);
        const lhStr = computed.lineHeight;
        const lineHeight = lhStr.endsWith('px') ? parseFloat(lhStr) : parseFloat(lhStr) || 16;
        const clientH = textEl.clientHeight || 0;
        const visible = lineHeight > 0 ? Math.ceil(clientH / lineHeight) : (this.props.rows || 1);
        if (visible && visible !== this.state.displayLineCount) {
            this.setState({ displayLineCount: visible });
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
                <div className={clearCls} onClick={this.handleClear}>
                    <IconClear />
                </div>
            );
        }
        return null;
    }

    renderCounter() {
        let counter: React.ReactNode, current: number, total: number, countCls: string;
        const { showCounter, maxCount, getValueLength } = this.props;
        if (showCounter || maxCount) {
            const { value } = this.state;
            // eslint-disable-next-line no-nested-ternary
            current = value ? (isFunction(getValueLength) ? getValueLength(value) : value.length) : 0;
            total = maxCount || null;
            countCls = cls(`${prefixCls}-textarea-counter`, {
                [`${prefixCls}-textarea-counter-exceed`]: current > total,
            });
            counter = (
                <div className={countCls}>
                    {current}
                    {total ? '/' : null}
                    {total}
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
            autoFocus,
            showLineNumbers,
            lineNumberStart,
            lineNumberWidth,
            lineNumberMaxDigits,
            renderLineNumber,
            ...rest
        } = this.props;
        const { isFocus, value, minLength: stateMinLength } = this.state;
        const wrapperCls = cls(className, `${prefixCls}-textarea-wrapper`, {
            [`${prefixCls}-textarea-borderless`]: borderless,
            [`${prefixCls}-textarea-wrapper-disabled`]: disabled,
            [`${prefixCls}-textarea-wrapper-readonly`]: readonly,
            [`${prefixCls}-textarea-wrapper-${validateStatus}`]: Boolean(validateStatus),
            [`${prefixCls}-textarea-wrapper-focus`]: isFocus,
            // [`${prefixCls}-textarea-wrapper-resize`]: !autosize && resize,
        });
        // const ref = this.props.forwardRef || this.textAreaRef;
        const itemCls = cls(`${prefixCls}-textarea`, {
            [`${prefixCls}-textarea-disabled`]: disabled,
            [`${prefixCls}-textarea-readonly`]: readonly,
            [`${prefixCls}-textarea-autosize`]: isObject(autosize) ? isUndefined(autosize?.maxRows) : autosize,
            [`${prefixCls}-textarea-showClear`]: showClear,
            [`${prefixCls}-textarea-withLineNumbers`]: showLineNumbers,
        });
        const logicalLines = typeof value === 'string' && value.length > 0 ? value.split(/\r\n|\r|\n/).length : 0;
        const minRows = this.props.rows || 1;
        const lineCount = Math.max(logicalLines || minRows, this.state.displayLineCount || minRows);
        const currentMaxDigits = String((lineNumberStart as number) + Math.max(lineCount - 1, 0)).length;
        const reservedDigits = Math.max(lineNumberMaxDigits || 0, currentMaxDigits);
        const gutterWidthVar = lineNumberMaxDigits
            ? `calc(${reservedDigits}ch + 16px)`
            : `${lineNumberWidth}px`;
        const gutterStyle: React.CSSProperties = {
            ['--semi-input-textarea-linenumber-width' as any]: gutterWidthVar,
        };
        const itemProps = {
            ...omit(rest, 'insetLabel', 'insetLabelId', 'getValueLength', 'onClear', 'showClear', 'disabledEnterStartNewLine'),
            autoFocus: autoFocus || this.props['autofocus'],
            className: itemCls,
            disabled,
            readOnly: readonly,
            placeholder: !placeholder ? null : placeholder,
            onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => this.foundation.handleChange(e.target.value, e),
            onFocus: (e: React.FocusEvent<HTMLTextAreaElement>) => this.foundation.handleFocus(e),
            onBlur: (e: React.FocusEvent<HTMLTextAreaElement>) => this.foundation.handleBlur(e.nativeEvent),
            onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => this.foundation.handleKeyDown(e),
            onScroll: (e: React.UIEvent<HTMLTextAreaElement>) => {
                const target = e.currentTarget;
                const contentEl = this.lineNumberContentRef?.current as HTMLDivElement;
                if (contentEl) contentEl.style.transform = `translateY(${-target.scrollTop}px)`;
            },
            value: value === null || value === undefined ? '' : value,
            onCompositionStart: this.foundation.handleCompositionStart,
            onCompositionEnd: this.foundation.handleCompositionEnd,
            style: showLineNumbers ? { paddingLeft: 'calc(40px + 16px)' } : undefined,
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
                {showLineNumbers ? (
                    <div className={`${prefixCls}-textarea-linenumbers`} style={gutterStyle} ref={this.lineNumberGutterRef} aria-hidden={true}>
                        <div className={`${prefixCls}-textarea-linenumbers-content`} ref={this.lineNumberContentRef}>
                            {Array.from({ length: lineCount }, (_, idx) => {
                                const num = (lineNumberStart as number) + idx;
                                return (
                                    <div key={idx} className={`${prefixCls}-textarea-linenumbers-item`}>
                                        {typeof renderLineNumber === 'function' ? renderLineNumber(num) : num}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : null}
                {autosize ? (
                    <ResizeObserver onResize={this.throttledResizeTextarea}>
                        <textarea {...itemProps} ref={this.setRef} />
                    </ResizeObserver>
                ) : (
                    <textarea {...itemProps} ref={this.setRef} />
                )}
                {this.renderClearBtn()}
                {this.renderCounter()}
            </div>
        );
    }
}

const ForwardTextarea = React.forwardRef<HTMLTextAreaElement, Omit<TextAreaProps, 'forwardRef'>>((props, ref) => (
    <TextArea {...props} forwardRef={ref} />
));

export default ForwardTextarea;
