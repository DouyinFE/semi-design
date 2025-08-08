/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Children } from 'react';
import cls from 'classnames';
import { cssClasses, strings } from '@douyinfe/semi-foundation/feedback/constants';
import '@douyinfe/semi-foundation/feedback/feedback.scss';
import BaseComponent from '../_base/baseComponent';
import { ArrayElement } from '../_base/base';
import { TextArea, RadioGroup, CheckboxGroup, Button, Modal, SideSheet } from '..';
import { RadioGroupProps } from '../radio/radioGroup';
import { CheckboxGroupProps } from '../checkbox/checkboxGroup';
import { omit } from 'lodash';
import { ModalReactProps } from '../modal';
import { SideSheetReactProps } from '../sideSheet';
import { TextAreaProps } from '../input/textarea';
import { Locale } from '../locale/interface';
import LocaleConsumer from '../locale/localeConsumer';

const { Emoji } = strings;

const prefixCls = cssClasses.PREFIX;

export interface BasicFeedbackProps {
    showThankText?: boolean;
    mode?: ArrayElement<typeof strings.MODE>;
    type?: ArrayElement<typeof strings.TYPE>;
    onValueChange?: (value: FeedbackValue) => void; 
    textareaProps?: TextAreaProps;
    radioProps?: RadioGroupProps;
    checkboxProps?: CheckboxGroupProps;
    renderContent?: (content: React.ReactNode) => React.ReactNode
}

export interface FeedbackModalProps extends ModalReactProps, BasicFeedbackProps {
}

export interface FeedbackSideSheetProps extends SideSheetReactProps, BasicFeedbackProps {
    onOk?: (e: React.MouseEvent | React.KeyboardEvent) => void
}

export type FeedbackProps = FeedbackModalProps | FeedbackSideSheetProps;

interface EmojiResult {
    emoji?: string;
    text?: string
}

type FeedbackValue = string | string[] | EmojiResult;

interface FeedbackState {
    value: FeedbackValue
}

export default class Feedback extends BaseComponent<FeedbackProps, FeedbackState> {

    static defaultProps = {
        mode: 'popup',
        type: 'emoji',
        showThankText: true,
        onValueChange: () => {}
    };


    constructor(props: FeedbackProps) {
        super(props);
        this.state = {
            value: null,
        };
    }

    handleRadioChange = (e: any) => {
        const { value } = e.target;
        const { onChange } = this.props?.radioProps;
        onChange?.(e);
        this.handleValueChange(value);
    }

    handleValueChange = (value: FeedbackValue) => {
        this.setState({
            value: value,
        });
        this.props.onValueChange?.(value);
    }

    handleEmojiReasonChange = (value: string, e?: React.MouseEvent<HTMLTextAreaElement>) => {
        const { textareaProps = {} } = this.props;
        const { onChange } = textareaProps ;
        onChange?.(value, e);
        const { value: oldValue } = this.state;
        const newValue = {
            ...(oldValue as EmojiResult),
            text: value,
        } as EmojiResult;
        this.setState({
            value: newValue
        });
        this.props.onValueChange?.(newValue);
    }

    handleTextChange = (value: string, e?: React.MouseEvent<HTMLTextAreaElement>) => {
        const { textareaProps = {} } = this.props;
        const { onChange } = textareaProps ;
        onChange?.(value, e);
        this.handleValueChange(value);
    }

    textNode = () => {
        const { textareaProps } = this.props;
        return <TextArea
            onChange={this.handleTextChange}
            placeholder='Provider additional feedback'
            {...textareaProps}
        />;
    }

    handleEmojiClick = (e: React.MouseEvent<HTMLSpanElement>) => {
        const { value } = e.currentTarget.dataset;
        this.handleValueChange({
            emoji: value,
        });
    }

    emojiNode = () => {
        const { value } = this.state;
        const { textareaProps } = this.props;
        const { emoji } = (value ?? {}) as EmojiResult;
        return <>
            <div className={`${prefixCls}-emoji-container`}>
                {Object.values(Emoji).map(item => (
                    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
                    <span
                        key={item} 
                        className={cls(`${prefixCls}-emoji-item`, { [`${prefixCls}-emoji-item-selected`]: item === emoji })}
                        data-value={item} 
                        onClick={this.handleEmojiClick}
                    >{item}</span>
                ))}
            </div>
            {emoji === Emoji.bad && <TextArea
                onChange={this.handleEmojiReasonChange}
                placeholder='Provider additional feedback(optional)'
                {...textareaProps}
            />}
        </>;
    }

