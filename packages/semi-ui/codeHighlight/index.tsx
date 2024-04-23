import * as React from 'react'
import BaseComponent from '../_base/baseComponent';
import CodeHighlightFoundation, {
    CodeHighlightAdapter,
    CodeHighlightBaseProps,
    CodeHighlightBaseState,
} from '@douyinfe/semi-foundation/codeHighlight';
import { CSSProperties } from 'react';
import "@douyinfe/semi-foundation/codeHighlight/codeHighlight.scss"




interface CodeHighlightProps extends CodeHighlightBaseProps{
    className?:string
    style?:CSSProperties
}


interface CodeHighlightState extends CodeHighlightBaseState{

}


class CodeHighlight extends BaseComponent<CodeHighlightProps,CodeHighlightState>{

    preWrapperRef = React.createRef<HTMLPreElement>()
    foundation = new CodeHighlightFoundation(this.adapter)
    static __SemiComponentName__ = "CodeHighlight";

    constructor(props:CodeHighlightProps) {
        super(props);
        this.state = {

        }

    }

    get adapter():CodeHighlightAdapter{
        return {
            ...super.adapter
        }
    }

    componentDidMount() {
        super.componentDidMount();
        if(this.preWrapperRef.current){
            this.foundation.highlightCode(this.preWrapperRef.current,this.props.language)
        }

    }

    render() {
       return <pre ref={this.preWrapperRef}>
           <code>
            {this.props.code}
        </code>
       </pre>

    }


}

export default CodeHighlight
