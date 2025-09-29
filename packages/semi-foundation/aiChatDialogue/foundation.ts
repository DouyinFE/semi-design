import BaseFoundation, { DefaultAdapter } from "../base/foundation";
import { getUuidv4 } from "../utils/uuid";
import { ROLE } from "./constants";

export interface DialogueAdapter<P = Record<string, any>, S = Record<string, any>> extends DefaultAdapter<P, S> {
    updateSelected: (selectedIds: string[]) => void;
    notifySelect: (selectedIds: string[]) => void;
    notifyChatsChange: (chats: Message[]) => void;
    notifyCopyMessage: (message: Message) => void;
    notifyLikeMessage: (message: Message) => void;
    notifyDislikeMessage: (message: Message) => void;
    notifyEditMessage: (message: Message) => void;
    notifyHintClick: (hint: string) => void
}

export default class DialogueFoundation <P = Record<string, any>, S = Record<string, any>> extends BaseFoundation<DialogueAdapter<P, S>, P, S> {
    constructor(adapter: DialogueAdapter<P, S>) {
        super({ ...adapter });
    }

    init = () => {
        // init
    }

    destroy = () => {
        // destroy
    }

    handleSelectAll = () => {
        const { chats } = this.getProps();
        const selectedIds = chats.map((chat: Message) => chat.id);
        this._adapter.updateSelected(selectedIds);
        this._adapter.notifySelect(selectedIds);
    }

    handleDeselectAll = () => {
        this._adapter.updateSelected([]);
        this._adapter.notifySelect([]);
    }

    handleSelectOrRemove = (isChecked: boolean, id: string) => {
        const { selectedIds } = this.getStates();
        let newSelectedIds = [];
        if (isChecked) {
            newSelectedIds = [...selectedIds, id];
        } else {
            newSelectedIds = selectedIds.filter((curId: string) => curId !== id);
        }
        this._adapter.updateSelected(newSelectedIds);
        this._adapter.notifySelect(newSelectedIds);
    }

    likeMessage = (message: Message) => {
        const { chats } = this.getStates();
        this._adapter.notifyLikeMessage(message);
        const index = chats.findIndex((item: Message) => item.id === message.id);
        const newChat = {
            ...chats[index],
            like: !chats[index].like,
            dislike: false,
        };
        const newChats = [...chats];
        newChats.splice(index, 1, newChat);
        this._adapter.notifyChatsChange(newChats);
    }

    dislikeMessage = (message: Message) => {
        const { chats } = this.getStates();
        this._adapter.notifyDislikeMessage(message);
        const index = chats.findIndex(item => item.id === message.id);
        const newChat = {
            ...chats[index],
            like: false,
            dislike: !chats[index].dislike,
        };
        const newChats = [...chats];
        newChats.splice(index, 1, newChat);
        this._adapter.notifyChatsChange(newChats);
    }

    resetMessage = (message: Message) => {
        const { chats } = this.getStates();
        const lastMessage = chats[chats.length - 1];
        const newLastChat = {
            ...lastMessage,
            status: 'in_progress',
            content: '',
            id: getUuidv4(),
            createAt: Date.now(),
        };
        const newChats = chats.slice(0, -1).concat(newLastChat);
        this._adapter.notifyChatsChange(newChats);
        const { onMessageReset } = this.getProps();
        onMessageReset?.(message);
    }

    editMessage = (message: Message) => {
        const { chats } = this.getStates();
        console.log('editMessage11', message);
        this._adapter.notifyEditMessage(message);
        const index = chats.findIndex(item => item.id === message.id);
        const newChat = {
            ...chats[index],
            isEditing: !chats[index].isEditing,
        };
        const newChats = [...chats];
        newChats.splice(index, 1, newChat);
        console.log('newChats', newChats);
        this._adapter.notifyChatsChange(newChats);
    }

    deleteMessage = (message: Message) => {
        const { onMessageDelete, onChatsChange } = this.getProps();
        const { chats } = this.getStates();
        onMessageDelete?.(message);
        const newChats = chats.filter(item => item.id !== message.id);
        onChatsChange?.(newChats);
    }

