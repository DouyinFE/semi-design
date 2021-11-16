import React from 'react';
import BaseComponent, { BaseProps } from '../_base/baseComponent';
import PropTypes from 'prop-types';
import { cssClasses, strings } from '@douyinfe/semi-foundation/button/constants';
import { Type, Size } from './Button';

import '@douyinfe/semi-foundation/button/button.scss';

export type Theme = 'solid' | 'borderless' | 'light';
export interface ButtonGroupProps extends BaseProps {
    disabled?: boolean;
    type?: Type;
    size?: Size;
    theme?: Theme;
}

const prefixCls = cssClasses.PREFIX;
const btnSizes = strings.sizes;

export default class ButtonGroup extends BaseComponent<ButtonGroupProps> {
    static propTypes = {
        children: PropTypes.node,
        disabled: PropTypes.bool,
        type: PropTypes.string,
        size: PropTypes.oneOf(btnSizes),
        theme: PropTypes.oneOf(strings.themes),
    };

    static defaultProps = {
        size: 'default',
        type: 'primary',
        theme: 'light',
    };

    render() {
        const { children, disabled, size, type, ...rest } = this.props;
        let inner;

        if (children) {
            inner = (Array.isArray(children) ? children : [children]).map((itm: React.ReactElement, index) =>
                React.cloneElement(itm, { disabled, size, type, ...itm.props, ...rest, key: index })
            );
        }
        return <div className={`${prefixCls}-group`} role="group" aria-label="button group">{inner}</div>;
    }
}
