import React from 'react';
import cls from 'classnames';
import { cssClasses, strings } from '@douyinfe/semi-foundation/floatButton/constants';
import '@douyinfe/semi-foundation/floatButton/floatButton.scss';
import { IconSearchStroked, IconHelpCircleStroked } from '@douyinfe/semi-icons';

const iconImgs = {
    default: {
        small: 'https://cdn-tos-cn.bytedance.net/obj/ies-semi/images/mcvcjc2y-ytad407.svg',
        medium: 'https://cdn-tos-cn.bytedance.net/obj/ies-semi/images/mcvcjc2y-hfkzeke.svg',
        large: 'https://cdn-tos-cn.bytedance.net/obj/ies-semi/images/mcvcjc2y-y4y9tsx.svg',
    },
    disabled: {
        small: 'https://cdn-tos-cn.bytedance.net/obj/ies-semi/images/mcvrr4gn-9vdet0m.svg',
        medium: 'https://cdn-tos-cn.bytedance.net/obj/ies-semi/images/mcvcjc2y-bm6q1vr.svg',
        large: 'https://cdn-tos-cn.bytedance.net/obj/ies-semi/images/mcvcjc2y-7un8des.svg',
    },
};

const badgeContents = {
    small: '3',
    large: '99+',
};

function FloatButton({ type = 'default', status = 'normal', size = 'medium', showRectangle = false, showBadge = false, badgeContent = '', group = false, groupItems = [] }) {
    const iconCls = cls(cssClasses.ICON_BTN,
        `${cssClasses.ICON_BTN}-${size}`,
        `${cssClasses.ICON_BTN}-${type}`,
        {
            [`${cssClasses.ICON_BTN}-disabled`]: status === 'disabled',
        }
    );
    const imgCls = cls(cssClasses.ICON_IMG, `${cssClasses.ICON_IMG}-${size}`);
    // 单枚浮动按钮
    if (!group) {
        return (
            <span className={cssClasses.PREFIX}>
                <span className={iconCls}>
                    <img src={iconImgs[type][size]} className={imgCls} alt='' />
                    {showRectangle ? (
                        <span className={cls(cssClasses.RECTANGLE, `${cssClasses.RECTANGLE}-${size}`)} />
                    ) : null}
                    {showBadge ? (
                        <span className={cssClasses.BADGE}>{badgeContent}</span>
                    ) : null}
                </span>
            </span>
        );
    }
    // 按钮组
    return (
        <span className={cls(cssClasses.PREFIX, cssClasses.GROUP)}>
            {groupItems.map((item, idx) => {
                const iconBtnCls = cls(cssClasses.GROUP_ITEM, {
                    [`${cssClasses.ICON_BTN}-disabled`]: item.status === 'disabled',
                });
                return (
                    <span className={iconBtnCls} key={idx}>
                        {item.iconType === 'img' ? (
                            <img src={iconImgs[item.status][item.size]} className={cls(cssClasses.ICON_IMG, `${cssClasses.ICON_IMG}-${item.size}`)} alt='' />
                        ) : item.iconType === 'search' ? (
                            <IconSearchStroked className='semi-icons-search' />
                        ) : (
                            <IconHelpCircleStroked className='semi-icons-help' />
                        )}
                        <span className={`${cssClasses.GROUP_ITEM}-text`}>{item.label}</span>
                        {item.showRectangle ? (
                            <span className={cls(cssClasses.RECTANGLE, `${cssClasses.RECTANGLE}-group`)} />
                        ) : null}
                        {item.showBadge ? (
                            <span className={cssClasses.BADGE}>{item.badgeContent}</span>
                        ) : null}
                    </span>
                );
            })}
        </span>
    );
}

export default FloatButton;
