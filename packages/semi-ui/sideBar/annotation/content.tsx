// import { Annotation } from '@douyinfe/semi-ui/aiChatDialogue';
import React, { ReactNode } from 'react';
import type { AnnotationItem } from './item';
import Item, { VideoItem } from './item';
import { Collapse } from '../../index';
import cls from 'classnames';
import { IconBookOpenStroked } from '@douyinfe/semi-icons';
import { cssClasses } from '@douyinfe/semi-foundation/sidebar/constants';

const collapseCls = cssClasses.COLLAPSE;
const annotationCls = cssClasses.ANNOTATION;

export interface ContentProps {
    style?: React.CSSProperties;
    className?: string;
    activeKey?: string | string[];
    info?: {
        header: React.ReactNode;
        key: string;
        annotations: AnnotationItem[]
    }[];
    renderItem?: (annotation: AnnotationItem) => ReactNode;
    onChange?: (key: string | string[]) => void;
    onClick?: (e: React.MouseEvent, item: AnnotationItem) => void
}

const Content = React.memo((props: ContentProps) => {
    const { info = [], activeKey, onChange, onClick, style, className, renderItem } = props;

    return (<Collapse
        className={cls(collapseCls, {
            [className]: className,
        })}
        style={style}
        onChange={onChange}
        activeKey={activeKey}
        clickHeaderToExpand={false}
    >
        {info.map(item => (<Collapse.Panel
            header={<div className={`${collapseCls}-header-content`}>
                <IconBookOpenStroked />
                {item.header}
            </div>}
            itemKey={item.key}
            key={item.key}
        >
            <div className={`${annotationCls}-content`}>
                {item.annotations.map((cite, index) => {
                    if (renderItem) {
                        return renderItem(cite);
                    }
                    if (cite.type === 'video') {
                        return <VideoItem key={`${index}`} onClick={onClick} {...cite} />;
                    } 
                    return <Item key={`${index}`} onClick={onClick} {...cite} />;
                })}
            </div>
        </Collapse.Panel>))}
    </Collapse>);
});

export default Content;