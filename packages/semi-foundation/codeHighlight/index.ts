import BaseFoundation, { DefaultAdapter } from '../base/foundation';
import Prism, { Grammar } from 'prismjs';

Prism.manual = true;

export interface CodeHighlightBaseProps{
    code:string
    language:string
    lightTheme:any
    darkTheme:any
}

export interface CodeHighlightBaseState{

}

export interface CodeHighlightAdapter<P = Record<string, any>, S = Record<string, any>> extends DefaultAdapter<P, S> {

}


class CodeHighlightFoundation <P = Record<string, any>, S = Record<string, any>> extends BaseFoundation<CodeHighlightAdapter<P, S>, P, S> {
    constructor(adapter: CodeHighlightAdapter<P, S>) {
        super({ ...adapter });
    }


    highlightCode = (code:string,grammar:Grammar,language:string)=>{
        const html = Prism.highlight(code,grammar,language);
        return html
    }

}


export default CodeHighlightFoundation
