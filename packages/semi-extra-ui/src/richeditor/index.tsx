import React, { CSSProperties, ReactNode } from 'react';
import BaseComponent from "../base";
import RichEditorFoundation, { EditorNode, RichEditorAdapter } from "@douyinfe/semi-extra-foundation/src/richeditor";
import { Button } from "@douyinfe/semi-ui";
import { nth } from "lodash-es";


export interface RichEditorProps{

}

export interface RichEditorState{
    elementList: ReactNode[];
    color: string;
    bgColor: string
}

class RichEditor extends BaseComponent<RichEditorProps, RichEditorState> {

    constructor(props: RichEditorProps) {
        super(props);
        this.state = {
            elementList: [],
            color: "#000000",
            bgColor: "#ffffff"
        };
        this.foundation = new RichEditorFoundation(this.adapter);
        window.test = this;
    }
    containerRef: React.RefObject<HTMLDivElement> = React.createRef();
    nodeIdElementMap: Record<string, ReactNode> = {};
    nodeIdDOMMap: Record<string, HTMLElement> = {};
    get adapter(): RichEditorAdapter<RichEditorProps, RichEditorState> {
        return {
            ...super.adapter,
            insertElement: async (index: number, nodes: EditorNode[])=>{
                const newElements = nodes.map(this.nodeToElement);
                const eleList = [...this.state.elementList];
                eleList.splice(index, 0, ...newElements);
                nodes.forEach((n, i)=>{
                    this.nodeIdElementMap[n.id] = newElements[i];
                });
                return new Promise<void>(resolve => {
                    this.setState({ elementList: eleList }, resolve);
                });
            },
            replaceElement: async (startIndex: number, endIndex: number, removeNodes: EditorNode[], newNodes: EditorNode[])=>{  
                const oldElements = this.state.elementList.slice(startIndex, endIndex+1);
                if (oldElements.length>0) {
                    removeNodes.forEach(node=>{
                        delete this.nodeIdElementMap[node.id];
                        delete this.nodeIdDOMMap[node.id];
                    });
                    const newElements = newNodes.map(this.nodeToElement);
                    const eleList = [...this.state.elementList];
                    eleList.splice(startIndex, endIndex-startIndex+1, ...newElements);

                    newNodes.forEach((n, i)=>{
                        this.nodeIdElementMap[n.id] = newElements[i];
                    });
                    return new Promise<void>(resolve => {
                        this.setState({ elementList: eleList }, resolve);
                    });
                }
            },
            createElement: async (node: EditorNode, index: number)=>{
                // insert node on index
                const element = this.nodeToElement(node);
                const eleList = [...this.state.elementList];
                eleList.splice(index, 0, element);
                this.nodeIdElementMap[node.id] = element;
                return new Promise(resolve => {
                    this.setState({ elementList: eleList }, resolve);
                });
            },
            updateElement: async (node: EditorNode)=>{
                const oldElement = this.nodeIdElementMap[node.id];
                if (oldElement) {
                    const newElement = this.nodeToElement(node);
                    const index = this.state.elementList.indexOf(oldElement);
                    if (index!==-1) {
                        const eleList = [...this.state.elementList];
                        eleList.splice(index, 1, newElement);
                        delete this.nodeIdElementMap[node.id];
                        this.nodeIdElementMap[node.id] = newElement;
                        return new Promise(resolve => {
                            this.setState({ elementList: eleList }, resolve);
                        });
                    }
                }
            },
            getDOMByNodeId: (id: string)=>{
                return this.nodeIdDOMMap[id] || null;

            },
            getSelectionInfo: ()=>{
                const anchorDOM = window.getSelection()?.anchorNode?.parentElement;
                const anchorNodeId = anchorDOM?.getAttribute("data-node-id");
                const focusDOM = window.getSelection()?.focusNode?.parentElement;
                const focusNodeId = focusDOM?.getAttribute("data-node-id");
                const anchorOffset = window.getSelection()?.anchorOffset;
                const focusOffset = window.getSelection()?.focusOffset;

                let anchorIndex: number;
                let focusIndex: number;
                this.foundation.foundationState.data.nodes.forEach((n, i)=>{
                    if (n.id===anchorNodeId) {
                        anchorIndex = i;
                    }
                    if (n.id===focusNodeId) {
                        focusIndex = i;
                    }
                });
                if (anchorIndex! < focusIndex!) {
                    return {
                        startNodeId: anchorNodeId!,
                        endNodeId: focusNodeId!,
                        startOffset: anchorOffset!,
                        endOffset: focusOffset!
                    };
                } else if (anchorIndex! > focusIndex!) {
                    return {
                        startNodeId: focusNodeId!,
                        endNodeId: anchorNodeId!,
                        startOffset: focusOffset!,
                        endOffset: anchorOffset!
                    };
                } else {
                    return {
                        startNodeId: anchorNodeId!,
                        endNodeId: anchorNodeId!,
                        startOffset: Math.min(anchorOffset!, focusOffset!),
                        endOffset: Math.max(anchorOffset!, focusOffset!)
                    };
                }
            }
        };
    } 

