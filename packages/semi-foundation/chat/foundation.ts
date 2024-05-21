import BaseFoundation, { DefaultAdapter } from "../base/foundation";
import { ROLE } from "./constants";
import { Animation } from '@douyinfe/semi-animation';
import { debounce } from "lodash";
import { getUuidv4 } from "../utils/uuid";
import { SCROLL_ANIMATION_TIME, SHOW_SCROLL_GAP } from './constants';


export interface Message {
    role?: string;
    name?: string;
    id?: string;
    content?: string;
    parentId?: string;
    createAt?: number;
    status?: 'loading' | 'incomplete' | 'complete' | 'error';
    [x: string]: any
}

export interface ChatAdapter<P = Record<string, any>, S = Record<string, any>> extends DefaultAdapter<P, S> {
    getContainerRef: () => React.RefObject<HTMLDivElement>;
    setWheelScroll: (flag: boolean) => void;
    notifyChatsChange: (chats: Message[]) => void;
    notifyLikeMessage: (message: Message) => void;
    notifyDislikeMessage: (message: Message) => void;
    notifyCopyMessage: (message: Message) => void;
    notifyClearContext: () => void;
    notifyMessageSend: (content: string, attachment: any[]) => void;
    notifyInputChange: (props: { inputValue: string; attachment: any[]}) => void;
    setBackBottomVisible: (visible: boolean) => void;
    registerWheelEvent: () => void;
    unRegisterWheelEvent: () => void;
    notifyStopGenerate: (e: any) => void;
    notifyHintClick: (hint: string) => void
}


export default class ChatFoundation <P = Record<string, any>, S = Record<string, any>> extends BaseFoundation<ChatAdapter<P, S>, P, S> {

    animation: any;

    constructor(adapter: ChatAdapter<P, S>) {
        super({ ...adapter });
    }

    init = () => {
        this.scrollToBottomImmediately();
        this._adapter.registerWheelEvent();
    }

    destroy = () => {
        this.animation && this.animation.destroy();
    }

    stopGenerate = (e: any) => {
        this._adapter.notifyStopGenerate(e);
    }

    scrollToBottomImmediately = () => {
        const containerRef = this._adapter.getContainerRef();
        const element = containerRef?.current;
        if (element) {
            element.scrollTop = element.scrollHeight;
        } 
    }

    scrollToBottomWithAnimation = () => {
        const duration = SCROLL_ANIMATION_TIME;
        const containerRef = this._adapter.getContainerRef();
        const element = containerRef?.current;
        if (!element) {
            return;
        }
        const from = element.scrollTop;
        const to = element.scrollHeight;
        this.animation = new Animation(
            {
                from: { scrollTop: from },
                to: { scrollTop: to },
            },
            {
                duration,
                easing: 'easeInOutCubic'
            }
        );
    
        this.animation.on('frame', ({ scrollTop }: { scrollTop: number }) => {
            element.scrollTop = scrollTop;
        });
    
        this.animation.start();
    }

    containerScroll = (e: any) => {
        e.persist();
        const update = () => {
            this.getScroll(e.target);
        };
        requestAnimationFrame(update);
    }

    getScroll = debounce((target: any) => {
        const scrollHeight = target.scrollHeight;
        const clientHeight = target.clientHeight;
        const scrollTop = target.scrollTop;
        const { backBottomVisible } = this.getStates();
        if (scrollHeight - scrollTop - clientHeight <= SHOW_SCROLL_GAP) {
            if (backBottomVisible) {
                this._adapter.setBackBottomVisible(false);
            }
        } else {
            if (!backBottomVisible) {
                this._adapter.setBackBottomVisible(true);
            }
        }
        return scroll;
    }, 100)

    clearContext = (e: any) => {
        const { chats } = this.getStates();
        if (chats[chats.length - 1].role === ROLE.DIVIDER) {
            return;
        }
        const dividerMessage = {
            role: ROLE.DIVIDER,
            id: getUuidv4(),
            createAt: Date.now(),
        };
        const newChats = [...chats, dividerMessage];
        this._adapter.notifyChatsChange(newChats);
        this._adapter.notifyClearContext();
    } 

    onMessageSend = (content: string, attachment: any[]) => {
        this._adapter.setWheelScroll(false);
        this._adapter.registerWheelEvent();
        this._adapter.notifyMessageSend(content, attachment);
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

    onInputChange = (props: { inputValue: string; attachment: any[]}) => {
        this._adapter.notifyInputChange(props as any);
    }

    deleteMessage = (message: Message) => {
        const { onMessageDelete, onChatsChange } = this.getProps();
        const { chats } = this.getStates();
        onMessageDelete?.(message);
        const newChats = chats.filter(item => item.id !== message.id);
        onChatsChange?.(newChats);
    }

    likeMessage = (message: Message) => {
        const { chats } = this.getStates();
        this._adapter.notifyLikeMessage(message);
        const index = chats.findIndex(item => item.id === message.id);
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
        this._adapter.notifyChatsChange(chats.slice(0, -1));
        const { onMessageReset } = this.getProps();
        onMessageReset?.(message);
    }
}