    radioNode = () => {
        const { radioProps } = this.props;
        return <div className={`${prefixCls}-radio-container`}>
            <RadioGroup
                direction='vertical'
                onChange={this.handleRadioChange}
                {...omit(radioProps, 'onChange')}
            />
        </div>;
    }

    handleCheckboxChange = (value: string[]) => {
        const { onChange } = this.props?.checkboxProps;
        onChange?.(value);
        this.handleValueChange(value);
    }

    checkboxNode = () => {
        const { checkboxProps } = this.props;
        return <div className={`${prefixCls}-checkbox-container`}>
            <CheckboxGroup 
                direction='vertical'
                onChange={this.handleCheckboxChange}
                {...omit(checkboxProps, 'onChange')}
            />
        </div>;
    }

    getThankTextNode = () => {
        const { type, showThankText } = this.props;
        if (!showThankText) {
            return null;
        }
        const { value } = this.state;
        let show = false;
        switch (type) {
            case 'emoji':
                show = Boolean((value as EmojiResult)?.emoji);
                break;
            case 'checkbox':
                show = Boolean(value && Array.isArray(value) && value.length > 0);
                break;
            default:
                show = Boolean(value);
                break;
        }
        if (show) {
            return <p className={`${prefixCls}-thank-text`}>🎉 Thank you for your feedback!</p>;
        }
        return null;
    }
    
    getRealChildren = () => {
        const { type, renderContent, children } = this.props;
        let result = null;
        switch (type) {
            case 'custom':
                result = children;
                break;
            case 'text': 
                result = this.textNode();
                break;
            case 'emoji':
                result = this.emojiNode();
                break;
            case 'radio':
                result = this.radioNode();
                break;
            case 'checkbox':
                result = this.checkboxNode();
                break;
            default:
                break;
        }
        
        const thankTextNode = this.getThankTextNode();
        if (thankTextNode) {
            result = <>
                {result}
                {thankTextNode}
            </>;
        }
        if (typeof renderContent === 'function') {
            result = renderContent(result);
        }
        return result;
    }

    handleCancel = (e: React.MouseEvent<Element> | React.KeyboardEvent<Element>) => {
        this.setState({
            value: null
        });
        this.props.onCancel?.(e as any);
    }

    handleSubmit = (e: React.MouseEvent<Element>) => {
        this.props.onOk?.(e);
    }

    renderFooter = (locale: Locale['Feedback']) => {
        const { footer } = this.props;
        if (footer) {
            return footer;
        } else {
            return <div className={`${prefixCls}-footer`}>
                <Button type='primary' onClick={this.handleCancel}>{locale.cancel}</Button>
                <Button type='primary' theme='solid' disabled={this.disableSubmitButton()} onClick={this.handleSubmit}>{locale.submit}</Button>
            </div>;
        }
    }

    disableSubmitButton = () => {
        const { value } = this.state;
        return !Boolean(value) || (Array.isArray(value) && value.length === 0);
    }

    getRestProps = () => {
        const { className, children, type, mode, ...rest } = this.props;
        const restProps = omit(rest, [
            'showThankText', 
            'mode', 
            'type', 
            'onValueChange', 
            'textareaProps',
            'radioProps',
            'checkboxProps',
            'renderContent',
            'onCancel',
            'onOk',
        ]);
        return restProps;
    }

    render(): JSX.Element {
        const { className, children, type, mode, ...rest } = this.props;
        const restProps = this.getRestProps();
        const realChildren = this.getRealChildren();
        const disabledOkButton = this.disableSubmitButton();
        const realCls = cls(prefixCls, {
            [`${prefixCls}-${type}`]: type,
            className: className
        });

        return (<LocaleConsumer componentName="Feedback">
            {(locale: Locale['Feedback'], localeCode: Locale['code']) => {
                return (mode === 'modal' ? (<Modal
                    okButtonProps={{ disabled: disabledOkButton }}
                    okText={locale.submit}
                    cancelText={locale.cancel}
                    className={realCls}
                    {...restProps}
                    onOk={this.handleSubmit}
                    onCancel={this.handleCancel}
                >
                    {realChildren}
                </Modal>) : (<SideSheet
                    mask={false}
                    canVerticalSetWidth={true}
                    placement="bottom"
                    height="auto"
                    className={realCls}
                    footer={this.renderFooter(locale)}
                    onCancel={this.handleCancel}
                    {...(restProps as FeedbackSideSheetProps)}
                >
                    {realChildren}
                </SideSheet>)
                );
            }}
        </LocaleConsumer>);
    }
}
