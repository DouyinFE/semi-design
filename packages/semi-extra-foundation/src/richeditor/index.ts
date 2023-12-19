import BaseFoundation, { DefaultAdapter } from "@douyinfe/semi-foundation/lib/es/base/foundation";
import { v4 } from 'uuid';
import "./index.scss";
import { nth } from "lodash-es";


export interface RichEditorProps{

}


export interface RichEditorState{

}



export interface FoundationState{
    currentEditingNodeId: string|null;
    isForcing: boolean;
    data: {
        nodes: EditorNode[]
    };
    container: HTMLElement|null
}

export interface EditorType{
    name: string
}

export interface EditorTypeBold extends EditorType{
    name: 'bold'
}

export interface EditorTypeItalic extends EditorType{
    name: 'italic'
}

export interface EditorTypeTitle extends EditorType{
    name: 'title';
    value: number
}

export interface EditorTypeUnderline extends EditorType{
    name: 'underline'
}

export interface EditorTypeColor extends EditorType{
    name: 'color';
    value: string
}

export interface EditorTypeBgColor extends EditorType{
    name: 'bgColor'

}

export interface EditorTypeLink extends EditorType{
    name: 'link';
    value: string
}

export interface EditorTypeText extends EditorType{
    name: 'text';
    value?: number
}


export interface RichEditorAdapter<P = Record<string, any>, S = Record<string, any>> extends DefaultAdapter<P, S> {
    createElement: (node: EditorNode, index: number) => void;
    updateElement: (node: EditorNode) => void;
    getDOMByNodeId: (id: string) => HTMLElement|null
}


export interface EditorNode{
    id: string;
    content: string;
    type: (EditorTypeBold|EditorTypeItalic|EditorTypeTitle|EditorTypeUnderline|EditorTypeColor|EditorTypeBgColor|EditorTypeLink|EditorTypeText)[]
}



class RichEditorFoundation <P = Record<string, any>, S = Record<string, any>> extends BaseFoundation<RichEditorAdapter<P, S>, P, S> {

    foundationState: FoundationState = {
        currentEditingNodeId: null,
        isForcing: false,
        container: null,
        data: {
            nodes: [],
        }
    }
    idNodeMap: Map<string, EditorNode> = new Map()
    constructor(adapter: RichEditorAdapter<P, S>) {
        super({ ...RichEditorFoundation.defaultAdapter, ...adapter });
    }

    registerContainer = (container: HTMLElement)=>{
        this.foundationState.container = container;
    }


    onUserInput = (nodeId: string|null, data: string)=>{
        if (nodeId===null) {

            const node = this.createNode(data, [{
                name: 'text'
            } as EditorTypeText]);
            this.idNodeMap.set(node.id, node);
            this._adapter.createElement(node, this.foundationState.data.nodes.length);
            this.foundationState.data.nodes.push(node);


        } else {
            const lastNode = nth(this.foundationState.data.nodes, -1)!;
            lastNode.content+=data;
            this._adapter.updateElement(lastNode);
            console.log(lastNode);
            setTimeout(()=>{
                this._adapter.getDOMByNodeId(lastNode.id)?.focus();
                console.log("===>this._adapter.getDOMByNodeId(lastNode.id)", this._adapter.getDOMByNodeId(lastNode.id)?.focus());
            }, 1000);
        }
    }

    createNode = (data: string, types: EditorNode['type'])=>{
        return {
            id: v4(),
            content: data,
            type: types
        };
    }

    getNodeById = (id: string)=>{
        return this.idNodeMap.get(id);
    }


    onContainerClick = ()=>{
        const lastNode = nth(this.foundationState.data.nodes, -1);
        if (lastNode) {
            this._adapter.getDOMByNodeId(lastNode.id)?.focus();
        }
    }

    onTitle = (titleNum: number)=>{

    }
    onBold = ()=>{

    }

    onItalic = ()=>{

    }

    onUnderline = ()=>{

    }

    onColor = (color: string)=>{

    }

    onBgColor = (color: string)=>{

    }

    onLink = (url: string)=>{

    }


    private getSelection = ()=>{
        const currentSelection = window.getSelection();
        if (currentSelection &&
            this.foundationState.container?.contains(currentSelection.anchorNode)
            && this.foundationState.container?.contains(currentSelection.focusNode)
        ) {

        }

        return null;
    }
}

export default RichEditorFoundation;



