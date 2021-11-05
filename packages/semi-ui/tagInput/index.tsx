import React from 'react';
import cls from 'classnames';
import PropTypes from 'prop-types';
import {
    noop,
    isString,
    isArray,
    isNull,
    isUndefined,
    isFunction
} from 'lodash-es';
import { cssClasses, strings } from '@douyinfe/semi-foundation/tagInput/constants';
import '@douyinfe/semi-foundation/tagInput/tagInput.scss';
import TagInputFoundation, { TagInputAdapter } from '@douyinfe/semi-foundation/tagInput/foundation';
import { ArrayElement } from '../_base/base';
import BaseComponent from '../_base/baseComponent';
import Tag from '../tag';
import Input from '../input';
import Popover, { PopoverProps } from '../popover';
import Paragraph from '../typography/paragraph';
import { IconClear } from '@douyinfe/semi-icons';

export type Size = ArrayElement<typeof strings.SIZE_SET>;
export type RestTagsPopoverProps = PopoverProps;
type ValidateStatus = "default" | "error" | "warning";

export interface TagInputProps {
    className?: string;
    defaultValue?: string[];
    disabled?: boolean;
    inputValue?: string;
    maxLength?: number;
    max?: number;
    maxTagCount?: number;
    showRestTagsPopover?: boolean;
    restTagsPopoverProps?: RestTagsPopoverProps;
    showContentTooltip?: boolean;
    allowDuplicates?: boolean;
    addOnBlur?: boolean;
    onAdd?: (addedValue: string[]) => void;
    onBlur?: (e: React.MouseEvent<HTMLInputElement>) => void;
    onChange?: (value: string[]) => void;
    onExceed?: ((value: string[]) => void);
    onFocus?: (e: React.MouseEvent<HTMLInputElement>) => void;
    onInputChange?: (value: string, e: React.MouseEvent<HTMLInputElement>) => void;
    onInputExceed?: ((value: string) => void);
    onRemove?: (removedValue: string, idx: number) => void;
    placeholder?: string;
    prefix?: React.ReactNode;
    renderTagItem?: (value: string, index: number) => React.ReactNode;
    separator?: string | string[] | null;
    showClear?: boolean;
    size?: Size;
    style?: React.CSSProperties;
    suffix?: React.ReactNode;
    validateStatus?: ValidateStatus;
    value?: string[];
    autoFocus?: boolean;
}

export interface TagInputState {
    tagsArray?: string[];
    inputValue?: string;
    focusing?: boolean;
    hovering?: boolean;
}

const prefixCls = cssClasses.PREFIX;

class TagInput extends BaseComponent<TagInputProps, TagInputState> {
    static propTypes = {
        children: PropTypes.node,
        style: PropTypes.object,
        className: PropTypes.string,
        disabled: PropTypes.bool,
        allowDuplicates: PropTypes.bool,
        max: PropTypes.number,
        maxTagCount: PropTypes.number,
        maxLength: PropTypes.number,
        showRestTagsPopover: PropTypes.bool,
        restTagsPopoverProps: PropTypes.object,
        showContentTooltip: PropTypes.bool,
        defaultValue: PropTypes.array,
        value: PropTypes.array,
        inputValue: PropTypes.string,
        placeholder: PropTypes.string,
        separator: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
        showClear: PropTypes.bool,
        addOnBlur: PropTypes.bool,
        autoFocus: PropTypes.bool,
        renderTagItem: PropTypes.func,
        onBlur: PropTypes.func,
        onFocus: PropTypes.func,
        onChange: PropTypes.func,
        onInputChange: PropTypes.func,
        onExceed: PropTypes.func,
        onInputExceed: PropTypes.func,
        onAdd: PropTypes.func,
        onRemove: PropTypes.func,
        size: PropTypes.oneOf(strings.SIZE_SET),
        validateStatus: PropTypes.oneOf(strings.STATUS),
        prefix: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
        suffix: PropTypes.oneOfType([PropTypes.string, PropTypes.node])
    };

    static defaultProps = {
        showClear: false,
        addOnBlur: false,
        allowDuplicates: true,
        showRestTagsPopover: true,
        autoFocus: false,
        showContentTooltip: true,
        separator: ',',
        size: 'default' as const,
        validateStatus: 'default' as const,
        onBlur: noop,
        onFocus: noop,
        onChange: noop,
        onInputChange: noop,
        onExceed: noop,
        onInputExceed: noop,
        onAdd: noop,
        onRemove: noop
    };

