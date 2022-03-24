import React, { CSSProperties, ReactNode } from 'react';
import cls from 'classnames';
import { cssClasses, strings } from '@douyinfe/semi-foundation/divider/constants';
import '@douyinfe/semi-foundation/divider/divider.scss';


const prefixCls = cssClasses.PREFIX;

export interface DividerProps { 
    /** The position of title inside divider */
    align?: 'left' | 'right' | 'center';
    /** The wrapped title */
    children?: ReactNode;
    /** Style class name */
    className?: string;
    /** Whether line is dashed  */
    dashed?: boolean;
    /** The direction type of divider */
    layout?: 'horizontal' | 'vertical';
    /** Divider text show as plain style */
    plain?: boolean;
    /** Divider inline style */
    style?: CSSProperties;
}

const Divider:React.FC<DividerProps> = props => {
    const {
        layout = 'horizontal',
        dashed,
        align = 'center',
        className,
        style,
        children,
        plain,
        ...otherDividerProps
    } = props;
    
    const dividerClassNames = cls(`${prefixCls}-divider`, className, {
        [`${prefixCls}-divider--horizontal`]: layout === 'horizontal',
        [`${prefixCls}-divider--vertical`]: layout === 'vertical',
        [`${prefixCls}-divider--dashed`]: !!dashed,
        [`${prefixCls}-divider--with-text`]: !!children,
        [`${prefixCls}-divider--with-text-${align}`]: !!children,
    });
    
    return (
        <div {...otherDividerProps} className={dividerClassNames} style={style}>
            {children ? (
                <span className={cls(`${prefixCls}-divider__inner-text`, { 'semi-divider__inner-text-plain': plain })}>
                    {children}
                </span>
            ) : null}
        </div>
    );
};

export default Divider;