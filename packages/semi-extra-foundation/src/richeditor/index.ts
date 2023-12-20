import BaseFoundation, { DefaultAdapter } from "@douyinfe/semi-foundation/lib/es/base/foundation";
import { v4 } from 'uuid';
import "./index.scss";
import { isEqual, nth } from "lodash-es";


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
    name: 'bgColor';
    value: string
}

export interface EditorTypeLink extends EditorType{
    name: 'link';
    value: string
}

export interface EditorTypeText extends EditorType{
    name: 'text';
    value?: number
}

export interface EditorTypeNewLine extends EditorType{
    name: 'newLine'
}

export type EditorTypes = EditorTypeBold|EditorTypeItalic|EditorTypeTitle|EditorTypeUnderline|EditorTypeColor|EditorTypeBgColor|EditorTypeLink|EditorTypeText|EditorTypeNewLine

export interface RichEditorAdapter<P = Record<string, any>, S = Record<string, any>> extends DefaultAdapter<P, S> {
    createElement: (node: EditorNode, index: number) => Promise<void>;
    updateElement: (node: EditorNode) => Promise<void>;
    getDOMByNodeId: (id: string) => HTMLElement|null;
    getSelectionInfo: () => {startNodeId: string|null; endNodeId: string|null; startOffset: number; endOffset: number };
    replaceElement: (startIndex: number, endIndex: number, removeNodes: EditorNode[], newNodes: EditorNode[]) => Promise<void>;
    insertElement: (index: number, nodes: EditorNode[]) => Promise<void>
}
 

export interface EditorNode{
    id: string;
    content: string;
    type: EditorTypes[];
    special?: string
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

    onUserInsertParagraph = async (nodeId: string|null)=>{
        const node = this.createNode("\n", [{
            name: 'newLine',
        } as EditorTypeNewLine]);
        if (nodeId===null) {
            await this._adapter.createElement(node, this.foundationState.data.nodes.length);
        } else {
            const index = this.foundationState.data.nodes.findIndex((item)=>item.id===nodeId);
            if (index===-1) {
                return;
            }
            await this._adapter.createElement(node, index+1);
        }
        this.idNodeMap.set(node.id, node);
        this.foundationState.data.nodes.push(node);
    }

    createNode = (data: string, types: EditorNode['type'])=>{
        return {
            id: v4(),
            content: data,
            type: types,
        };
    }

    getNodeById = (id: string)=>{
        return this.idNodeMap.get(id);
    }


    onContainerClick = (e: PointerEvent)=>{
        const id = (e.target as HTMLElement)?.getAttribute('data-node-id');
        if (id) {
            const node = this.getNodeById(id);
            if (node) {
                this._adapter.getDOMByNodeId(node.id)?.focus();
            }
        } else {
            const lastNode = nth(this.foundationState.data.nodes, -1);
            if (lastNode) {
                this._adapter.getDOMByNodeId(lastNode.id)?.focus();
            }
        }
    }

    applyTypeToNodes = async ({ startNode, endNode, offsetInEndNode, offsetInStartNode, newTypes }: {
        startNode: EditorNode; endNode: EditorNode;offsetInStartNode: number;offsetInEndNode: number;newTypes: EditorTypes[]
    })=>{
        // buggy
        const startNodeIndex = this.foundationState.data.nodes.findIndex((item)=>item.id===startNode.id);
        const endNodeIndex = this.foundationState.data.nodes.findIndex((item)=>item.id===endNode.id);


        const newStartNode = this.createNode(startNode.content.slice(0, offsetInStartNode), startNode.type);
        const newEndNode = this.createNode(endNode.content.slice(offsetInEndNode), endNode.type);

        let nodeSplitFromStartNode;
        let nodeSplitFromEndNode;
        if (startNode.id===endNode.id) {
            nodeSplitFromStartNode = this.createNode(startNode.content.slice(offsetInStartNode, offsetInEndNode), [...startNode.type, ...newTypes]);
            nodeSplitFromEndNode = this.createNode("", [...endNode.type, ...newTypes]);
        } else {
            nodeSplitFromStartNode = this.createNode(startNode.content.slice(offsetInStartNode), [...startNode.type, ...newTypes]);
            nodeSplitFromEndNode = this.createNode(endNode.content.slice(0, offsetInEndNode), [...endNode.type, ...newTypes]);
        }

        const middleNodes = this.foundationState.data.nodes.slice(startNodeIndex + 1, endNodeIndex);
        const newMiddleNodes = middleNodes.map((item)=>{
            return this.createNode(item.content, [...item.type, ...newTypes]);
        });

        const willAddedNodes = [newStartNode, nodeSplitFromStartNode, ...newMiddleNodes, nodeSplitFromEndNode, newEndNode];
        const willAddedNodesWithContent: EditorNode[] = [];
        willAddedNodes.forEach((item)=>{
            if (item.content.length===0) {
                this.idNodeMap.delete(item.id);
            } else {
                willAddedNodesWithContent.push(item);
                this.idNodeMap.set(item.id, item);
            }
        });
        
        this.foundationState.data.nodes.splice(startNodeIndex, endNodeIndex - startNodeIndex + 1, ...willAddedNodesWithContent);
        await this._adapter.replaceElement(startNodeIndex, endNodeIndex, [startNode, ...middleNodes, endNode], willAddedNodesWithContent);
        // await this.optimizeNodes(startNodeIndex, startNodeIndex - (endNodeIndex - startNodeIndex + 1) + willAddedNodesWithContent.length);
    }


