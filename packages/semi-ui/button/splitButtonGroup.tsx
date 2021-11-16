import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { cssClasses } from '@douyinfe/semi-foundation/button/constants';
import '@douyinfe/semi-foundation/button/button.scss';
import BaseComponent, { BaseProps } from '../_base/baseComponent';

const prefixCls = cssClasses.PREFIX;

// eslint-disable-next-line
export interface SplitButtonGroupProps extends BaseProps {}

export default class SplitButtonGroup extends BaseComponent<SplitButtonGroupProps> {
    static propTypes = {
        style: PropTypes.object,
        className: PropTypes.string,
    };
    render() {
        const { children, style, className } = this.props;
        const cls = classNames(`${prefixCls}-split`, className);
        return (
            <div className={cls} style={style} role="group" aria-label="split style button group">
                {children}
            </div>
        );
    }
}
