import React from 'react';
import PropTypes from 'prop-types';
import { isFunction } from 'lodash';
import classnames from 'classnames';
import { stepsClasses as css } from '@douyinfe/semi-foundation/steps/constants';
import { IconChevronRight } from '@douyinfe/semi-icons';

export interface NavStepProps {
    title?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    index?: number;
    active?: boolean;
    total?: number;
    prefixCls?: string;
    onChange?: () => void;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
}

const NavStep = (props: NavStepProps) => {
    const { prefixCls, className, title, style, active, index, total, onClick, onChange, ...restProps } = props;
    const classString = classnames(prefixCls, className, {
        [`${prefixCls}-active`]: active
    });
    const handleClick = (e: React.MouseEvent) => {
        if (isFunction(onClick)) {
            onClick(e);
        }
        onChange();
    };
    return (
        <div {...restProps} className={classString} style={style} onClick={e => handleClick(e)}>
            <div className={`${prefixCls}-container`}>
                <div className={`${prefixCls}-content`}>
                    <div className={`${prefixCls}-title`}>
                        {title}
                    </div>
                </div>
                {index !== total - 1 && (
                    <div className={`${prefixCls}-icon`}>
                        <IconChevronRight size="small" />
                    </div>
                )}
            </div>
        </div>
    );
};

NavStep.propTypes = {
    prefixCls: PropTypes.string,
    title: PropTypes.node,
    className: PropTypes.string,
    style: PropTypes.object,
    onClick: PropTypes.func,
    active: PropTypes.bool,
};
NavStep.defaultProps = {
    prefixCls: css.ITEM,
    active: false,
    className: '',
};

export default NavStep;
