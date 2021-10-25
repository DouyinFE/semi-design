import React, { PureComponent, Fragment } from 'react';
import cls from 'classnames';
import PropTypes from 'prop-types';
import { get as lodashGet, isFunction, isNumber } from 'lodash-es';
import Avatar from './index';
import { AvatarGroupProps } from './interface';
import { cssClasses, strings } from '@douyinfe/semi-foundation/avatar/constants';

const sizeSet = strings.SIZE;
const shapeSet = strings.SHAPE;
const overlapFromSet = strings.OVERLAP_FROM;
const prefixCls = cssClasses.PREFIX;
export default class AvatarGroup extends PureComponent<AvatarGroupProps> {
    static defaultProps = {
        size: 'medium',
        shape: 'circle',
        overlapFrom: 'start',
    };

    static propTypes = {
        children: PropTypes.node,
        shape: PropTypes.oneOf(shapeSet),
        size: PropTypes.oneOf(sizeSet),
        maxCount: PropTypes.number,
        renderMore: PropTypes.func,
        overlapFrom: PropTypes.oneOf(overlapFromSet),
    };

    getAllAvatars() {
        const { children } = this.props;
        return Array.isArray(children) ? children : [children];
    }

    getMergeAvatars(avatars: React.ReactNode[]) {
        const { maxCount } = this.props;
        let renderAvatars = avatars;
        const restNumber = avatars.length - maxCount;

        const normalAvatars = avatars.slice(0, maxCount);
        const restAvatars = avatars.slice(maxCount);

        if (restNumber > 0) {
            const more = this.renderMoreAvatar(restNumber, restAvatars);
            normalAvatars.push(more);
            renderAvatars = normalAvatars;
        }
        return renderAvatars;
    }

    renderMoreAvatar(restNumber: number, restAvatars: React.ReactNode[]) {
        const { renderMore } = this.props;
        const moreCls = cls(`${prefixCls}-item-more`);
        let moreAvatar = <Avatar className={moreCls} key="_+n">{`+${restNumber}`}</Avatar>;
        if (isFunction(renderMore)) {
            moreAvatar = <Fragment key="_+n">{renderMore(restNumber, restAvatars)}</Fragment>;
        }
        return moreAvatar;
    }

    render() {
        // eslint-disable-next-line no-unused-vars
        const { children, maxCount, overlapFrom, size, shape, renderMore, ...rest } = this.props;
        let inner;
        const groupCls = cls({
            [`${prefixCls}-group`]: true,
        });
        if (children) {
            const avatars = this.getAllAvatars();
            inner = (isNumber(maxCount) ? this.getMergeAvatars(avatars) : avatars).map((itm, index) => {
                const className = cls(lodashGet((itm as any).props, 'className'), {
                    [`${prefixCls}-item-start-${index}`]: overlapFrom === 'start',
                    [`${prefixCls}-item-end-${index}`]: overlapFrom === 'end',
                });
                return React.cloneElement((itm as any), { ...rest, className, size, shape, key: index });
            });

        }

        return <div className={groupCls}>{inner}</div>;
    }
}
