import type { ReactNode, ClipboardEvent as ReactClipboardEvent } from "react";
import { OnChangeProps, UploadProps } from "../upload";
import { TooltipProps } from "../tooltip";
import { BaseSkill, Reference, Suggestion, Attachment, Content, Setup, LeftMenuChangeProps, RichTextJSON, MessageContent } from "@douyinfe/semi-foundation/aiChatInput/interface";
import { Editor, Extensions } from "@tiptap/core";
import { Content as TiptapContent } from "@tiptap/core";
import { PopoverProps } from "../popover";
export * from "@douyinfe/semi-foundation/aiChatInput/interface";
import { Node } from '@tiptap/pm/model';

export interface AIChatInputState {
    templateVisible: boolean;
    skillVisible: boolean;
    suggestionVisible: boolean;
    attachments?: Attachment[];
    skill?: Skill;
    popupWidth?: number;
    activeSkillIndex?: number;
    activeSuggestionIndex?: number;
    popupKey?: number;
    content?: RichTextJSON;
    richTextInit?: boolean
}

export type PlaceholderProps = string | ((props: { editor: Editor; node: Node; pos: number; hasAnchor: boolean }) => string);

export interface AIChatInputProps {
    dropdownMatchTriggerWidth?: boolean;
    keepSkillAfterSend: boolean;
    className?: string;
    style?: React.CSSProperties;
    // Rich text editor related
    placeholder?: PlaceholderProps;
    /**
     * Whether to show placeholder when only skill is selected (no other content)
     * @default false
     */
    showPlaceholderWhenSkillOnly?: boolean;
    extensions?: Extensions;
    onContentChange?: (contents: Content[]) => void;
    defaultContent?: TiptapContent;
    onFocus?: (event: React.FocusEvent) => void;
    onBlur?: (event: React.FocusEvent) => void;
    /**
     * Listen to paste event on input editor
     *
     * Note: This is a clipboard event callback and does not change default paste behavior.
     */
    onPaste?: (event: ReactClipboardEvent<HTMLDivElement>) => void;
    // Reference related
    references?: Reference[];
    renderReference?: (reference: Reference) => ReactNode;
    onReferenceDelete?: (reference: Reference) => void;
    onReferenceClick?: (reference: Reference) => void;
    // Upload related
    uploadProps?: UploadProps;
    onUploadChange?: (props: OnChangeProps) => void;
    /**
     * Customize upload button UI in footer action area,
     * while keeping built-in upload / paste-upload logic.
     */
    renderUploadButton?: (props: RenderUploadButtonProps) => ReactNode;
    // TopSlot related
    renderTopSlot?: (props: RenderTopSlotProps) => ReactNode;
    topSlotPosition?: 'top' | 'middle' | 'bottom';
    showUploadFile?: boolean;
    showReference?: boolean;
    showUploadButton?: boolean;
    // Operate area related
    round?: boolean; // full round for footer operate/configure button
    canSend?: boolean; // custom can send
    onMessageSend?: (props: MessageContent) => void;
    onStopGenerate?: () => void;
    uploadTipProps?: TooltipProps;
    generating?: boolean;
    // Configure area related
    renderConfigureArea?: (className?: string) => ReactNode;
    onConfigureChange?: (value: LeftMenuChangeProps, changedValue: LeftMenuChangeProps) => void;
    // Action area related
    renderActionArea?: (props: ActionAreaProps) => ReactNode;
    // Suggestion related
    suggestions?: Suggestion[];
    renderSuggestionItem?: (props: RenderSuggestionItemProps) => ReactNode;
    onSuggestClick?: (suggestion: Suggestion) => void;
    // Skill related
    skills?: Skill[];
    skillHotKey?: string;
    templatesStyle?: React.CSSProperties;
    templatesCls?: string;
    onSkillChange?: (skill: Skill) => void;
    renderSkillItem?: (props: RenderSkillItemProps) => ReactNode;
    // Template related
    renderTemplate?: (skill: Skill, onTemplateClick: (content: string) => void) => ReactNode;
    onTemplateVisibleChange?: (visible: boolean) => void;
    showTemplateButton?: boolean;
    // transformer
    transformer?: Map<string, (obj: any) => any>;
    // Popover related
    popoverProps?: PopoverProps;
    sendHotKey?: 'enter' | 'shift+enter';
    immediatelyRender?: boolean
}

export interface RenderUploadButtonProps {
    /**
     * Default upload button node rendered by AIChatInput.
     * You can wrap/clone it or return a completely custom node.
     */
    defaultNode: ReactNode;
    /**
     * Open file selector dialog.
     * Note: Upload wrapper will also open dialog on click by default,
     * but you can use this when you stop propagation in your custom node.
     */
    openFileDialog: () => void;
    disabled: boolean;
    attachments: Attachment[];
}

export interface RenderSuggestionItemProps {
    suggestion: Suggestion;
    className: string;
    onClick: () => void;
    onMouseEnter: () => void
}

export interface RenderSkillItemProps {
    skill: Skill;
    className: string;
    onClick: () => void;
    onMouseEnter: () => void
}

export interface Skill extends BaseSkill {
    icon?: ReactNode
}

interface ActionAreaProps {
    // menuItem: by order,upload button, send(stopGenerate) button
    menuItem: ReactNode[];
    className: string
}

interface RenderTopSlotProps {
    references: Reference[];
    attachments: Attachment[];
    content: Content[];
    handleUploadFileDelete: (attachment: Attachment) => void;
    handleReferenceDelete: (reference: Reference) => void
}
