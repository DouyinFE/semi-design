import React, { useCallback } from 'react';
import { JsonViewer, CodeHighlight, Collapse, Button } from '../../index';
import { SideBarCollapseProps } from '../interface';
import cls from 'classnames';
import { cssClasses, strings } from '@douyinfe/semi-foundation/sidebar/constants';
import { IconCodeStroked, IconFullScreenStroked, IconFile } from '@douyinfe/semi-icons';
import { JsonViewerProps } from '../../jsonViewer';
import { CodeHighlightProps } from '../../codeHighlight';

const collapseCls = cssClasses.COLLAPSE;
const prefixCls = cssClasses.SIDEBAR;

export interface CodeItemProps {
    name?: string;
    key?: string;
    isJson?: boolean;
    language?: string;
    content?: string;
    jsonViewerProps?: JsonViewerProps;
    codeHighlightProps?: CodeHighlightProps
}

// interface CodeDetail {
//     name?: string;
//     key?: string;
//     code?: CodeItemProps
// }

export interface CodeContentProps extends SideBarCollapseProps {
    style?: React.CSSProperties;
    className?: string;
    codes?: CodeItemProps[];
    onExpand?: (e: React.MouseEvent, code: CodeItemProps, mode: string) => void
}


export const CodeItem = React.memo((props: CodeItemProps) => {
    const { language, content, isJson, jsonViewerProps = {}, codeHighlightProps = {} } = props;
    return <div className={`${prefixCls}-code-content`}>{isJson ? 
        <JsonViewer
            height={'100%'}
            width={'100%'}
            value={content}
            showSearch={false}
            options={strings.JSON_VIEWER_OPTIONS}
            {...jsonViewerProps}
        />
        : <CodeHighlight language={language} code={content} {...codeHighlightProps} />}
    </div>;
});

export const CollapseHeader = React.memo((props: {
    content: CodeItemProps;
    mode: string;
    onExpand: (e: React.MouseEvent, code: CodeItemProps, mode: string) => void
}) => {
    const { content, onExpand, mode } = props;
    const handleExpand = useCallback((e: React.MouseEvent) => {
        onExpand?.(e, content, mode);
    }, [content, onExpand, mode]);
    return <div className={`${collapseCls}-header-content`}>
        {mode === 'code' ? <IconCodeStroked /> : <IconFile />}
        <span className={`${collapseCls}-header-text`}>{content.name}</span>
        <Button 
            className={`${collapseCls}-header-expand-btn`}
            theme='borderless'
            type='tertiary'
            icon={<IconFullScreenStroked />}
            onClick={handleExpand}
        />
    </div>;
});

const CodeContent = React.memo((props: CodeContentProps) => {
    const { activeKey, codes = [], onExpand, style, className, onChange } = props;
    return <Collapse
        className={cls(collapseCls, `${collapseCls}-code`, { [className]: className })}
        style={style}
        onChange={onChange}
        activeKey={activeKey}
        clickHeaderToExpand={false}
    >
        {codes.map((code) => <Collapse.Panel
            header={<CollapseHeader content={code} onExpand={onExpand} mode={'code'}/>}
            itemKey={code.key}
            key={code.key}
        >
            <CodeItem key={code.key} {...code} />
        </Collapse.Panel>)}
    </Collapse>;
});

export default CodeContent;