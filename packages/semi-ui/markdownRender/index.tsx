import * as React from 'react';
import BaseComponent from '../_base/baseComponent';
import MarkdownRenderFoundation, {
    MarkdownRenderAdapter,
    MarkdownRenderBaseProps,
    MarkdownRenderBaseState,
} from '@douyinfe/semi-foundation/markdownRender/foundation';
import "@douyinfe/semi-foundation/markdownRender/markdownRender.scss";
import { CSSProperties } from 'react';
import * as runtime from 'react/jsx-runtime';
import { cssClasses } from '@douyinfe/semi-foundation/markdownRender/constants';

export interface MarkdownRenderProps extends MarkdownRenderBaseProps{
    style?: CSSProperties;
    className?: string
}

export interface MarkdownRenderState extends MarkdownRenderBaseState{

}



class MarkdownRender extends BaseComponent<MarkdownRenderProps, MarkdownRenderState> {

    foundation = new MarkdownRenderFoundation(this.adapter)

    constructor(props: MarkdownRenderProps) {
        super(props);
        this.state = {
            MDXContentComponent: this.foundation.evaluateSync(this.props.mdxRaw)
        };
    }

    componentDidUpdate(prevProps: Readonly<MarkdownRenderProps>, prevState: Readonly<MarkdownRenderState>, snapshot?: any) {
        if (prevProps.mdxRaw!==this.props.mdxRaw) {
            this.setState({ MDXContentComponent: this.foundation.evaluateSync(this.props.mdxRaw) });
        }
    }

    get adapter(): MarkdownRenderAdapter<MarkdownRenderProps, MarkdownRenderState> {
        return {
            ...super.adapter,
            getRuntime: ()=>runtime
        };
    }




    render() {
        const ComponentConstructor = this.state.MDXContentComponent;
        return <div className={`${cssClasses.PREFIX}`}>
            <ComponentConstructor components={this.props.components} />
        </div>;
    }


}


export default MarkdownRender;
