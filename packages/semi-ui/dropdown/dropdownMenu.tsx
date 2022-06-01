import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { cssClasses } from '@douyinfe/semi-foundation/dropdown/constants';
import Foundation from '@douyinfe/semi-foundation/dropdown/menuFoundation';

import BaseComponent, { BaseProps } from '../_base/baseComponent';

const prefixCls = cssClasses.PREFIX;
export type DropdownMenuProps = BaseProps;

class DropdownMenu extends BaseComponent<DropdownMenuProps> {
    static propTypes = {
        children: PropTypes.node,
        className: PropTypes.string,
        style: PropTypes.object,
    };

    menuRef: React.RefObject<HTMLUListElement>

    constructor(props: DropdownMenuProps) {
        super(props);

        this.menuRef = React.createRef();
        this.foundation = new Foundation(this.adapter);
    }

    get adapter() {
        return {
            ...super.adapter,
        };
    }

    componentDidMount() {
        this.foundation.autoFocus(this.menuRef.current);
    }

    render() {
        const { children, className, style, ...rest } = this.props;
        return (
            <ul role="menu" aria-orientation="vertical" ref={this.menuRef} {...rest} className={classnames(`${prefixCls}-menu`, className)} style={style}>
                {children}
            </ul>
        );
    }
}

export default DropdownMenu;
