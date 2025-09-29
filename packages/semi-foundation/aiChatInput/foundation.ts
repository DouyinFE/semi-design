import BaseFoundation, { DefaultAdapter } from '../base/foundation';
import { Attachment, BaseSkill, Suggestion, Reference, Content, LeftMenuChangeProps, MessageContent } from './interface';
import { isNumber, isString, includes } from 'lodash';
import { cssClasses } from './constants';
import { transformJSONResult } from './utils';

export interface AIChatInputAdapter<P = Record<string, any>, S = Record<string, any>> extends DefaultAdapter<P, S> {
    reposPopover: () => void;
    setContent: (content: any) => void;
    focusEditor: (pos?: any) => void;
    getTriggerWidth: () => number;
    getEditor: () => any;
    getPopupID: () => string;
    notifyContentChange: (result: Content[]) => void;
    notifyConfigureChange: (value: LeftMenuChangeProps, changedValue: LeftMenuChangeProps) => void;
    maulUpload: (files: File[]) => void;
    notifyMessageSend: (props: MessageContent) => void;
    notifyStopGenerate: () => void;
    clearContent: () => void;
    clearAttachments: () => void;
    getRichTextDiv: () => HTMLDivElement | null;
    registerClickOutsideHandler: (cb: (e: any) => void) => void;
    unregisterClickOutsideHandler: () => void;
    handleReferenceDelete: (reference: Reference) => void;
    handleReferenceClick: (reference: Reference) => void;
    isSelectionText: (selection: any) => boolean;
    createSelection: (node: any, pos: number) => any;
    notifyFocus: (event: any) => void;
    notifyBlur: (event: any) => void
}

const prefixCls = cssClasses.PREFIX;

export default class AIChatInputFoundation extends BaseFoundation<AIChatInputAdapter> {

    constructor(adapter: AIChatInputAdapter) {
        super({ ...AIChatInputFoundation.defaultAdapter, ...adapter });
    }

    init = () => {};

    mouseDownTarget: HTMLElement | null = null;

    destroy = () => {
        this._adapter.unregisterClickOutsideHandler();
    }

    handleSkillSelect = (skill: BaseSkill) => {
        this._adapter.setState({
            skill: skill,
            skillVisible: false
        });
        this._adapter.setContent(`<skill-slot data-value="${skill.label}"></skill-slot>`);
        this._adapter.focusEditor();
    }

    setDropdownWidth() {
        const { style, dropdownMatchTriggerWidth } = this.getProps();
        let width;
        if (dropdownMatchTriggerWidth) {
            if (style && isNumber(style.width)) {
                width = style.width;
            } else if (style && isString(style.width) && !style.width.includes('%')) {
                width = style.width;
            } else {
                width = this._adapter.getTriggerWidth();
            }  
        }
        if (width) {
            this._adapter.setState({
                popupWidth: width
            });
        }
    }

    handlePaste = (files: File[]) => {
        this._adapter.maulUpload(files);
    }
    
    handleSuggestionSelect = (suggestion: Suggestion) => {
        this._adapter.setContent(suggestion as unknown as string);
        this._adapter.focusEditor();
    }

    handleUploadFileDelete = (attachment: Attachment) => {
        const { attachments } = this.getStates();
        const newAttachments = attachments.filter(item => item.uid !== attachment.uid);
        this._adapter.setState({
            attachments: newAttachments
        });
    }

    handleReferenceDelete = (reference: Reference) => {
        this._adapter.handleReferenceDelete(reference);
    }

    handleReferenceClick = (reference: Reference) => {
        this._adapter.handleReferenceClick(reference);
    }

