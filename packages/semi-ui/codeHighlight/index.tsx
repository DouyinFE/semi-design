import * as React from 'react'
import BaseComponent from '../_base/baseComponent';
import {
    CodeHighlightAdapter,
    CodeHighlightBaseProps,
    CodeHighlightBaseState,
} from '@douyinfe/semi-foundation/codeHighlight';
import { CSSProperties } from 'react';




interface CodeHighlightProps extends CodeHighlightBaseProps{
    className?:string
    style?:CSSProperties
}


interface CodeHighlightState extends CodeHighlightBaseState{

}


class CodeHighlight extends BaseComponent<CodeHighlightProps,CodeHighlightState>{

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


    render() {
        <code>
            {this.props.code}
        </code>

    }


}

export default CodeHighlight
