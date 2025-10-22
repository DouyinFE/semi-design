import React, { useCallback, useEffect, useState } from 'react';
import { cssClasses } from '@douyinfe/semi-foundation/aiChatDialogue/constants';
import { IconChevronRight } from '@douyinfe/semi-icons';
import { Annotation } from '@douyinfe/semi-foundation/aiChatDialogue/foundation';
import AvatarGroup from '../../../avatar/avatarGroup';
import Avatar from '../../../avatar';

export interface AnnotationItemProps {
    title?: string;
    logo?: string;
    url?: string;
    detail?: string
}

export interface AnnotationWidgetProps {
    maxCount: number;
    annotation: AnnotationItemProps[] | Annotation[];
    onClick?: (e: React.MouseEvent<HTMLDivElement>, item: AnnotationItemProps[]) => void;
    description?: string
}

const prefixCls = cssClasses.PREFIX_ANNOTATION;

export const AnnotationWidget = (props: AnnotationWidgetProps) => {

    const { annotation, description, maxCount, onClick } = props;

    const [filteredAnnotation, setFilteredAnnotation] = useState<AnnotationItemProps[]>([]);

    useEffect(() => {
        const filteredAnnotation = annotation.filter((item: Annotation) => (item.type !== 'file_citation' && item.type !== 'container_file_citation'));
        setFilteredAnnotation(filteredAnnotation);
    }, [annotation]);

    const handleClick = useCallback((e?: React.MouseEvent<HTMLDivElement>) => {
        onClick?.(e, annotation as AnnotationItemProps[]);
    }, [annotation, onClick]);

    const renderMore = useCallback((restNumber: number, restAvatars: React.ReactNode[]) => {
        return <Avatar className={`${prefixCls}-content-logo-renderMore`} size="extra-extra-small" alt={'more'}>
            {`+${restNumber}`}
        </Avatar>;
    }, []);

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
        }
    }, [handleClick]);

    if (filteredAnnotation.length === 0) { return null; }

    return (
        <div 
            role="button"
            tabIndex={0}
            className={`${prefixCls}-wrapper`} 
            onClick={handleClick}
            onKeyDown={handleKeyDown}
        >
            <div className={`${prefixCls}-content`}>
                <AvatarGroup maxCount={maxCount} size="extra-extra-small" overlapFrom={'end'} renderMore={renderMore}>
                    {filteredAnnotation.map((item: AnnotationItemProps, index: number) => {
                        return item.logo && <Avatar className={`${prefixCls}-content-logo`} key={index} src={item.logo} alt={item.title}/>;
                    })}
                </AvatarGroup>
                <div className={`${prefixCls}-content-description`}>{description || `${filteredAnnotation.length} 篇资料`}</div>
                <div className={`${prefixCls}-content-icon`}><IconChevronRight /></div>
            </div>
        </div>
    );
};