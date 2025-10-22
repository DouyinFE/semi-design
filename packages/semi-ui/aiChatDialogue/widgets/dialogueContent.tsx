import React, { ReactElement, ReactNode, useMemo, useCallback } from 'react';
import cls from 'classnames';
import { DialogueContentProps } from '../interface';
import MarkdownRender from '../../markdownRender';
import { cssClasses, strings } from '@douyinfe/semi-foundation/aiChatDialogue/constants';
import { Image } from '../../index';
import { FunctionToolCall, InputFile, ContentItem, InputMessage, InputText, InputImage, OutputText, Reasoning, CustomToolCall, OutputMessage, Refusal } from '@douyinfe/semi-foundation/aiChatDialogue/foundation';
import { DialogueContentItemRenderer } from '../interface';
import { IconAlertCircle, IconCode, IconExcel, IconFile, IconImage, IconPdf, IconSpin, IconWord, IconWrench } from '@douyinfe/semi-icons';
import { ReasoningWidget } from './contentItem/reasoning';
import { AnnotationWidget } from './contentItem/annotation';
import { ReferenceWidget } from './contentItem/reference';
import Code from './contentItem/code';
import { Locale } from '../../locale/interface';
import LocaleConsumer from "../../locale/localeConsumer";


const { PREFIX_CONTENT } = cssClasses;
const { STATUS, MODE, ROLE, MESSAGE_ITEM_TYPE } = strings;

