import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { cssClasses } from '@douyinfe/semi-foundation/button/constants';
import '@douyinfe/semi-foundation/button/button.scss';
import BaseComponent, { BaseProps } from '../_base/baseComponent';

const prefixCls = cssClasses.PREFIX;

export interface SplitButtonGroupProps extends BaseProps {
    'aria-label'?: React.AriaAttributes['aria-label']
}

export default class SplitButtonGroup extends BaseComponent<SplitButtonGroupProps> {
    static propTypes = {
        style: PropTypes.object,
        className: PropTypes.string,
        'aria-label': PropTypes.string,
    };
    render() {
        const { children, style, className } = this.props;
        const cls = classNames(`${prefixCls}-split`, className);
        return (
            <div className={cls} style={style} role="group" aria-label={this.props['aria-label']}>
                {children}
            </div>
        );
    }
}
