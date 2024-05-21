import React, { PureComponent } from 'react';
import cls from 'classnames';
import PropTypes from 'prop-types';
import InputArea from './inputArea';
import { FileItem } from '../../upload/interface';
import { RenderInputAreaProps } from '../interface';
import { BaseComponent, Button, Upload } from '../../index';
import { IconDeleteStroked, IconSend, IconPlusCircleStroked } from '@douyinfe/semi-icons';
import { cssClasses } from "@douyinfe/semi-foundation/chat/constants";
import InputBoxFoundation, { InputBoxAdapter } from '@douyinfe/semi-foundation/chat/inputboxFoundation';

const { PREFIX_INPUT_BOX } = cssClasses;

interface InputBoxProps {
    placeholder: string;
    className?: string;
    style?: React.CSSProperties;
    disableSend?: boolean;
    renderInputArea?: (props: RenderInputAreaProps) => React.ReactNode;
    children?: React.ReactNode;
    onSend?: (content: string, attachment: FileItem[]) => void;
    onClearContext?: (e: any) => void;
    onInputChange?: (props: {inputValue: string; attachment: FileItem[]}) => void
}

interface InputBoxState {
    content: string;
    attachment: FileItem[]
}

class InputBox extends BaseComponent<InputBoxProps, InputBoxState> {

    inputAreaRef: React.RefObject<any>;
    static propTypes = {
        children: PropTypes.node,
    };

    static defaultProps = {
        children: null,
    };

    constructor(props: InputBoxProps) {
        super(props);
        this.inputAreaRef = React.createRef();
        this.foundation = new InputBoxFoundation(this.adapter);

        this.state = {
            content: '',
            attachment: []
        };
    }

    get adapter(): InputBoxAdapter<InputBoxProps, InputBoxState> {
        return {
            ...super.adapter,
            notifyInputChange: (props: { inputValue: string; attachment: any[]}) => {
                const { onInputChange } = this.props;
                onInputChange && onInputChange(props);
            },
            setInputValue: (value) => {
                this.setState({
                    content: value
                });
            },
            setAttachment: (attachment: any[]) => {
                this.setState({
                    attachment: attachment
                });
            },
            notifySend: (content: string, attachment: FileItem[]) => {
                const { onSend } = this.props;
                onSend && onSend(content, attachment);
            }
        };
    }

    onClick = () => {
        this.inputAreaRef.current?.focus();
    }

    render() {
        const { content, attachment } = this.state;
        const { onClearContext, renderInputArea, onSend, 
            style, className, placeholder,
            disableSend: disableSendInProps } = this.props;
        const disabledSend = disableSendInProps || (content.length === 0 && attachment.length === 0);
        const nodes = (
            <div className={cls(PREFIX_INPUT_BOX, { [className]: className })} style={style}>
                <div 
                    className={`${PREFIX_INPUT_BOX}-inner`}
                    onClick={this.onClick}
                >
                    <Button
                        className={`${PREFIX_INPUT_BOX}-clearButton`}
                        theme='borderless'
                        icon={<IconDeleteStroked />}
                        onClick={onClearContext}
                    />
                    <div className={`${PREFIX_INPUT_BOX}-container`}>
                        <InputArea
                            placeholder={placeholder}
                            content={content}
                            attachment={attachment}
                            textareaRef={this.inputAreaRef}
                            onChange={this.foundation.onInputAreaChange}
                            onAttachmentDelete={this.foundation.onAttachmentDelete}
                            onSend={disableSendInProps ? undefined : this.foundation.onSend}
                        />
                        <Upload
                            fileList={[]}
                            onChange={this.foundation.onAttachmentAdd}
                        >
                            <Button 
                                className={`${PREFIX_INPUT_BOX}-uploadButton`}
                                icon={<IconPlusCircleStroked size="extra-large" />}
                                theme='borderless'
                            >
                            </Button>
                        </Upload>
                        <Button
                            disabled={disabledSend}
                            theme='borderless'
                            className={`${PREFIX_INPUT_BOX}-sendButton`}
                            icon={<IconSend size="extra-large" className={`${PREFIX_INPUT_BOX}-sendButton-icon`} />}
                            onClick={this.foundation.onSend}
                        />
                    </div>
                </div>
            </div>
        );
        if (renderInputArea) {
            return renderInputArea({
                defaultNode: nodes, 
                onClear: onClearContext,
                onSend: onSend,
            });
        }
        return nodes; 
    }
}

export default InputBox;