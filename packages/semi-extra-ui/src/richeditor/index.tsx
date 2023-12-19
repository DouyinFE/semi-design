import React, { ReactNode } from 'react';
import BaseComponent from "../base";
import RichEditorFoundation, { EditorNode, RichEditorAdapter } from "@douyinfe/semi-extra-foundation/src/richeditor";
import { AnchorAdapter } from "@douyinfe/semi-foundation/anchor/foundation";
import { Button } from "@douyinfe/semi-ui";


export interface RichEditorProps{

}

export interface RichEditorState{
    elementList: ReactNode[]
}

class RichEditor extends BaseComponent<RichEditorProps, RichEditorState> {

    constructor(props: RichEditorProps) {
        super(props);
        this.state = {
            elementList: []
        };
        this.foundation = new RichEditorFoundation(this.adapter);
    }
    containerRef: React.RefObject<HTMLDivElement> = React.createRef();
    nodeElementMap: Map<EditorNode, ReactNode> = new Map();
    nodeDOMMap: Map<EditorNode, HTMLElement> = new Map()
    get adapter(): RichEditorAdapter<RichEditorProps, RichEditorState> {
        return {
            ...super.adapter,
            createElement: (node: EditorNode, index: number)=>{
                const element = this.nodeToElement(node);
                const eleList = [...this.state.elementList];
                eleList.splice(index, 0, element);
                this.setState({ elementList: eleList });
                this.nodeElementMap.set(node, element);
            },
            updateElement: (node: EditorNode)=>{
                const oldElement = this.nodeElementMap.get(node);
                if (oldElement) {
                    const newElement = this.nodeToElement(node);
                    const index = this.state.elementList.indexOf(oldElement);
                    if (index!==-1) {
                        const eleList = [...this.state.elementList];
                        eleList.splice(index, 1, newElement);
                        this.setState({ elementList: eleList });
                        this.nodeElementMap.delete(node);
                        this.nodeElementMap.set(node, newElement);
                    }
                }
            },
            getDOMByNodeId: (id: string)=>{
                const node = this.foundation.getNodeById(id);
                if (node) {
                    return this.nodeDOMMap.get(node) || null;
                } else {
                    return null;
                }

            }
        };
    }

    private nodeToElement(node: EditorNode): ReactNode {
        const closure: {
            dom: HTMLDivElement|null;
            eventMounted: boolean
        } = {
            dom: this.nodeDOMMap.get(node) as HTMLDivElement || null,
            eventMounted: this.nodeElementMap.has(node) || false
        };
        return <div ref={r=>{
            if (r && !closure.eventMounted) {
                closure.dom = r;
                this.nodeDOMMap.set(node, closure.dom);
                closure.dom.addEventListener("beforeinput", (e)=>this.handleBeforeInputEvent(e as InputEvent, closure.dom));
                closure.eventMounted=true;
            }

        }} data-node-id={node.id} contentEditable={true} suppressContentEditableWarning={true} className={node.type.map(t=>{
            return `semi-rich-editor-type-${t.name}`; // TODO: process each type
        }).join(" ")}>{node.content}</div>;
    }

    componentDidMount() {
        super.componentDidMount();
        const containerDOM = this.containerRef.current!;
        this.foundation.registerContainer(containerDOM);
        containerDOM.addEventListener("beforeinput", (e)=>this.handleBeforeInputEvent(e as InputEvent, containerDOM));

    }

    handleBeforeInputEvent = (e: InputEvent, ele: HTMLDivElement)=>{

        if (ele===this.containerRef.current) {
            this.foundation.onUserInput(null, e.data);
        } else {
            const nodeId = ele.getAttribute("data-node-id");
            this.foundation.onUserInput(nodeId, e.data);
        }
        console.log("handleBeforeInputEvent", e, ele);
        e.preventDefault();
        e.stopPropagation();
    }



    render() {
        return (
            <div>
                <Button>Bold</Button>
                <div onClick={this.foundation.onContainerClick} contentEditable={this.state.elementList.length===0} suppressContentEditableWarning={true} style={{ border: '1px solid red', width: 600, height: 400 }} ref={this.containerRef}>
                    {this.state.elementList}
                </div>
            </div>
        );
    }
}


export default RichEditor;
