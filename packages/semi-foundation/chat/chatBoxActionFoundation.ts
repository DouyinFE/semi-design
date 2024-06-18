import BaseFoundation, { DefaultAdapter } from "../base/foundation";

export interface ChatBoxActionAdapter<P = Record<string, any>, S = Record<string, any>> extends DefaultAdapter<P, S> {
    setVisible: (visible: boolean) => void;
    notifyDeleteMessage: () => void;
    notifyMessageCopy: () => void;
    copyToClipboardAndToast: () => void;
    notifyLikeMessage: () => void;
    notifyDislikeMessage: () => void;
    notifyResetMessage: () => void
}

export default class ChatBoxActionFoundation <P = Record<string, any>, S = Record<string, any>> extends BaseFoundation<ChatBoxActionAdapter<P, S>, P, S> {
    constructor(adapter: ChatBoxActionAdapter<P, S>) {
        super({ ...adapter });
    }

    closeDeleteModal = () => {
        this._adapter.setVisible(false);
    }

    showDeleteModal = () => {
        this._adapter.setVisible(true);
    }

    deleteMessage = () => {
        this._adapter.notifyDeleteMessage();
    }

    copyMessage = () => {
        this._adapter.notifyMessageCopy();
        this._adapter.copyToClipboardAndToast(); 
    }

    likeMessage = () => {
        this._adapter.notifyLikeMessage();
    }

    dislikeMessage = () => {
        this._adapter.notifyDislikeMessage();
    }

    resetMessage = () => {
        this._adapter.notifyResetMessage();
    }

}