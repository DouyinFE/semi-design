import * as React from 'react';
import { PropsWithChildren } from 'react';
import CodeHighlight from "../../codeHighlight";
import { nth } from 'lodash';

const pre = (props: PropsWithChildren<{ className: string }>) => {
    return <CodeHighlight code={props.children as string}
        language={nth(props.className?.split("-") ?? "javascript", -1)} lineNumber={true}/>;
};

export default pre;