    handleKeyDown = (e: KeyboardEvent) => {
        const { skills, suggestions, skillHotKey } = this.getProps();
        const { skillVisible, suggestionVisible } = this.getStates();
        const editor = this._adapter.getEditor();
        const oldValue = editor?.getText();
        const { activeSkillIndex, activeSuggestionIndex } = this.getStates();
        const popUpOptionListID = this._adapter.getPopupID();
        // 输入框为空，且按下 / 键, 触发 skill 面板打开
        // The input box is empty and the skill hot key is pressed to trigger the skill panel to open.
        if (oldValue == '' && e.key === skillHotKey && skills && skills.length) {
            // Open skill panel
            this._adapter.setState({ skillVisible: true });
            this.setDropdownWidth();
        }
    
        if ((oldValue === skillHotKey || oldValue?.length === 0) && e.key === 'Backspace') {
            // Close function panel
            this.setState({ skillVisible: false });
        }

        // If the input box is a skill's hotkey, pressing the up and down keys can switch panel options.
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            if (oldValue === skillHotKey) {
                const newIndex = (activeSkillIndex + (e.key === 'ArrowUp' ? -1 : 1) + skills.length) % skills.length;
                this.setState({ activeSkillIndex: newIndex });
                this.updateScrollTop(newIndex, `#${prefixCls}-skill-${popUpOptionListID} .${prefixCls}-skill-item:nth-child(${newIndex + 1})`);
            }
            if (suggestionVisible) {
                const newIndex = (activeSuggestionIndex + (e.key === 'ArrowUp' ? -1 : 1) + suggestions.length) % suggestions.length;
                this.setState({ activeSuggestionIndex: newIndex });
                this.updateScrollTop(newIndex, `#${prefixCls}-suggestion-${popUpOptionListID} .${prefixCls}-suggestion-item:nth-child(${newIndex + 1})`);
            }  
        }
        // The input box is a skill's hotkey. Press the enter key to trigger the skill panel to close and trigger the backfill of the selected function.
        if (skillVisible && e.key === 'Enter') {
            this.setState({
                skillVisible: false,
            });
            const newSkill = skills[activeSkillIndex];
            this.handleSkillSelect(newSkill);
        }
        if (suggestionVisible && e.key === 'Enter') {
            const newSuggestion = suggestions[activeSuggestionIndex];
            this.handleSuggestionSelect(newSuggestion);
            this.hideSuggestionPanel();
        }
        // 如果按下 Escape，检查各个层级的可见性
        // If Escape is pressed, check the visibility of each level
        if (e.key === 'Escape') {
            skillVisible && this.setState({
                skillVisible: false,
            });
            suggestionVisible && this.hideSuggestionPanel();
        }
    }

    onConfigureChange = (value: LeftMenuChangeProps, changedValue: LeftMenuChangeProps) => {
        this._adapter.notifyConfigureChange(value, changedValue);
    }


    updateScrollTop = (index?: number, selector?: string) => {
        if (index === undefined) {
            return;
        }
        let destNode = document.querySelector(selector) as HTMLDivElement;
        if (Array.isArray(destNode)) {
            destNode = destNode[0];
        }
        if (destNode) {
            /**
             * Scroll the first selected item into view.
             * The reason why ScrollIntoView is not used here is that it may cause page to move.
             */
            const destParent = destNode.parentNode as HTMLDivElement;
            destParent.scrollTop = destNode.offsetTop -
                destParent.offsetTop -
                (destParent.clientHeight / 2) +
                (destNode.clientHeight / 2);
        }
    }

    showSuggestionPanel = () => {
        this.setState({ suggestionVisible: true });
        this.setDropdownWidth();
        this._adapter.registerClickOutsideHandler(this.hideSuggestionPanel);
    }

    hideSuggestionPanel = () => {
        this.setState({ suggestionVisible: false });
        this._adapter.unregisterClickOutsideHandler();
    }

    handleContentChange = (content: string) => {
        const { suggestions, transformer } = this.getProps();
        const { skill } = this.getStates();
        if (suggestions && suggestions.length > 0) {
            this.showSuggestionPanel();
        }
        const editor = this._adapter.getEditor();
        const jsonResult = editor.getJSON();
        const finalResult = transformJSONResult(jsonResult, transformer);
        this._adapter.notifyContentChange(finalResult);
        const html = editor.getHTML();
        if (content === '' && Object.keys(skill).length && !html.includes('</skill-slot>')) {
            this.setState({ 
                skill: {} as BaseSkill,
                templateVisible: false
            });
        }
        this.setState({
            content: jsonResult,
        });
        this._adapter.reposPopover();
    }

    onUploadChange = (props: any) => {
        const { fileList } = props;
        const { onUploadChange } = this.getProps();
        onUploadChange?.(props);
        const { uploadProps } = this.getProps();
        const { onChange } = uploadProps;
        onChange?.(props);
        this.setState({
            attachments: fileList,
        });
    }

    _isRichTextEmpty = () => {
        /*
        空内容时候的 json 结构:
        Json structure when empty content:
        {
            "type": "doc",
            "content": [
                {
                    "type": "paragraph",
                    "content": --
                }
            ]
        }
        */
        const editor = this._adapter.getEditor();
        if (!editor) {
            return true;
        }
        const json = editor.getJSON?.();
        const level2Content = json.content[0].content;
        if (level2Content === undefined) {
            return true;
        }
        return false;
    }

    canSend = () => {
        const canSend = this.getProp('canSend');
        if (canSend !== undefined) {
            return canSend;
        }
        const references = this.getProp('references');
        const { attachments } = this.getStates();
        const validRichText = !this._isRichTextEmpty();
        const validAttachment = Array.isArray(attachments) && (attachments.length > 0);
        const validReference = Array.isArray(references) && (references.length > 0);
        return validRichText || validAttachment || validReference;
    }

    handleSend = () => {
        const { isGenerating } = this.getProps();
        if (isGenerating) {
            this._adapter.notifyStopGenerate();
            return;
        } else {
            if (!this.canSend()) {
                return;
            }
            const references = this.getProp('references');
            const { attachments } = this.getStates();
            const editor = this._adapter.getEditor();
            let richTextResult = [];
            if (editor) {
                const json = editor.getJSON?.();
                richTextResult = transformJSONResult(json);
            }
            this._adapter.notifyMessageSend({
                references,
                attachments,
                inputContents: richTextResult,
                setup: {}
            });
        }
    }

    handleContainerMouseDown = (e: React.MouseEvent) => {
        this.mouseDownTarget = e.target as HTMLElement;
    }

    handleContainerClick = (e: React.MouseEvent) => {
        const target = e.target;
        if (this.mouseDownTarget && this.mouseDownTarget !== e.target) {
            // 注意：这个判断是为了防止在富文本区域按下鼠标/键盘触控板，选择选区，然后拖动鼠标/键盘触控板，
            // 释放鼠标/触控板的位置在富文本区域之外，导致选区丢失的问题。
            // Note: This judgment is to prevent pressing the mouse/keyboard trackpad in the rich text area, 
            // selecting the selection, and then dragging the mouse/keyboard trackpad.
            // The issue where the mouse/trackpad is released outside the rich text area causes the selection to be lost.
            return;
        }
        const richTextDiv = this._adapter.getRichTextDiv();
        if (richTextDiv && (richTextDiv === target || richTextDiv.contains(target as Node))) {
            const { suggestions } = this.getProps();
            if (suggestions && suggestions.length > 0) {
                this.showSuggestionPanel();
            }
            return;
        }
        this._adapter.focusEditor();
    }

    handRichTextArealKeyDown = (view: any, event: KeyboardEvent) => {
        const { suggestionVisible } = this.getStates();
        if (suggestionVisible && ['ArrowUp', 'ArrowDown', 'Enter'].includes(event.key)) {
            return true;
        }
        if (event.key !== 'Delete' && event.key !== 'Backspace') return false;
        const { state, dispatch } = view;
        const { selection } = state;

        if (this._adapter.isSelectionText(selection) && selection.empty) {
            const $pos = selection.$head;
            const before = $pos.nodeBefore;
            const after = $pos.nodeAfter;
            const beforePos = $pos.pos - 1;

            if (before && before.isText && before.text === '\uFEFF') {
                // 当光标前面是零宽字符时，零宽字符前面是 inputSlot，则按下删除按键，应该删除零宽字符和前面的 inputSlot 节点
                // When the cursor is preceded by a zero-width character, and the zero-width character is preceded by an inputSlot, 
                // then pressing the delete button should delete the zero-width character and the preceding inputSlot node.
                const $before = state.doc.resolve(beforePos);
                const nodeBeforeZeroWidth = $before.nodeBefore;
                if (nodeBeforeZeroWidth && nodeBeforeZeroWidth.type.name === 'inputSlot') {
                    // inputSlot 节点的起始位置 The starting position of the inputSlot node
                    const inputSlotEnd = beforePos;
                    const inputSlotStart = inputSlotEnd - nodeBeforeZeroWidth.nodeSize;
                    // 删除范围是 [inputSlotStart, inputSlotEnd]
                    // The deletion range is [inputSlotStart, inputSlotEnd]
                    const tr = state.tr.delete(inputSlotStart, $pos.pos);
                    tr.setMeta('inputSlotDeleted', true);
                    dispatch(tr);
                    event.preventDefault();
                    return true;
                }
            }
            // 光标在 inputSlot 后，按删除键，如果 inputSlot 后面是零宽字符，也一并删除
            // When the cursor is behind inputSlot, press the delete key. 
            // If there are zero-width characters behind inputSlot, they will also be deleted.
            if (before && before.type && before.type.name === 'inputSlot') {
                // 计算 inputSlot 的起始和结束
                // Calculate the start and end of inputSlot
                const inputSlotStart = $pos.pos - before.nodeSize;
                let inputSlotEnd = $pos.pos;
                if (after && after.isText && after.text === '\uFEFF') {
                    inputSlotEnd += after.nodeSize;
                }
                const tr = state.tr.delete(inputSlotStart, inputSlotEnd);
                tr.setMeta('inputSlotDeleted', true);
                dispatch(tr);
                event.preventDefault();
                return true;
            }
        }
        return false;
    }

    handleDeleteContent = (content: Content) => {
        // 用于删除一些特殊内容，比如用户自定义的 slot，删除需要借助参数中的 uniqueKey
        // Used to delete some special content, such as user-defined slots. To delete, you need to use the uniqueKey in the parameter.
        const { uniqueKey } = content;
        const editor = this._adapter.getEditor();
        if (!editor) return;

        editor.commands.command(({ tr, state }) => {
            let found = false;
            state.doc.descendants((node, pos) => {
                if (node.type.name === 'referSlot' && node.attrs.uniqueKey === uniqueKey) {
                    tr.setSelection(this._adapter.createSelection(tr.doc, pos));
                    found = true;
                    return false;
                }
                return true;
            });
            if (found) {
                // Delay deletion to avoid Uncaught RangeError: Applying a mismatched transaction
                setTimeout(() => {
                    editor.view.dispatch(tr);
                    editor.commands.deleteSelection();
                }, 0);
                
                return true;
            }
            
            return false;
        });
    }

    handleFocus = (event: any) => {
        this._adapter.notifyFocus(event);
    }

    handleBlur = (event: any) => {
        this._adapter.notifyBlur(event);
    }

}
