import React, { useCallback, useMemo, useState } from 'react';
import { TextStyleKit } from '@tiptap/extension-text-style';
import StarterKit from '@tiptap/starter-kit';
import { Image } from "@tiptap/extension-image";
import { Mark } from '@tiptap/core';
import { Editor, Extension } from '@tiptap/react';
import { EditorContent, useEditor, useEditorState } from '@tiptap/react';
import { Button, Toast, Divider, Dropdown, Input, Collapse } from '../../index';
import { cssClasses } from '@douyinfe/semi-foundation/sidebar/constants';
import { IconH1, IconHn, IconH2, IconH3, IconH4, IconH5, IconH6, IconList, IconOrderedList, 
    IconQuote, IconLink, IconItalic, IconStrikeThrough, IconText, IconBold, IconCode, IconMinus, 
    IconUndo, IconRedo, IconCheckCircleStroked, IconDeleteStroked,
    IconAlignLeft, IconAlignJustify, IconAlignCenter, IconAlignRight, IconImage } from '@douyinfe/semi-icons';
import { ButtonProps } from '../../button';
import { DropdownItemProps } from '../../dropdown';
import cls from 'classnames';
import { CollapseHeader } from './code';
import { SideBarCollapseProps } from '../interface';
import { TextAlign } from '@tiptap/extension-text-align';
import { ImageUploadNode, ImageUploadNodeOptions } from './imageSlot';
import LocaleConsumer from '../../locale/localeConsumer';
import { Locale } from '../../locale/interface';

const collapseCls = cssClasses.COLLAPSE;
const prefixCls = cssClasses.FILE;

// 用于保证在输入link ，选区 UI 对用户保持一致性，否则会在输入时候，因为富文本本区域焦点丢失而看不到选区
const SelectionMark = Mark.create({
    name: 'selectionMark',
    inclusive: false,
    parseHTML() {
        return [
            { tag: 'span.select' },
        ];
    },
    renderHTML() {
        return ['span', { class: 'select' }, 0];
    },
});

export interface FileItemProps {
    key?: string;
    className?: string;
    name?: string;
    style?: React.CSSProperties;
    editable?: boolean;
    content?: string;
    onContentChange?: (content: string) => void;
    extensions?: Extension[];
    imgUploadProps?: ImageUploadNodeOptions
}

interface ConfigureButtonProps extends ButtonProps {
    active?: boolean
}

const ConfigureButton = React.memo((props: ConfigureButtonProps) => {
    const { active, className, ...rest } = props;
    return (
        <Button 
            {...rest} 
            theme='borderless'  
            type='tertiary' 
            className={cls(`${prefixCls}-menu-bar-btn`, {
                [`${prefixCls}-menu-bar-btn-active`]: active,
                [className]: className
            })} 
        />
    );
});

const ConfigureDropdownItem = React.memo((props: DropdownItemProps) => {
    const { active, children, ...rest } = props;
    return (
        <Dropdown.Item 
            className={cls(`${prefixCls}-menu-bar-dropdown-item`, {
                [`${prefixCls}-menu-bar-dropdown-item-active`]: active,
            })} 
            {...rest}
        >
            {children}
        </Dropdown.Item>
    );
});
 