    onHintClick = (hint: string) => {
        const { chats } = this.getStates();
        const newMessage = {
            role: ROLE.USER,
            id: getUuidv4(),
            createAt: Date.now(),
            content: hint,
        };
        const newChats = [...chats, newMessage];
        this._adapter.notifyChatsChange(newChats);
        this._adapter.notifyHintClick(hint);
    }


}

export interface Message {
    id: string;
    content?: string | ContentItem[];
    output_text?: string;
    role: string;
    createdAt?: string;
    updatedAt?: string;
    model?: string;
    status?: string;
    type?: string;
    [x: string]: any
}

export type ContentItem = InputContentItem | OutputContentItem;

export type InputContentItem = InputMessage | ItemReference;
export type OutputContentItem = OutputMessage | ToolCallContentItem | MCPContentItem | Reasoning ;

export type ToolCallContentItem = FileSearchToolCall | WebSearchToolCall | FunctionToolCall | CustomToolCall | ImageGenerationCall| CustomObject;
// todo: 补全 MCP 的所有类型
export type MCPContentItem = MCPToolCall;

export interface CommonContentItem {
    id?: string;
    type?: string;
    status?: string;
    role?: string
}

export interface InputMessage extends CommonContentItem {
    content?: string | (InputText | InputImage | InputFile)[]
}

export interface ItemReference extends CommonContentItem {
    file_id?: string
}

export interface CustomObject {
    [key: string]: any
}

export interface OutputMessage extends CommonContentItem {
    content?: (OutputText | Refusal)[]
}

export interface OutputText {
    text?: string;
    type?: string;
    annotations?: Annotation[]
}

export interface Refusal extends CommonContentItem {
    refusal?: string;
    type?: string
}

export interface URLCitation {
    end_index?: number;
    start_index?: number;
    title?: string;
    type?: string;
    url?: string
}

export type Annotation = URLCitation | CustomObject;

export interface Reasoning extends CommonContentItem {
    summary?: {
        text?: string;
        type?: string
    }[];
    content?: {
        text?: string;
        type?: string
    }[]
}

export interface FileSearchToolCallResult {
    attributes?: Map<string, string>;
    score?: number;
    file_id?: string;
    filename?: string;
    text?: string
}

export interface FileSearchToolCall extends CommonContentItem {
    queries?: string[];
    results?: FileSearchToolCallResult[]
}

export interface WebSearchToolCall extends CommonContentItem {
    action?: SearchAction | OpenPageAction | FindAction
}
export interface SearchAction {
    type?: string;
    query?: string;
    sources?: { type: string; url: string }[]
}
export interface OpenPageAction {
    type?: string;
    url?: string
}
export interface FindAction {
    action?: string;
    type?: string;
    query?: string
}

export interface FunctionToolCall extends CommonContentItem {
    call_id?: string;
    name?: string;
    arguments?: string
}

export interface CustomToolCall extends CommonContentItem {
    call_id?: string;
    name?: string;
    input?: string
}

export interface ImageGenerationCall extends CommonContentItem {
    result?: string
}

// MCPToolCall 
export interface MCPToolCall extends CommonContentItem {
    arguments?: string;
    server_label?: string;
    name?: string;
    result?: string;
    output?: string
}

export interface FileUploadToolCall extends CommonContentItem {
    result?: string
}

export interface InputText extends CommonContentItem {
    text?: string
}

export interface InputImage extends CommonContentItem {
    detail?: string;
    file_id?: string;
    image_url?: string
}

export interface InputFile extends CommonContentItem {
    file_id?: string;
    file_data?: string;
    file_url?: string;
    filename?: string;
    size?: string;
    file_type?: string;
    fileInstance?: any
}



// 内部自定义 dialogue item 类型
export interface Action {
    status?: string;
    summary?: string;
    description?: string;
    icon?: any
}

export interface Step {
    type?: string;
    status?: string;
    summary?: string;
    actions?: Action[]
}

export interface Reference {
    id?: string;
    type?: string;
    name?: string;
    url?: string;
    content?: string
}
