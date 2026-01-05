import React from 'react';
import { OptionProps } from './interface';
import Button from '../button';
import { cssClasses } from '@douyinfe/semi-foundation/sidebar/constants';
import cls from 'classnames';

const prefixCls = cssClasses.OPTIONS;

const Option = React.memo((props: OptionProps) => {
    const { renderOptionItem, options, onChange, activeKey } = props;

    return (<div className={prefixCls}>
        {options?.map(option => {
            const { icon, name, key } = option;
            if (typeof renderOptionItem === 'function') {
                return renderOptionItem(option, onChange);
            }
            return <Button
                className={cls(`${prefixCls}-button`, {
                    [`${prefixCls}-normal`]: activeKey !== key,
                })}
                key={key}
                icon={icon}
                onClick={(e) => onChange?.(e, option.key)}
            >
                {name}
            </Button>;
        })}
    </div>);
});

export default Option;
