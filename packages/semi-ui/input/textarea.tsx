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
import type { CSSProperties } from 'react';

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
    disabledEnterStartNewLine?: boolean;
    /** Whether to show line numbers */
    showLineNumber?: boolean;
    /** The starting line number, default is 1 */
    lineNumberStart?: number;
    /** Custom className for line number area */
    lineNumberClassName?: string;
    /** Custom style for line number area */
    lineNumberStyle?: CSSProperties;
}

export interface TextAreaState {
    value: string;
    isFocus: boolean;
    isHover: boolean;
    height: number;
    minLength: number;
    cachedValue?: string;
    // Used to trigger re-render of line numbers when textarea resizes
    textareaWidth: number;
    // Used to constrain line number panel height to textarea viewport
    textareaHeight: number;
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
        onClear: PropTypes.func,
        onResize: PropTypes.func,
        onCompositionStart: PropTypes.func,
        onCompositionEnd: PropTypes.func,
        onCompositionUpdate: PropTypes.func,
        getValueLength: PropTypes.func,
        disabledEnterStartNewLine: PropTypes.bool,
        showLineNumber: PropTypes.bool,
        lineNumberStart: PropTypes.number,
        lineNumberClassName: PropTypes.string,
        lineNumberStyle: PropTypes.object,
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
        onCompositionStart: noop,
        onCompositionEnd: noop,
        onCompositionUpdate: noop,
        showLineNumber: false,
        lineNumberStart: 1,
        // resize: false,
    };

    focusing: boolean;
    libRef: React.RefObject<HTMLInputElement>;
    foundation: TextAreaFoundation;
    throttledResizeTextarea: DebouncedFunc<typeof this.foundation.resizeTextarea>;
    lineNumberRef: React.RefObject<HTMLDivElement>;
    lineNumberResizeObserver: globalThis.ResizeObserver | null;

    constructor(props: TextAreaProps) {
        super(props);
        const initValue = 'value' in props ? props.value : props.defaultValue;
        this.state = {
            value: initValue,
            isFocus: false,
            isHover: false,
            height: 0,
            minLength: props.minLength,
            cachedValue: props.value,
            textareaWidth: 0,
            textareaHeight: 0,
        };
        this.focusing = false;
        this.foundation = new TextAreaFoundation(this.adapter);
        this.lineNumberResizeObserver = null;

        this.libRef = React.createRef<HTMLInputElement>();
        this.lineNumberRef = React.createRef<HTMLDivElement>();
        this.throttledResizeTextarea = throttle(this.foundation.resizeTextarea, 10);
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
            notifyCompositionStart: (e: React.CompositionEvent<HTMLTextAreaElement>) => this.props.onCompositionStart(e),
            notifyCompositionEnd: (e: React.CompositionEvent<HTMLTextAreaElement>) => this.props.onCompositionEnd(e),
            notifyCompositionUpdate: (e: React.CompositionEvent<HTMLTextAreaElement>) => this.props.onCompositionUpdate(e),
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

    componentDidMount(): void {
        // Setup resize observer for line number recalculation
        if (this.props.showLineNumber && this.libRef.current && typeof globalThis.ResizeObserver !== 'undefined') {
            const textarea = this.libRef.current as unknown as HTMLTextAreaElement;
            this.setState({ textareaWidth: textarea.clientWidth, textareaHeight: textarea.clientHeight });
            
            this.lineNumberResizeObserver = new globalThis.ResizeObserver((entries) => {
                for (const entry of entries) {
                    // contentRect does not include borders; align with textarea.clientHeight
                    const nextWidth = entry.contentRect.width;
                    const nextHeight = entry.contentRect.height;
                    this.setState({ textareaWidth: nextWidth, textareaHeight: nextHeight });
                }
            });
            this.lineNumberResizeObserver.observe(textarea);
        }
    }

    componentWillUnmount(): void {
        if (this.throttledResizeTextarea) {
            this.throttledResizeTextarea?.cancel?.();
            this.throttledResizeTextarea = null;
        }
        if (this.lineNumberResizeObserver) {
            this.lineNumberResizeObserver.disconnect();
            this.lineNumberResizeObserver = null;
        }
    }

    componentDidUpdate(prevProps: TextAreaProps, prevState: TextAreaState) {
        if (
            (this.props.value !== prevProps.value || this.props.placeholder !== prevProps.placeholder) &&
            this.props.autosize
        ) {
            this.foundation.resizeTextarea();
        }
        
        // Setup/cleanup resize observer when showLineNumber changes
        if (this.props.showLineNumber !== prevProps.showLineNumber) {
            if (this.props.showLineNumber && this.libRef.current && typeof globalThis.ResizeObserver !== 'undefined') {
                const textarea = this.libRef.current as unknown as HTMLTextAreaElement;
                this.setState({ textareaWidth: textarea.clientWidth, textareaHeight: textarea.clientHeight });
                
                if (!this.lineNumberResizeObserver) {
                    this.lineNumberResizeObserver = new globalThis.ResizeObserver((entries) => {
                        for (const entry of entries) {
                            const nextWidth = entry.contentRect.width;
                            const nextHeight = entry.contentRect.height;
                            this.setState({ textareaWidth: nextWidth, textareaHeight: nextHeight });
                        }
                    });
                }
                this.lineNumberResizeObserver.observe(textarea);
            } else if (this.lineNumberResizeObserver) {
                this.lineNumberResizeObserver.disconnect();
                this.lineNumberResizeObserver = null;
            }
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

    handleTextAreaScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
        const { showLineNumber } = this.props;
        if (showLineNumber && this.lineNumberRef.current) {
            // Use rAF to avoid layout thrash
            requestAnimationFrame(() => {
                const panel = this.lineNumberRef.current;
                if (panel) {
                    panel.scrollTop = (e.target as HTMLTextAreaElement).scrollTop;
                }
            });
        }
    };

    getTextareaLineHeightPx = (textarea: HTMLTextAreaElement): number => {
        const computedStyle = window.getComputedStyle(textarea);
        const lineHeightStr = computedStyle.lineHeight;
        const fontSize = parseFloat(computedStyle.fontSize) || 14;
        if (!lineHeightStr || lineHeightStr === 'normal') {
            // Browsers typically use ~1.2, but Semi textarea visually closer to 1.5
            return fontSize * 1.5;
        }
        const parsed = parseFloat(lineHeightStr);
        return Number.isFinite(parsed) && parsed > 0 ? parsed : fontSize * 1.5;
    };

    // Calculate the number of wrapped lines for a given text line
    calculateWrappedLines = (line: string, textarea: HTMLTextAreaElement): number => {
        if (!line) return 1;
        
        const computedStyle = window.getComputedStyle(textarea);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) return 1;
        
        // Set font to match textarea
        const fontSize = computedStyle.fontSize;
        const fontFamily = computedStyle.fontFamily;
        ctx.font = `${fontSize} ${fontFamily}`;
        
        // Calculate available width (excluding padding and scrollbar)
        const paddingLeft = parseFloat(computedStyle.paddingLeft) || 0;
        const paddingRight = parseFloat(computedStyle.paddingRight) || 0;
        const textareaWidth = textarea.clientWidth - paddingLeft - paddingRight;
        
        if (textareaWidth <= 0) return 1;
        
        // Measure text width
        const metrics = ctx.measureText(line);
        const textWidth = metrics.width;
        
        // Calculate wrapped lines
        const wrappedLines = Math.ceil(textWidth / textareaWidth);
        return Math.max(1, wrappedLines);
    };

    renderLineNumbers() {
        const { showLineNumber, lineNumberStart = 1, lineNumberClassName, lineNumberStyle } = this.props;
        if (!showLineNumber) {
            return null;
        }
        // Reference textareaWidth to trigger re-render when textarea resizes
        const { value, textareaWidth, textareaHeight } = this.state;
        const textarea = this.libRef.current as unknown as HTMLTextAreaElement;
        const lines = value ? value.split('\n') : [''];
        
        const lineNumberCls = cls(`${prefixCls}-textarea-lineNumber`, lineNumberClassName);
        const lineHeightPx = textarea ? this.getTextareaLineHeightPx(textarea) : 21;

        // Constrain panel height to textarea viewport height to prevent expanding textarea
        const mergedStyle: CSSProperties = {
            ...(lineNumberStyle || {}),
            height: textareaHeight ? `${textareaHeight}px` : undefined,
            maxHeight: textareaHeight ? `${textareaHeight}px` : undefined,
        };

        return (
            <div
                ref={this.lineNumberRef}
                className={lineNumberCls}
                style={mergedStyle}
            >
                {lines.map((line, i) => {
                    // Calculate wrapped lines for this line
                    const wrappedLineCount = textarea ? this.calculateWrappedLines(line, textarea) : 1;
                    
                    return (
                        <div 
                            key={i} 
                            className={`${prefixCls}-textarea-lineNumber-item`}
                            style={{ 
                                minHeight: `${wrappedLineCount * lineHeightPx}px`,
                                lineHeight: `${lineHeightPx}px`
                            }}
                        >
                            {lineNumberStart + i}
                        </div>
                    );
                })}
            </div>
        );
    }

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
            showLineNumber,
            lineNumberStart,
            lineNumberClassName,
            lineNumberStyle,
            ...rest
        } = this.props;
        const { isFocus, value, minLength: stateMinLength } = this.state;
        const wrapperCls = cls(className, `${prefixCls}-textarea-wrapper`, {
            [`${prefixCls}-textarea-borderless`]: borderless,
            [`${prefixCls}-textarea-wrapper-disabled`]: disabled,
            [`${prefixCls}-textarea-wrapper-readonly`]: readonly,
            [`${prefixCls}-textarea-wrapper-${validateStatus}`]: Boolean(validateStatus),
            [`${prefixCls}-textarea-wrapper-focus`]: isFocus,
            [`${prefixCls}-textarea-wrapper-withLineNumber`]: showLineNumber,
            // [`${prefixCls}-textarea-wrapper-resize`]: !autosize && resize,
        });
        // const ref = this.props.forwardRef || this.textAreaRef;
        const itemCls = cls(`${prefixCls}-textarea`, {
            [`${prefixCls}-textarea-disabled`]: disabled,
            [`${prefixCls}-textarea-readonly`]: readonly,
            [`${prefixCls}-textarea-autosize`]: isObject(autosize) ? isUndefined(autosize?.maxRows) : autosize,
            [`${prefixCls}-textarea-showClear`]: showClear,
        });
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
            onScroll: this.handleTextAreaScroll,
            value: value === null || value === undefined ? '' : value,
            onCompositionStart: this.foundation.handleCompositionStart,
            onCompositionEnd: this.foundation.handleCompositionEnd,
            onCompositionUpdate: this.foundation.handleCompositionUpdate,
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
                {this.renderLineNumbers()}
                {showLineNumber ? (
                    <div className={`${prefixCls}-textarea-content`}>
                        {autosize ? (
                            <ResizeObserver onResize={this.throttledResizeTextarea}>
                                <textarea {...itemProps} ref={this.setRef} />
                            </ResizeObserver>
                        ) : (
                            <textarea {...itemProps} ref={this.setRef} />
                        )}
                    </div>
                ) : autosize ? (
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