    inputRef: React.RefObject<HTMLInputElement>;
    constructor(props: TagInputProps) {
        super(props);
        this.foundation = new TagInputFoundation(this.adapter);
        this.state = {
            tagsArray: props.defaultValue || [],
            inputValue: '',
            focusing: false,
            hovering: false
        };
        this.inputRef = React.createRef();
    }

    static getDerivedStateFromProps(nextProps: TagInputProps, prevState: TagInputState) {
        const {
            value,
            inputValue,
        } = nextProps;
        return {
            tagsArray: isArray(value) ? value : prevState.tagsArray,
            inputValue: isString(inputValue) ? inputValue : prevState.inputValue
        };
    }

    get adapter(): TagInputAdapter {
        return {
            ...super.adapter,
            setInputValue: (inputValue: string) => {
                this.setState({ inputValue });
            },
            setTagsArray: (tagsArray: string[]) => {
                this.setState({ tagsArray });
            },
            setFocusing: (focusing: boolean) => {
                this.setState({ focusing });
            },
            setHovering: (hovering: boolean) => {
                this.setState({ hovering });
            },
            notifyBlur: (e: React.MouseEvent<HTMLInputElement>) => {
                this.props.onBlur(e);
            },
            notifyFocus: (e: React.MouseEvent<HTMLInputElement>) => {
                this.props.onFocus(e);
            },
            notifyInputChange: (v: string, e: React.MouseEvent<HTMLInputElement>) => {
                this.props.onInputChange(v, e);
            },
            notifyTagChange: (v: string[]) => {
                this.props.onChange(v);
            },
            notifyTagAdd: (v: string[]) => {
                this.props.onAdd(v);
            },
            notifyTagRemove: (v: string, idx: number) => {
                this.props.onRemove(v, idx);
            }
        };
    }

    componentDidMount() {
        const { disabled, autoFocus } = this.props;
        if (!disabled && autoFocus) {
            this.inputRef.current.focus();
        }
    }

    handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.foundation.handleInputChange(e);
    };

    handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        this.foundation.handleKeyDown(e);
    };

    handleInputFocus = (e: React.MouseEvent<HTMLInputElement>) => {
        this.foundation.handleInputFocus(e);
    };

    handleInputBlur = (e: React.MouseEvent<HTMLInputElement>) => {
        this.foundation.handleInputBlur(e);
    };

    handleClearBtn = (e: React.MouseEvent<HTMLDivElement>) => {
        this.foundation.handleClearBtn(e);
    };

    handleTagClose = (idx: number) => {
        this.foundation.handleTagClose(idx);
    };

    handleInputMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
        this.foundation.handleInputMouseLeave();
    };

    handleInputMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
        this.foundation.handleInputMouseEnter();
    };

    renderClearBtn() {
        const { hovering, tagsArray, inputValue } = this.state;
        const { showClear, disabled } = this.props;
        const clearCls = cls(`${prefixCls}-clearBtn`, {
            [`${prefixCls}-clearBtn-invisible`]: !hovering || (inputValue === '' && tagsArray.length === 0) || disabled,
        });
        if (showClear) {
            return (
                <div className={clearCls} onClick={e => this.handleClearBtn(e)}>
                    <IconClear />
                </div>
            );
        }
        return null;
    }

    renderPrefix() {
        const { prefix } = this.props;
        if (isNull(prefix) || isUndefined(prefix)) {
            return null;
        }
        const prefixWrapperCls = cls(`${prefixCls}-prefix`, {
            [`${prefixCls}-prefix-text`]: prefix && isString(prefix),
            // eslint-disable-next-line max-len
            [`${prefixCls}-prefix-icon`]: React.isValidElement(prefix) && !(prefix && isString(prefix)),
        });
        return <div className={prefixWrapperCls}>{prefix}</div>;
    }

    renderSuffix() {
        const { suffix } = this.props;
        if (isNull(suffix) || isUndefined(suffix)) {
            return null;
        }
        const suffixWrapperCls = cls(`${prefixCls}-suffix`, {
            [`${prefixCls}-suffix-text`]: suffix && isString(suffix),
            // eslint-disable-next-line max-len
            [`${prefixCls}-suffix-icon`]: React.isValidElement(suffix) && !(suffix && isString(suffix)),
        });
        return <div className={suffixWrapperCls}>{suffix}</div>;
    }

    renderTags() {
        const {
            size,
            disabled,
            renderTagItem,
            maxTagCount,
            showContentTooltip,
            showRestTagsPopover,
            restTagsPopoverProps = {},
        } = this.props;
        const { tagsArray } = this.state;
        const tagCls = cls(`${prefixCls}-wrapper-tag`, {
            [`${prefixCls}-wrapper-tag-size-${size}`]: size,
        });
        const typoCls = cls(`${prefixCls}-wrapper-typo`, {
            [`${prefixCls}-wrapper-typo-disabled`]: disabled
        });
        const spanNotWithPopoverCls = cls(`${prefixCls}-wrapper-n`, {
            [`${prefixCls}-wrapper-n-disabled`]: disabled
        });
        const restTags: Array<React.ReactNode> = [];
        const tags: Array<React.ReactNode> = [];
        tagsArray.forEach((value, index) => {
            let item = null;
            if (isFunction(renderTagItem)) {
                item = renderTagItem(value, index);
            } else {
                item = (
                    <Tag
                        className={tagCls}
                        color="white"
                        size={size === 'small' ? 'small' : 'large'}
                        type="light"
                        onClose={() => {
                            !disabled && this.handleTagClose(index);
                        }}
                        closable={!disabled}
                        key={`${index}${value}`}
                        visible
                    >
                        <Paragraph
                            className={typoCls}
                            ellipsis={{ showTooltip: showContentTooltip, rows: 1 }}
                        >
                            {value}
                        </Paragraph>
                    </Tag>
                );
            }
            if (maxTagCount && index >= maxTagCount) {
                restTags.push(item);
            } else {
                tags.push(item);
            }
        });
        return (
            <>
                {tags}
                {
                    restTags.length > 0 &&
                    (
                        showRestTagsPopover && !disabled ?
                            (
                                <Popover
                                    content={restTags}
                                    showArrow
                                    trigger="hover"
                                    position="top"
                                    autoAdjustOverflow
                                    {...restTagsPopoverProps}
                                >
                                    <span className={cls(`${prefixCls}-wrapper-n`)}>
                                        +{tagsArray.length - maxTagCount}
                                    </span>
                                </Popover>
                            ) :
                            (
                                <span className={spanNotWithPopoverCls}>
                                    {`+${tagsArray.length - maxTagCount}`}
                                </span>
                            )
                    )
                }
            </>
        );
    }

    blur() {
        this.inputRef.current.blur();
    }

    focus() {
        this.inputRef.current.focus();
    }

    render() {
        const {
            size,
            style,
            className,
            disabled,
            placeholder,
            validateStatus,
        } = this.props;

        const {
            focusing,
            hovering,
            tagsArray,
            inputValue
        } = this.state;

        const tagInputCls = cls(prefixCls, className, {
            [`${prefixCls}-focus`]: focusing,
            [`${prefixCls}-disabled`]: disabled,
            [`${prefixCls}-hover`]: hovering && !disabled,
            [`${prefixCls}-error`]: validateStatus === 'error',
            [`${prefixCls}-warning`]: validateStatus === 'warning'
        });

        const inputCls = cls(`${prefixCls}-wrapper-input`);

        const wrapperCls = cls(`${prefixCls}-wrapper`);

        return (
            <div
                style={style}
                className={tagInputCls}
                onMouseEnter={e => {
                    this.handleInputMouseEnter(e);
                }}
                onMouseLeave={e => {
                    this.handleInputMouseLeave(e);
                }}
            >
                {this.renderPrefix()}
                <div className={wrapperCls}>
                    {this.renderTags()}
                    <Input
                        ref={this.inputRef as any}
                        className={inputCls}
                        disabled={disabled}
                        value={inputValue}
                        size={size}
                        placeholder={tagsArray.length === 0 ? placeholder : ''}
                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                            this.handleKeyDown(e);
                        }}
                        onChange={(v: string, e: React.ChangeEvent<HTMLInputElement>) => {
                            this.handleInputChange(e);
                        }}
                        onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                            this.handleInputBlur(e as any);
                        }}
                        onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
                            this.handleInputFocus(e as any);
                        }}
                    />
                </div>
                {this.renderClearBtn()}
                {this.renderSuffix()}
            </div>
        );
    }
}

export default TagInput;
export { ValidateStatus };