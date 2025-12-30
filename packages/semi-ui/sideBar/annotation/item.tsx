import React, { useCallback } from 'react';
import { IconPlay } from '@douyinfe/semi-icons';
import { cssClasses } from '@douyinfe/semi-foundation/sidebar/constants';
import { formatTime } from '../../videoPlayer/utils';

const prefixCls = cssClasses.ANNOTATION_ITEM;

export interface AnnotationItem {
    type?: 'video' | 'text';
    title?: string;
    url?: string;
    detail?: string;
    logo?: string;
    siteName?: string;
    order?: number;
    onClick?: (event: React.MouseEvent<HTMLDivElement>, item: AnnotationItem) => void;
    img?: string;
    duration?: number
}

export function VideoItem(props: AnnotationItem) {
    const { title, url, logo, img, duration, order, onClick, siteName } = props;

    const onItemClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (url && typeof window !== 'undefined') {
            window.open(url, '_blank');
        }
        const { onClick, ...rest } = props;
        onClick?.(e, rest);
    }, [url, props]);

    return (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        <div 
            className={`${prefixCls} ${prefixCls}-video`} 
            onClick={onItemClick}
        >
            <div className={`${prefixCls}-video-img-wrapper`}>
                {img && <img className={`${prefixCls}-video-img`} src={img} alt={title} />}
                <IconPlay className={`${prefixCls}-video-play`}/>
                {typeof duration === 'number' && (
                    <span className={`${prefixCls}-video-duration`}>{formatTime(duration)}</span>
                )}
            </div>
            <div className={`${prefixCls}-video-content`}>
                <div className={`${prefixCls}-title`}>{title}</div>
                <div className={`${prefixCls}-footer`}>
                    <img className={`${prefixCls}-footer-logo`} src={logo} alt={title} />
                    <span className={`${prefixCls}-footer-text`}>{siteName}</span>
                    {typeof order === 'number' && <span className={`${prefixCls}-footer-order`}>{order}</span>}
                </div>
            </div>
           
        </div>
    );
}

export default function Item(props: AnnotationItem) {
    const { title, url, detail, logo, order, siteName } = props;

    const onItemClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (url && typeof window !== 'undefined') {
            window.open(url, '_blank');
        }
        const { onClick, ...rest } = props;
        onClick?.(e, rest);
    }, [url, props]);

    return (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        <div 
            className={`${prefixCls} ${prefixCls}-text`}
            onClick={onItemClick}
        >
            <div className={`${prefixCls}-title`}>{title}</div>
            <div className={`${prefixCls}-text-detail`}>{detail}</div>
            <div className={`${prefixCls}-footer`}>
                {logo && <img className={`${prefixCls}-footer-logo`} src={logo} alt={title} />}
                {siteName && <span className={`${prefixCls}-footer-text`}>{siteName}</span>}
                {typeof order === 'number' && <span className={`${prefixCls}-footer-order`}>{order}</span>}
            </div>
        </div>
    );
}
