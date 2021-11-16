import React, { ReactNode, ReactElement, CSSProperties, DetailedHTMLProps, Ref, ComponentType, ForwardRefExoticComponent } from 'react';
import { BASE_CLASS_PREFIX } from '../env';
import cls from 'classnames';
import '../styles/icon.scss';

export type IconSize = 'extra-small' | 'small' | 'default' | 'large' | 'extra-large';

export interface IconProps extends DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> {
    svg: ReactNode;
    size?: IconSize;
    spin?: boolean;
    rotate?: number;
    prefixCls?: string;
    type?: string;
}

const Icon: ForwardRefExoticComponent<IconProps> & { elementType?: string } = React.forwardRef((props: IconProps, ref: Ref<HTMLSpanElement>): ReactElement => {
    const { svg, spin = false, rotate, style, className, prefixCls = BASE_CLASS_PREFIX, type, size = 'default', ...restProps } = props;
    const classes = cls(`${prefixCls}-icon`, {
        [`${prefixCls}-icon-extra-small`]: size === 'extra-small', // 8x8
        [`${prefixCls}-icon-small`]: size === 'small', // 12x12
        [`${prefixCls}-icon-default`]: size === 'default', // 16x16
        [`${prefixCls}-icon-large`]: size === 'large', // 20x20
        [`${prefixCls}-icon-extra-large`]: size === 'extra-large', // 24x24
        [`${prefixCls}-icon-spinning`]: spin === true,
        [`${prefixCls}-icon-${type}`]: Boolean(type)
    }, className);
    const outerStyle: CSSProperties = {
    };
    if (Number.isSafeInteger(rotate)) {
        outerStyle.transform = `rotate(${rotate}deg)`;
    }
    Object.assign(outerStyle, style);
    return <span role="img" ref={ref} aria-label={type} className={classes} style={outerStyle} {...restProps}>{svg}</span>;
});

Icon.elementType = 'Icon';

const convertIcon = (Svg: ComponentType, iconType: string): ForwardRefExoticComponent<Omit<IconProps, 'svg' | 'type'>> & { elementType?: string } => {
    const InnerIcon: ForwardRefExoticComponent<Omit<IconProps, 'svg' | 'type'>> & { elementType?: string } = React.forwardRef((props: Omit<IconProps, 'svg' | 'type'>, ref: Ref<HTMLSpanElement>): ReactElement =>
        <Icon svg={React.createElement(Svg)} type={iconType} ref={ref} {...props} />);
    InnerIcon.elementType = 'Icon';
    return InnerIcon;
};

export { convertIcon };
export default Icon;