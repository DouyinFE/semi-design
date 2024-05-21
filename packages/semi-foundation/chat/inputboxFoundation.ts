import BaseFoundation, { DefaultAdapter } from "../base/foundation";

export interface InputBoxAdapter<P = Record<string, any>, S = Record<string, any>> extends DefaultAdapter<P, S> {
    notifyInputChange: (props: { inputValue: string; attachment: any[]}) => void;
    setInputValue: (value: string) => void;
    setAttachment: (attachment: any[]) => void;
    notifySend: (content: string, attachment: any[]) => void
}

export default class InputBoxFoundation <P = Record<string, any>, S = Record<string, any>> extends BaseFoundation<InputBoxAdapter<P, S>, P, S> {
    constructor(adapter: InputBoxAdapter<P, S>) {
        super({ ...adapter });
    }

    onInputAreaChange = (value: string) => {
        const attachment = this.getState('attachment');
        this._adapter.setInputValue(value);
        this._adapter.notifyInputChange({ inputValue: value, attachment });
    }

    onAttachmentAdd = (props: any) => {
        const { fileList } = props;
        const { content, attachment } = this.getStates();
        const newAttachMent = [...attachment, ...fileList];
        this._adapter.setAttachment(newAttachMent);
        this._adapter.notifyInputChange({
            inputValue: content,
            attachment: newAttachMent
        });
    }
    
    onAttachmentDelete = (props: any) => {
        const { content, attachment } = this.getStates();
        const newAttachMent = attachment.filter(item => item.uid !== props.uid);
        this._adapter.setAttachment(newAttachMent);
        this._adapter.notifyInputChange({
            inputValue: content,
            attachment: newAttachMent
        });
    }
    
    onSend = (e: any) => {
        const { content, attachment } = this.getStates();
        this._adapter.setInputValue('');
        this._adapter.setAttachment([]);
        this._adapter.notifySend(content, attachment);
    }

}