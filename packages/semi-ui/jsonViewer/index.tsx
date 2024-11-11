import { JsonViewerOptions, JsonViewer } from "@douyinfe/semi-foundation/jsonViewer/core";
import { PureComponent } from "react";
import React from "react";
import '@douyinfe/semi-foundation/jsonViewer/jsonViewer.scss';
import classNames from "classnames";
import { cssClasses } from "@douyinfe/semi-foundation/jsonViewer/constants";
const prefixCls = cssClasses.PREFIX;
export interface JsonViewerProps {
    value: string;
    width: number;
    height: number;
    onChange?: (value: string) => void;
    onValueHover?: ({ value, target }: { value: string; target: HTMLElement }) => HTMLElement;
    options?: JsonViewerOptions
}


class JsonViewerCpn extends PureComponent<JsonViewerProps> {

    static defaultProps: Partial<JsonViewerProps> = {
        width: 400,
        height: 400,
        value: ''
    };

    private editorRef: React.RefObject<HTMLDivElement>;
    private jsonViewer: JsonViewer | null = null;
    constructor(props: JsonViewerProps) {
        super(props);
        this.editorRef = React.createRef();
    }

    componentDidMount() {
        this.initJsonViewer();
    }

    componentDidUpdate(prevProps: JsonViewerProps) {
        if (prevProps.value !== this.props.value || prevProps.options !== this.props.options) {
            this.initJsonViewer();
        }
    }


    getStyle() {
        const { width, height } = this.props;
        return {
            width,
            height
        };
    }

    private initJsonViewer() {
        const { value, options, onChange, onValueHover } = this.props;

        if (this.editorRef.current) {
            this.jsonViewer = new JsonViewer(this.editorRef.current, value, options);
            this.jsonViewer.layout();

            this.jsonViewer.emitter.on('contentChanged', (e) => {
                onChange?.(this.jsonViewer?.getModel().getValue());
            });

            this.jsonViewer.emitter.on('hoverNode', (e) => {
                const el = onValueHover?.(e);
                if (el) {
                    this.jsonViewer?.emitter.emit('renderHoverNode', { el });
                }
            });
        }
    }

    render() {
        return <div style={this.getStyle()} ref={this.editorRef} className={classNames(prefixCls, `${prefixCls}-background`)}></div>;
    }
}


export default JsonViewerCpn;