const DialogueContent = (props: DialogueContentProps) => {
    const { message, customRenderFunc, role: roleInfo, customMarkDownComponents, mode, markdownRenderProps, editing, messageEditRender, 
        onFileClick, onImageClick, disabledFileItemClick, renderDialogueContentItem, onAnnotationClick } = props;
    const { content, role, status, references } = message;

    const TEXT_TYPES = useMemo(() => [MESSAGE_ITEM_TYPE.INPUT_TEXT, MESSAGE_ITEM_TYPE.OUTPUT_TEXT, MESSAGE_ITEM_TYPE.REFUSAL], []);
    const TOOL_CALL_TYPES = useMemo(() => [MESSAGE_ITEM_TYPE.FUNCTION_CALL, MESSAGE_ITEM_TYPE.CUSTOM_TOOL_CALL, MESSAGE_ITEM_TYPE.MCP_CALL], []);

    const markdownComponents = useMemo(() => ({
        'code': Code,
        ...customMarkDownComponents
    }), [customMarkDownComponents]);


    const wrapCls = useMemo(() => {
        const isUser = role === ROLE.USER;
        const bubble = mode === MODE.BUBBLE;
        const userBubble = mode === MODE.USER_BUBBLE && isUser;
        return cls({
            [`${PREFIX_CONTENT}`]: true,
            [`${PREFIX_CONTENT}-${mode}`]: bubble || userBubble,
            [`${PREFIX_CONTENT}-no-bubble`]: !(bubble || userBubble),
            [`${PREFIX_CONTENT}-user`]: (bubble && isUser) || userBubble,
            [`${PREFIX_CONTENT}-error`]: status === STATUS.FAILED && (bubble || userBubble)
        });
    }, [role, status, mode]);

    const renderFileIcon = (type: string, props: InputFile) => {
        let icon = null;
        let typeCls = '';

        if (['doc', 'docx', 'txt', 'word'].includes(type)) {
            typeCls = 'word';
            icon = <IconWord size="extra-large" className={`${PREFIX_CONTENT}-file-icon`}/>;
        } else if (['jpeg', 'jpg', 'png', 'gif'].includes(type)) {
            typeCls = 'image';
            // icon = <IconImage size="extra-large" className={`${PREFIX_CONTENT}-file-icon`}/>;
            icon = <div className={`${PREFIX_CONTENT}-file-icon`} style={{ backgroundImage: `url(${props.file_url})` }}/>;
        } else if (type === 'pdf') {
            typeCls = 'pdf';
            icon = <IconPdf size="extra-large" className={`${PREFIX_CONTENT}-file-icon`}/>;
        } else if (['excel', 'xlsx', 'xls'].includes(type)) {
            typeCls = 'excel';
            icon = <IconExcel size="extra-large" className={`${PREFIX_CONTENT}-file-icon`}/>;
        } else if (['json', 'js', 'ts', 'jsx', 'tsx'].includes(type)) { 
            typeCls = 'code';
            icon = <IconCode size="extra-large" className={`${PREFIX_CONTENT}-file-icon`}/>;
        } else {
            typeCls = 'default';
            icon = <IconFile size="extra-large" className={`${PREFIX_CONTENT}-file-icon`}/>;
        }

        return (
            <div 
                className={cls(`${PREFIX_CONTENT}-file-icon-wrapper`,
                    { [`${PREFIX_CONTENT}-file-icon-${typeCls}`]: typeCls })}
            >
                {icon}
            </div>
        );
    };

    const ImageAttachment = React.memo((props: {src: string; isList: boolean; msg: InputImage}) => {
        const { src, isList, msg } = props;
        return <Image
            className={cls(`${PREFIX_CONTENT}-img`, {
                [`${PREFIX_CONTENT}-img-list`]: isList,
            })}
            src={src}
            onClick={() => {
                onImageClick && onImageClick(msg);
            }}
        />;
    });

    const FileAttachment = React.memo((props: InputFile) => {
        const { file_url, filename, size, fileInstance } = props;
        const suffix = filename?.split('.').pop();
        const realType = suffix ?? fileInstance?.type?.split('/').pop();

        return <a
            href={file_url}
            target="_blank"
            onClick={(e) => {
                onFileClick?.(props);
                if (disabledFileItemClick) {
                    e.preventDefault();
                    return;
                }
            }}
            className={`${PREFIX_CONTENT}-file`} 
            rel="noreferrer"
        >
            {renderFileIcon(realType, props)}
            <div className={`${PREFIX_CONTENT}-file-info`}>
                <span className={`${PREFIX_CONTENT}-file-title`}>{filename}</span>
                <span className={`${PREFIX_CONTENT}-file-metadata`}>
                    <span className={`${PREFIX_CONTENT}-file-type`}>{realType}</span>
                    {' '}{size}
                </span>
            </div>
        </a>;
    });

    const ToolCallWidget = React.memo((props: FunctionToolCall) => {
        const { name, status } = props;
        return <div className={`${PREFIX_CONTENT}-tool-call`}>
            {status !== STATUS.COMPLETED ? <IconSpin /> : <IconWrench />}
            {name}  {props.arguments}
        </div>;
    });

    const customRenderMap = useMemo(() => renderDialogueContentItem?.(message), [renderDialogueContentItem, message]);

    const customRenderer = useCallback((type: string, index: number, item: ContentItem) => {
        const customRendererFunc = customRenderMap?.[type];
        
        if (customRendererFunc) {
            // 如果是工具调用类型，支持嵌套的渲染器映射
            if (TOOL_CALL_TYPES.includes(type as any)) {
                const toolCallItem = item as FunctionToolCall | CustomToolCall;
                const functionName = toolCallItem.name;
                
                // 如果 customRendererFunc 是一个对象（嵌套映射），尝试通过函数名查找
                if (typeof customRendererFunc === 'object' && functionName) {
                    const nestedRenderer = (customRendererFunc as Record<string, DialogueContentItemRenderer>)[functionName];
                    if (nestedRenderer) {
                        return <div className={`${PREFIX_CONTENT}-custom-renderer`} key={`index-${index}`}>{nestedRenderer(item)}</div>;
                    }
                }
                
                // 如果是函数或者没有找到嵌套渲染器，使用默认渲染
                if (typeof customRendererFunc === 'function') {
                    return <div className={`${PREFIX_CONTENT}-custom-renderer`} key={`index-${index}`}>{customRendererFunc(item)}</div>;
                }
            } else {
                // 非工具调用类型，直接使用渲染器函数
                if (typeof customRendererFunc === 'function') {
                    return <div className={`${PREFIX_CONTENT}-custom-renderer`} key={`index-${index}`}>{customRendererFunc(item)}</div>;
                }
            }
        }
        return null;
    }, [customRenderMap, TOOL_CALL_TYPES]);

    const renderMarkdown = useCallback((text: string, key: React.Key) => {
        if (text !== '') {
            return <div className={wrapCls} key={key}>
                <MarkdownRender
                    format='md'
                    raw={text}
                    components={markdownComponents as any}
                    {...markdownRenderProps}
                />
            </div>;
        }
        return null;
    }, [wrapCls, markdownComponents, markdownRenderProps]);

    const renderMessage = useCallback((msg: InputMessage | OutputMessage, index: number) => {
        if (typeof msg.content === 'string') {
            return renderMarkdown(msg.content, `msg-${index}`);
        }
        const inner = (msg.content ?? []) as Array<InputText | InputImage | InputFile | OutputText>;
        const isImageList = inner.filter(i => i?.type === MESSAGE_ITEM_TYPE.INPUT_IMAGE).length > 1;

        return inner.map((i, innerIdx) => {
            const customNode = customRenderer(i?.type as string, index, i);

            if (customNode) return customNode;

            if (TEXT_TYPES.includes(i?.type as string)) {
                const annotation = (i as OutputText).annotations;
                return (
                    <React.Fragment key={`msg-${index}-${innerIdx}`}>
                        {annotation && annotation.length > 0 &&
                            <AnnotationWidget 
                                annotation={annotation} 
                                // todo: 需要支持动态配置
                                maxCount={15}
                                onClick={onAnnotationClick}
                            />
                        }
                        {renderMarkdown((i as InputText | OutputText).text || '', `msg-${index}-${innerIdx}`)}
                        {renderMarkdown((i as Refusal).refusal || '', `msg-${index}-${innerIdx}-refusal`)}
                    </React.Fragment>
                );
            }
            if (i?.type === MESSAGE_ITEM_TYPE.INPUT_IMAGE) {
                return <ImageAttachment key={`msg-${index}-${innerIdx}`} src={(i as InputImage).image_url} isList={isImageList} msg={i as InputImage}/>;
            }
            if (i?.type === MESSAGE_ITEM_TYPE.INPUT_FILE) {
                return <FileAttachment key={`msg-${index}-${innerIdx}`} {...i as InputFile} />;
            }
            return null;
        });
    }, [renderMarkdown, ImageAttachment, FileAttachment, TEXT_TYPES, customRenderer, onAnnotationClick]);

    const renderToolCall = useCallback((item: ContentItem, index: number) => (
        <ToolCallWidget key={`tool-${index}`} {...(item as FunctionToolCall | CustomToolCall)} />
    ), [ToolCallWidget]);

    const builtinRenderers = useMemo(() => ({
        [MESSAGE_ITEM_TYPE.MESSAGE]: (item: ContentItem, index: number) => renderMessage(item as InputMessage | OutputMessage, index),
        [MESSAGE_ITEM_TYPE.REASONING]: (item: ContentItem, index: number) => (
            <ReasoningWidget 
                key={`reason-${index}`} 
                summary={(item as Reasoning).summary}
                content={(item as Reasoning).content}
                status={(item as Reasoning).status}
                markdownRenderProps={markdownRenderProps}
                customMarkDownComponents={customMarkDownComponents}
            />
        ),
        [MESSAGE_ITEM_TYPE.FUNCTION_CALL ]: renderToolCall,
        [MESSAGE_ITEM_TYPE.CUSTOM_TOOL_CALL]: renderToolCall,
    } as Record<string, (item: ContentItem, index: number) => React.ReactNode>), [renderMessage, markdownRenderProps, customMarkDownComponents, renderToolCall]);

    const loadingNode = useMemo(() => {
        const isLoading = [STATUS.QUEUED, STATUS.IN_PROGRESS, STATUS.INCOMPLETE].includes(status);
        const isEmptyOutput = content?.length === 0 && !message.output_text;
        // 如果内容为空，且没有 output_text，则显示 loading
        // If the content is empty and there is no output_text, it will display loading
        if (isLoading && isEmptyOutput) {
            return <span className={`${PREFIX_CONTENT}-loading`} >
                <span className={`${PREFIX_CONTENT}-loading-item`} /> 
                <span className={`${PREFIX_CONTENT}-loading-item`} /> 
                <span className={`${PREFIX_CONTENT}-loading-item`} /> 
                <span className={`${PREFIX_CONTENT}-loading-text`}>
                    <LocaleConsumer<Locale["AIChatDialogue"]> componentName="AIChatDialogue" >
                        {(locale: Locale["AIChatDialogue"]) => locale['loading']}
                    </LocaleConsumer>
                </span>
            </span>;
        } else {
            return null;
        }
    }, [status, content, message.output_text]);

    const node = useMemo(() => {
        if (editing) {
            // todo: 两种行为，内置 + 自定义传入
            // 内置只编辑纯消息，自定义支持编辑多模态消息
            return messageEditRender?.(message);
        } else {
            let realContent: ReactNode | ReactNode[];
            const textContent = typeof content === 'string' ? content : message.output_text;
            
            if (textContent) {
                const defaultRenderer = customRenderMap?.['default'];
                if (typeof defaultRenderer === 'function') {
                    realContent = <div className={`${PREFIX_CONTENT}-custom-renderer`}>{defaultRenderer(textContent)}</div>;
                } else {
                    realContent = <div className={wrapCls}>
                        <MarkdownRender
                            format='md'
                            raw={textContent}
                            components={markdownComponents as any}
                            {...markdownRenderProps}
                        />
                    </div>;
                }
            } else if (Array.isArray(content)) {
                realContent = content.map((item: ContentItem, index) => {
                    const typeKey = item?.type as string | undefined;
                    const effectiveType = typeKey ?? MESSAGE_ITEM_TYPE.MESSAGE;

                    // User defined rendering first
                    const customNode = customRenderer(effectiveType, index, item);
                    if (customNode) return customNode;

                    // Then builtin rendering
                    const renderer = builtinRenderers[effectiveType];
                    if (renderer) return renderer(item, index);
                    return null;
                });
            }
            return (
                <div className={`${PREFIX_CONTENT}-wrapper`}>
                    {(status === STATUS.FAILED || status === STATUS.CANCELLED) && <div className={`${PREFIX_CONTENT}-failed`}>
                        <IconAlertCircle />
                    </div>}
                    <div className={`${PREFIX_CONTENT}-inner`}>{realContent}</div>
                </div>
            );
        }
    }, [status, content, editing, message, messageEditRender, markdownRenderProps, wrapCls, markdownComponents, builtinRenderers, customRenderer, customRenderMap]);
        
    if (customRenderFunc) {
        return customRenderFunc({ 
            message, 
            role: roleInfo,
            defaultContent: node,
            className: wrapCls,
        }) as ReactElement;
    } else {
        return <div className={cls(`${PREFIX_CONTENT}`, {
            [`${PREFIX_CONTENT}-editing`]: editing,
        })}>
            {references && references.length > 0 && <ReferenceWidget references={references} />}
            {node}
            {loadingNode}
        </div>; 
    } 
};

export default DialogueContent;