    onTitle = (titleNum: number)=>{

    }
    onBold = async ()=>{
        const { startNodeId, endNodeId, startOffset, endOffset } = this._adapter.getSelectionInfo();
        if (!startNodeId || !endNodeId) {
            return;
        }
        const startNode = this.getNodeById(startNodeId);
        const endNode = this.getNodeById(endNodeId);
        if (!startNode || !endNode) {
            return;
        }

        await this.applyTypeToNodes({
            startNode,
            endNode,
            offsetInStartNode: startOffset,
            offsetInEndNode: endOffset,
            newTypes: [{
                name: 'bold'
            } as EditorTypeBold]
        });

        
    }

    onItalic = async ()=>{
        const { startNodeId, endNodeId, startOffset, endOffset } = this._adapter.getSelectionInfo();
        if (!startNodeId || !endNodeId) {
            return;
        }
        const startNode = this.getNodeById(startNodeId);
        const endNode = this.getNodeById(endNodeId);
        if (!startNode || !endNode) {
            return;
        }

        await this.applyTypeToNodes({
            startNode,
            endNode,
            offsetInStartNode: startOffset,
            offsetInEndNode: endOffset,
            newTypes: [{
                name: 'italic'
            } as EditorTypeItalic]
        });
    }

    onUnderline = async ()=>{
        const { startNodeId, endNodeId, startOffset, endOffset } = this._adapter.getSelectionInfo();
        if (!startNodeId || !endNodeId) {
            return;
        }
        const startNode = this.getNodeById(startNodeId);
        const endNode = this.getNodeById(endNodeId);
        if (!startNode || !endNode) {
            return;
        }

        await this.applyTypeToNodes({
            startNode,
            endNode,
            offsetInStartNode: startOffset,
            offsetInEndNode: endOffset,
            newTypes: [{
                name: 'underline'
            } as EditorTypeUnderline]
        });
    }

    onColor = async (color: string)=>{
        const { startNodeId, endNodeId, startOffset, endOffset } = this._adapter.getSelectionInfo();
        if (!startNodeId || !endNodeId) {
            return;
        }
        const startNode = this.getNodeById(startNodeId);
        const endNode = this.getNodeById(endNodeId);
        if (!startNode || !endNode) {
            return;
        }

        await this.applyTypeToNodes({
            startNode,
            endNode,
            offsetInStartNode: startOffset,
            offsetInEndNode: endOffset,
            newTypes: [{
                name: 'color',
                value: color
            } as EditorTypeColor]
        });
    }

    onBgColor = async (color: string)=>{
        const { startNodeId, endNodeId, startOffset, endOffset } = this._adapter.getSelectionInfo();
        if (!startNodeId || !endNodeId) {
            return;
        }
        const startNode = this.getNodeById(startNodeId);
        const endNode = this.getNodeById(endNodeId);
        if (!startNode || !endNode) {
            return;
        }

        await this.applyTypeToNodes({
            startNode,
            endNode,
            offsetInStartNode: startOffset,
            offsetInEndNode: endOffset,
            newTypes: [{
                name: 'bgColor',
                value: color
            } as EditorTypeBgColor]
        });
    }

    onLink = (url: string)=>{

    }


    private optimizeNodes = async (startIndex: number, endIndex: number)=>{
        // optimize node in [startIndex,endIndex]

        const newNodes: EditorNode[] = [];
        const newNodesIdSet = new Set<string>();
        let forwardCount = 0;
        for (let i=startIndex;i<=endIndex;i++) {
            const currentNode = this.foundationState.data.nodes[i];
            const prevNode = this.foundationState.data.nodes[i-1-forwardCount];
            if (!currentNode) {
                break;
            }

            if (!prevNode) {
                if (!newNodesIdSet.has(currentNode.id)) {
                    newNodes.push(currentNode);
                    newNodesIdSet.add(currentNode.id);
                    continue;
                }
            }

            if (i===startIndex) {
                newNodes.push(prevNode);
                newNodesIdSet.add(prevNode.id);
                if (isEqual(currentNode.type, prevNode.type)) {
                    prevNode.content += currentNode.content;
                    forwardCount++;
                } else {
                    newNodes.push(currentNode);
                    newNodesIdSet.add(currentNode.id);
                }
                continue;
            }

            if (isEqual(currentNode.type, prevNode.type)) {
                prevNode.content += currentNode.content;
                if (!newNodesIdSet.has(prevNode.id)) {
                    newNodesIdSet.add(prevNode.id);
                    newNodes.push(prevNode);
                }
                forwardCount++;
            } else {
                newNodesIdSet.add(currentNode.id);
                newNodes.push(currentNode);
                forwardCount=0;
            }
        }

        const slice = (arr: any[], startIndex: number, endIndex: number = Infinity)=>{
            if (startIndex<0) {
                startIndex = 0;
            }
            if (endIndex < 0) {
                return [];
            }
            endIndex = Math.min(endIndex, arr.length); 
            return arr.slice(startIndex, endIndex);
        };
        const removeNodes = this.foundationState.data.nodes.slice( Math.max(startIndex - 1, 0), Math.min(this.foundationState.data.nodes.length, endIndex + 1));
        const replaceElementArgs = [Math.max(startIndex - 1, 0), Math.min(this.foundationState.data.nodes.length, endIndex + 1), removeNodes, newNodes];
        this.foundationState.data.nodes = [...slice(this.foundationState.data.nodes, 0, startIndex-1), ...newNodes, ...slice(this.foundationState.data.nodes, endIndex+1)];
        await this._adapter.replaceElement(...replaceElementArgs);
        return newNodes;
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



