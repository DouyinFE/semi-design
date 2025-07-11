import React from 'react';
import cls from 'classnames';
import { cssClasses } from '@douyinfe/semi-foundation/aiCard/constants';
import '@douyinfe/semi-foundation/aiCard/aiCard.scss';

const ICON_MAP = {
    default: 'https://cdn-tos-cn.bytedance.net/obj/ies-semi/images/mcvchagt-4rqbkb6.svg',
    stroked: 'https://cdn-tos-cn.bytedance.net/obj/ies-semi/images/mcvchagt-cfq9xbz.svg',
    filled: 'https://cdn-tos-cn.bytedance.net/obj/ies-semi/images/mcvchagt-w7je9be.svg',
    'filled-top': 'https://cdn-tos-cn.bytedance.net/obj/ies-semi/images/mcvchagt-vut0xqr.svg',
};

/**
 * type: 'default' | 'stroked' | 'filled' | 'filled-top'
 * status: 'normal' | 'hover' | 'active' | 'disabled'
 */
function AICardSection({ type = 'default', status = 'normal', title = 'AI Summary', icon, ...props }) {
    const prefixcls = cssClasses.PREFIX;
    const blockCls = `${prefixcls}-block`;
    const typeCls = `${prefixcls}-${type}`;

    // Icon per type
    const iconUrl = icon || ICON_MAP[type];

    return (
        <section
            className={cls(
                prefixcls,
                typeCls,
                `${prefixcls}-status-${status}`
            )}
            {...props}
        >
            <div className={blockCls}>
                <div className={`${blockCls}-header`}>
                    <img className={`${blockCls}-icon`} src={iconUrl} alt="AI Icon" />
                    <span className={`${blockCls}-title`}>{title}</span>
                </div>
                {/* Block content, such as summary, goes here (children) */}
                <div className={cls(`${blockCls}-footer`)}>
                    {/* Footer content or separator if needed */}
                </div>
            </div>
            {/* Special decorations for certain types */}
            {type === 'filled-top' && (
                <div className={`${prefixcls}-filled-top-bg`} />
            )}
            {type === 'filled' && (
                <div className={`${prefixcls}-separator`} />
            )}
            {(type === 'default' || type === 'stroked') && (
                <div className={`${prefixcls}-rectangle`} />
            )}
        </section>
    );
}

export default AICardSection;
