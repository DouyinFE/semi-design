import BaseFoundation, { DefaultAdapter } from "@douyinfe/semi-foundation/lib/es/base/foundation";
import { v4 } from 'uuid';
import "./index.scss";
import { cloneDeep, nth } from "lodash-es";


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

export type EditorTypes = EditorTypeBold|EditorTypeItalic|EditorTypeTitle|EditorTypeUnderline|EditorTypeColor|EditorTypeBgColor|EditorTypeLink|EditorTypeText

export interface RichEditorAdapter<P = Record<string, any>, S = Record<string, any>> extends DefaultAdapter<P, S> {
    createElement: (node: EditorNode, index: number) => Promise<void>;
    updateElement: (node: EditorNode) => Promise<void>;
    getDOMByNodeId: (id: string) => HTMLElement|null;
    getActiveNodeId: () => string|null;
    replaceElement: (node: EditorNode, newNodes: EditorNode[]) => Promise<void>
}


export interface EditorNode{
    id: string;
    content: string;
    type: EditorTypes[]
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

    init = ()=>{
        const node = this.createNode("", [{
            name: 'text'
        } as EditorTypeText]);
        this.idNodeMap.set(node.id, node);
        this._adapter.createElement(node, this.foundationState.data.nodes.length);
        this.foundationState.data.nodes.push(node);
    }

    registerContainer = (container: HTMLElement)=>{
        this.foundationState.container = container;
    }


    onUserInput = async (nodeId: string|null, data: string)=>{
        if (nodeId===null) {
            // all inputs are empty or empty editor
            const node = this.createNode(data, [{
                name: 'text'
            } as EditorTypeText]);
            this.idNodeMap.set(node.id, node);
            await this._adapter.createElement(node, this.foundationState.data.nodes.length);
            this.foundationState.data.nodes.push(node);
        } else {
            const node = this.getNodeById(nodeId);
            if (!node) {
                return;
            }
            const dom = this._adapter.getDOMByNodeId(node.id);

            const section = window.getSelection();
            const range = section!.getRangeAt(0);
            const cursorIndex = range!.startOffset;
            node.content = node.content.slice(0, cursorIndex) + data + node.content.slice(cursorIndex);
            await this._adapter.updateElement(node);
            if (dom && section && range) {
                dom.focus?.();
                range.setStart(dom.childNodes[0], cursorIndex + data.length);
                range.collapse();
                section.removeAllRanges();
                section.addRange(range);
            }
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
        const id = this._adapter.getActiveNodeId();
        if (!id) {
            return;
        }
        const node = this.getNodeById(id);
        if (!node) {
            return;
        }
        const selectStart = window.getSelection()?.anchorOffset;
        const selectEnd = window.getSelection()?.focusOffset;
        if (selectStart===selectEnd) {
            return;
        }
        const oldNodeContent = node.content = node.content.slice(0, selectStart);
        const midNodeContent = node.content.slice(selectStart, selectEnd);
        const lastNodeContent = node.content.slice(selectEnd);

        node.content = oldNodeContent;
        const midNode = this.createNode(midNodeContent, [{
            name: 'bold'
        } as EditorTypeBold, ...node.type]);
        const lastNode = {
            ...cloneDeep(node),
            content: lastNodeContent
        };

        const nodeIndex = this.foundationState.data.nodes.findIndex((item)=>item.id===node.id);
        this.foundationState.data.nodes.splice(nodeIndex, 1, node, midNode, lastNode);
        this._adapter.replaceElement(node, [node, midNode, lastNode]);


        
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