    private nodeToElement = (node: EditorNode): ReactNode => {
        const closure: {
            dom: HTMLDivElement|null;
            eventMounted: boolean
        } = {
            dom: this.nodeIdDOMMap[node.id] as HTMLDivElement || null,
            eventMounted: Boolean(this.nodeIdElementMap[node.id]) || false
        };

        const style: CSSProperties= {};
        node.type.forEach(t=>{
            if (t.name==="color") {
                style['color'] = t.value;
            }
            if (t.name==="bgColor") { 
                style['backgroundColor'] = t.value;
            }
        });
        return <div ref={r=>{
            if (r && !closure.eventMounted) {
                closure.dom = r;
                this.nodeIdDOMMap[node.id] = closure.dom;
                closure.dom.addEventListener("beforeinput", (e)=>this.handleBeforeInputEvent(e as InputEvent, closure.dom!));
                closure.eventMounted=true;
            }
        }} data-node-id={node.id} contentEditable={true} suppressContentEditableWarning={true} style={style} className={node.type.map(t=>{
            return `semi-rich-editor-type-${t.name}`; // TODO: process each type
        }).join(" ")}>{node.content}</div>;
    }

    componentDidMount() {
        super.componentDidMount();
        const containerDOM = this.containerRef.current!;
        this.foundation.registerContainer(containerDOM);
        containerDOM.addEventListener("beforeinput", (e)=>this.handleBeforeInputEvent(e as InputEvent, containerDOM));
        containerDOM.addEventListener("click", this.foundation.onContainerClick);
    }

    handleBeforeInputEvent = (e: InputEvent, ele: HTMLDivElement)=>{
        ele = (()=>{
            if ( window.getSelection()!.anchorNode instanceof HTMLElement) {
                return window.getSelection()!.anchorNode as HTMLDivElement;
            } else {
                return window.getSelection()!.anchorNode!.parentElement! as HTMLDivElement;
            }
        })();
        if (e.inputType==="insertText") {
            if (ele===this.containerRef.current) {
                if (this.state.elementList.length===0) {
                    this.foundation.onUserInput(null, e.data);
                } else {
                    const lastNode = nth(this.foundation.foundationState.data.nodes, -1) as EditorNode;
                    this.foundation.onUserInput(lastNode.id, e.data);
                }

            } else {
                const nodeId = ele.getAttribute("data-node-id");
                this.foundation.onUserInput(nodeId, e.data);
            }
        } else if (e.inputType==="insertParagraph") {
            if (ele===this.containerRef.current) {
                if (this.state.elementList.length===0) {
                    this.foundation.onUserInsertParagraph(null);
                } else {
                    const lastNode = nth(this.foundation.foundationState.data.nodes, -1) as EditorNode;
                    this.foundation.onUserInsertParagraph(lastNode.id);
                }

            } else {
                debugger;
                const nodeId = ele.getAttribute("data-node-id");
                this.foundation.onUserInsertParagraph(nodeId);
            }
        }

        e.preventDefault();
        e.stopPropagation();
    }



    render() {
        return (
            <div>
                <Button onClick={this.foundation.onBold}>Bold</Button>
                <Button onClick={this.foundation.onItalic}>Italic</Button>
                <Button onClick={this.foundation.onUnderline}>Underline</Button>
                <input type={"color"} value={this.state.color} onChange={e => {
                    this.setState({ color: e.target.value });
                    this.foundation.onColor(e.target.value);
                }}/>
                <input type={"color"} value={this.state.bgColor} onChange={e => {
                    this.setState({ bgColor: e.target.value });
                    this.foundation.onBgColor(e.target.value);
                }}/>
                <div contentEditable={true}
                    suppressContentEditableWarning={true} className={"semi-rich-editor-container"}
                    style={{ border: '1px solid red', width: 600, height: 400 }} ref={this.containerRef}>
                    {this.state.elementList}
                </div>
            </div>
        );
    }
}


export default RichEditor;
