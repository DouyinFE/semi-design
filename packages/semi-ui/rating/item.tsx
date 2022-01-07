import React, { PureComponent } from 'react';
import cls from 'classnames';
import PropTypes from 'prop-types';
import { strings } from '@douyinfe/semi-foundation/rating/constants';
import '@douyinfe/semi-foundation/rating/rating.scss';
import { IconStar } from '@douyinfe/semi-icons';

type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export interface RatingItemProps {
    value: number;
    index: number;
    prefixCls: string;
    allowHalf: boolean;
    onHover: (e: React.MouseEvent, index: number) => void;
    onClick: (e: React.MouseEvent | React.KeyboardEvent, index: number) => void;
    character: React.ReactNode;
    focused: boolean;
    disabled: boolean;
    count: number;
    size: number | ArrayElement<typeof strings.SIZE_SET>;
    'aria-describedby'?: React.AriaAttributes['aria-describedby'];
}

export default class Item extends PureComponent<RatingItemProps> {
    static propTypes = {
        value: PropTypes.number,
        index: PropTypes.number,
        prefixCls: PropTypes.string,
        allowHalf: PropTypes.bool,
        onHover: PropTypes.func,
        onClick: PropTypes.func,
        character: PropTypes.node,
        focused: PropTypes.bool,
        disabled: PropTypes.bool,
        count: PropTypes.number,
        size: PropTypes.oneOfType([
            PropTypes.oneOf(strings.SIZE_SET),
            PropTypes.number,
        ]),
        'aria-describedby': PropTypes.string,
    };

    onHover: React.MouseEventHandler = e => {
        const { onHover, index } = this.props;
        onHover(e, index);
    };

    onClick: React.MouseEventHandler = e => {
        const { onClick, index } = this.props;
        onClick(e, index);
    };

    onKeyDown: React.KeyboardEventHandler = e => {
        const { onClick, index } = this.props;
        if (e.keyCode === 13) {
            onClick(e, index);
        }
    };

    render() {
        const {
            index,
            prefixCls,
            character,
            count,
            value,
            disabled,
            allowHalf,
            focused,
            size
        } = this.props;
        const starValue = index + 1;
        const diff = starValue - value;
        const isFocused = value === 0 && index === 0 && focused;
        // const isHalf = allowHalf && value + 0.5 === starValue;
        const isHalf = allowHalf && diff < 1 && diff > 0;
        const firstWidth = isHalf ? 1 - diff : 0.5;
        const isFull = starValue <= value;
        const isCustomSize = typeof size === 'number';
        const starCls = cls(prefixCls, {
            [`${prefixCls}-focused`]: isFocused,
            [`${prefixCls}-half`]: isHalf,
            [`${prefixCls}-full`]: isFull,
            [`${prefixCls}-${size}`]: !isCustomSize,
        });
        const sizeStyle = isCustomSize ? {
            width: size,
            height: size,
            fontSize: size
        } : {};
        const iconSize = isCustomSize ? 'inherit' : (size === 'small' ? 'default' : 'extra-large');
        const content = character ? character : <IconStar size={iconSize} />;
        return (
            <li className={starCls} style={{ ...sizeStyle }}>
                <div
                    onClick={disabled ? null : this.onClick}
                    onKeyDown={disabled ? null : this.onKeyDown}
                    onMouseMove={disabled ? null : this.onHover}
                    role="radio"
                    aria-checked={value > index ? 'true' : 'false'}
                    aria-posinset={index + 1}
                    aria-setsize={count}
                    aria-disabled={disabled}
                    aria-label={`Rating ${index + (isHalf ? 0.5 : 1)}`}
                    aria-labelledby={this.props['aria-describedby']} // screen reader will read labelledby instead of describedby
                    aria-describedby={this.props['aria-describedby']}
                    tabIndex={0}
                    className={`${prefixCls}-wrapper`}
                >
                    <div className={`${prefixCls}-first`} style={{ width: `${firstWidth * 100}%` }}>{content}</div>
                    <div className={`${prefixCls}-second`}>{content}</div>
                </div>
            </li>
        );
    }
}