function MenuBar({ editor, className }: { editor: Editor; className: string }) {
    const [linkDropdownVisible, setLinkDropdownVisible] = useState(false);
    const [linkInputValue, setLinkInputValue] = useState('');
    const [linkSelectionRange, setLinkSelectionRange] = useState<{ from: number; to: number } | null>(null);

    const editorState = useEditorState({
        editor,
        selector: ctx => {
            const { from, to } = ctx.editor.state.selection;
            const hasSelection = from !== to;
            const hasCursor = from === to && ctx.editor.isFocused;
            return {
                isBold: ctx.editor.isActive('bold') ?? false,
                canBold: (ctx.editor.can().chain() as any).toggleBold().run() ?? false,
                isItalic: ctx.editor.isActive('italic') ?? false,
                canItalic: (ctx.editor.can().chain() as any).toggleItalic().run() ?? false,
                isStrike: ctx.editor.isActive('strike') ?? false,
                canStrike: (ctx.editor.can().chain() as any).toggleStrike().run() ?? false,
                isCode: ctx.editor.isActive('code') ?? false,
                canCode: (ctx.editor.can().chain() as any).toggleCode().run() ?? false,
                canClearMarks: ctx.editor.can().chain().unsetAllMarks().run() ?? false,
                isParagraph: ctx.editor.isActive('paragraph') ?? false,
                isHeading: ctx.editor.isActive('heading') ?? false,
                isHeading1: ctx.editor.isActive('heading', { level: 1 }) ?? false,
                isHeading2: ctx.editor.isActive('heading', { level: 2 }) ?? false,
                isHeading3: ctx.editor.isActive('heading', { level: 3 }) ?? false,
                isHeading4: ctx.editor.isActive('heading', { level: 4 }) ?? false,
                isHeading5: ctx.editor.isActive('heading', { level: 5 }) ?? false,
                isHeading6: ctx.editor.isActive('heading', { level: 6 }) ?? false,
                isBulletList: ctx.editor.isActive('bulletList') ?? false,
                isOrderedList: ctx.editor.isActive('orderedList') ?? false,
                isCodeBlock: ctx.editor.isActive('codeBlock') ?? false,
                isBlockquote: ctx.editor.isActive('blockquote') ?? false,
                isLink: ctx.editor.isActive('link') ?? false,
                canLink: hasSelection || hasCursor,
                canUndo: ctx.editor.can().chain().undo().run() ?? false,
                canRedo: ctx.editor.can().chain().redo().run() ?? false,
                isAlignLeft: ctx.editor.isActive({ textAlign: 'left' }) ?? false,
                isAlignCenter: ctx.editor.isActive({ textAlign: 'center' }) ?? false,
                isAlignRight: ctx.editor.isActive({ textAlign: 'right' }) ?? false,
                isAlignJustify: ctx.editor.isActive({ textAlign: 'justify' }) ?? false,
                isImage: ctx.editor.isActive("imageUpload") ?? false,
                canInsertImage: ctx.editor.can().insertContent({ type: "imageUpload" })
            };
        },
    });

    const handleConfirmLink = useCallback((locale) => {
        const href = linkInputValue.trim();
        if (!href) {
            return;
        }

        const { from, to } = linkSelectionRange ?? editor.state.selection;
        const chain = editor.chain().focus() as any;

        if (from !== to) {
            // With a selection area, set a link for the currently selected text.
            chain
                .setTextSelection({ from, to })
                .extendMarkRange('link')
                .setLink({ href })
                .unsetMark('selectionMark')
                .run();
        } else {
            // No selection area but cursor: Insert a linked text at the cursor position.
            chain
                .setTextSelection(from)
                .insertContent({
                    type: 'text',
                    text: href,
                    marks: [{ type: 'link', attrs: { href } }],
                })
                .unsetMark('selectionMark')
                .run();
        }
        Toast.success(locale.linkAddSuccess);
        setLinkDropdownVisible(false);
        setLinkSelectionRange(null);
    }, [editor, linkInputValue, linkSelectionRange]);

    const handleUnsetLink = useCallback((locale) => {
        (editor.chain().focus() as any).unsetLink().unsetMark('selectionMark').run();
        Toast.success(locale.linkRemoveSuccess);
        setLinkDropdownVisible(false);
        setLinkSelectionRange(null);
    }, [editor]);

    const handleLinkInputKeyDown = useCallback((e, locale) => {
        if (e.key === 'Enter') {
            handleConfirmLink(locale);
        }

    }, [handleConfirmLink]);

    const handleImageAdd = useCallback(() => {
        if (!editor) {
            return false;
        }
        try {
            editor
                .chain()
                .focus()
                .insertContent({
                    type: "imageUpload",
                })
                .run();
        } catch {
            return false;
        }
        return true;
    }, [editor]);

    return (
        <div className={className}>
            <ConfigureButton 
                icon={<IconUndo />}
                onClick={() => editor.chain().focus().undo().run()} 
                disabled={!editorState.canUndo}
            />
            <ConfigureButton 
                icon={<IconRedo />}
                onClick={() => editor.chain().focus().redo().run()} 
                disabled={!editorState.canRedo}
            />
            <Divider layout="vertical" />
            <Dropdown
                render={
                    <Dropdown.Menu>
                        <ConfigureDropdownItem 
                            className={editorState.isHeading1 ? `${prefixCls}-menu-bar-dropdown-item-active` : ''}
                            onClick={() => (editor.chain().focus() as any).toggleHeading({ level: 1 }).run()}
                        >
                            <IconH1 />
                        </ConfigureDropdownItem>
                        <ConfigureDropdownItem 
                            className={editorState.isHeading2 ? `${prefixCls}-menu-bar-dropdown-item-active` : ''}
                            onClick={() => (editor.chain().focus() as any).toggleHeading({ level: 2 }).run()}
                        >
                            <IconH2 />
                        </ConfigureDropdownItem>
                        <ConfigureDropdownItem 
                            className={editorState.isHeading3 ? `${prefixCls}-menu-bar-dropdown-item-active` : ''}
                            onClick={() => (editor.chain().focus() as any).toggleHeading({ level: 3 }).run()}
                        >
                            <IconH3 />
                        </ConfigureDropdownItem>
                        <ConfigureDropdownItem 
                            className={editorState.isHeading4 ? `${prefixCls}-menu-bar-dropdown-item-active` : ''}
                            onClick={() => (editor.chain().focus() as any).toggleHeading({ level: 4 }).run()}
                        >
                            <IconH4 />
                        </ConfigureDropdownItem>
                        <ConfigureDropdownItem 
                            className={editorState.isHeading5 ? `${prefixCls}-menu-bar-dropdown-item-active` : ''}
                            onClick={() => (editor.chain().focus() as any).toggleHeading({ level: 5 }).run()}
                        >
                            <IconH5 />
                        </ConfigureDropdownItem>
                        <ConfigureDropdownItem 
                            className={editorState.isHeading6 ? `${prefixCls}-menu-bar-dropdown-item-active` : ''}
                            onClick={() => (editor.chain().focus() as any).toggleHeading({ level: 6 }).run()}
                        >
                            <IconH6 />
                        </ConfigureDropdownItem>
                    </Dropdown.Menu>  
                }
            >
                <span>
                    <ConfigureButton 
                        icon={<IconHn />}
                        active={editorState.isHeading}
                    />
                </span>
            </Dropdown>
            <ConfigureButton
                icon={<IconText />}
                onClick={() => editor.chain().focus().setParagraph().run()}
                active={editorState.isParagraph}
            />
            <ConfigureButton 
                icon={<IconList />}
                onClick={() => (editor.chain().focus() as any).toggleBulletList().run()}
                active={editorState.isBulletList}
            />
            <ConfigureButton 
                icon={<IconOrderedList />}
                onClick={() => (editor.chain().focus() as any).toggleOrderedList().run()}
                active={editorState.isOrderedList}
            />
            <ConfigureButton 
                icon={<IconQuote />}
                active={editorState.isBlockquote}
                onClick={() => (editor.chain().focus() as any).setBlockquote().run()}
            />
            {/* code block */}
            <ConfigureButton 
                active={editorState.isCodeBlock}
                className={`${prefixCls}-menu-bar-btn-codeblock`}
                onClick={() => (editor.chain().focus() as any).toggleCodeBlock().run()}
            >
                CB
            </ConfigureButton>
            <ConfigureButton 
                icon={<IconMinus />}
                onClick={() => (editor.chain().focus() as any).setHorizontalRule().run()}
            /> 
            <Divider layout="vertical" />
            <ConfigureButton 
                active={editorState.isAlignLeft}
                icon={<IconAlignLeft />}
                onClick={() => (editor.chain().focus() as any).setTextAlign('left').run()}
            />
            <ConfigureButton 
                active={editorState.isAlignCenter}
                icon={<IconAlignCenter />}
                onClick={() => (editor.chain().focus() as any).setTextAlign('center').run()}
            />
            <ConfigureButton
                active={editorState.isAlignRight} 
                icon={<IconAlignRight />}
                onClick={() => (editor.chain().focus() as any).setTextAlign('right').run()}
            />
            <ConfigureButton
                active={editorState.isAlignJustify}  
                icon={<IconAlignJustify />}
                onClick={() => (editor.chain().focus() as any).setTextAlign('justify').run()}
            />
            <Divider layout="vertical" />
            <ConfigureButton 
                icon={<IconBold />}
                active={editorState.isBold}
                onClick={() => (editor.chain().focus() as any).toggleBold().run()}
            />
            <ConfigureButton 
                icon={<IconItalic />}
                onClick={() => (editor.chain().focus() as any).toggleItalic().run()}
                active={editorState.isItalic}
                disabled={!editorState.canItalic}
            />
            <ConfigureButton 
                icon={<IconStrikeThrough />}
                onClick={() => (editor.chain().focus() as any).toggleStrike().run()}
                active={editorState.isStrike}
                disabled={!editorState.canStrike}
            />
            <ConfigureButton 
                icon={<IconCode />}
                onClick={() => (editor.chain().focus() as any).toggleCode().run()}
                active={editorState.isCode}
                disabled={!editorState.canCode}
            />
            <Dropdown
                trigger="click"
                visible={linkDropdownVisible}
                onVisibleChange={visible => {
                    setLinkDropdownVisible(visible);
                    if (visible) {
                        const { from, to } = editor.state.selection;
                        setLinkSelectionRange({ from, to });
                        if (from !== to) {
                            (editor.chain().focus() as any).setMark('selectionMark').run();
                        }
                        const currentHref = (editor.getAttributes('link') as any)?.href || '';
                        setLinkInputValue(currentHref);
                    } else {
                        (editor.chain().focus() as any).unsetMark('selectionMark').run();
                        setLinkSelectionRange(null);
                    }
                }}
                render={
                    <div className={`${prefixCls}-menu-bar-link-dropdown`}>
                        <LocaleConsumer componentName="Sidebar" >
                            {(locale: Locale['Sidebar']) => (
                                <>
                                    <Input
                                        size="small"
                                        placeholder={locale.enterLinkAddress}
                                        value={linkInputValue}
                                        onChange={setLinkInputValue}
                                        onKeyDown={(e) => handleLinkInputKeyDown(e, locale)}
                                        className={`${prefixCls}-menu-bar-link-input`}
                                    />
                                    <Button
                                        size="small"
                                        theme="borderless"
                                        type="tertiary"
                                        icon={<IconCheckCircleStroked />}
                                        onClick={(e) => handleConfirmLink(locale)}
                                        disabled={!linkInputValue.trim()}
                                    />
                                    <Button
                                        size="small"
                                        theme="borderless"
                                        icon={<IconDeleteStroked />}
                                        onClick={(e) => handleUnsetLink(locale)}
                                        disabled={!editorState.isLink}
                                    />
                                </>
                            )}
                        </LocaleConsumer>
                    </div>
                }
            >
                <span>
                    <ConfigureButton
                        icon={<IconLink />}
                        active={editorState.isLink}
                    />
                </span>
            </Dropdown>
            <Divider layout="vertical" />
            <ConfigureButton 
                icon={<IconImage />}
                disabled={!editorState.canInsertImage}
                onClick={handleImageAdd}
            />
        </div>
    );
    
}

export const FileItem = React.memo((props: FileItemProps) => {
    const { editable = true, content, onContentChange, extensions = [], className, style, imgUploadProps } = props;
    const defaultExtensions = useMemo(
        () =>
            [
                TextStyleKit,
                StarterKit.configure({
                    link: {
                        openOnClick: false,
                        enableClickSelection: true,
                    }
                }),
                Image,
                SelectionMark,
                TextAlign.configure({ types: ["heading", "paragraph"] }),
                ImageUploadNode.configure(imgUploadProps)
            ] as any,
        [imgUploadProps]
    );

    const allExtensions = useMemo(() => [...defaultExtensions, ...extensions], [defaultExtensions, extensions]);
    const editor = useEditor({
        extensions: allExtensions,
        editable: editable,
        content: content,
        onUpdate: ({ editor }) => {
            onContentChange?.(editor.getHTML());
        },
    });

    if (!editor) {
        return null;
    }

    return (
        <div className={cls(prefixCls, { [className]: className })} style={style}>
            {editable && <MenuBar editor={editor} className={`${prefixCls}-menu-bar`}/>}
            <EditorContent editor={editor} className={`${prefixCls}-editor`} />
        </div>
    );
});

export interface FileContentProps extends SideBarCollapseProps {
    files?: FileItemProps[];
    onExpand?: (e: React.MouseEvent, file: FileItemProps) => void
}

const FileContent = React.memo((props: FileContentProps) => {
    const { activeKey, files = [], onExpand, style, className, onChange } = props;
    return <Collapse
        className={cls(collapseCls, `${collapseCls}-file`, { [className]: className })}
        style={style}
        onChange={onChange}
        activeKey={activeKey}
        clickHeaderToExpand={false}
    >
        {files.map((file) => {
            return <Collapse.Panel
                header={<CollapseHeader content={file} onExpand={onExpand} mode={'file'}/>}
                itemKey={file.key}
                key={file.key}
            >
                <FileItem 
                    key={file.key} 
                    content={file.content} 
                    editable={false}
                />
            </Collapse.Panel>;
        })}
    </Collapse>;
});


export default FileContent;
