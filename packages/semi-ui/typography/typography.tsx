import React, { PureComponent } from 'react';
import cls from 'classnames';
import PropTypes from 'prop-types';
import { cssClasses } from '@douyinfe/semi-foundation/typography/constants';
import '@douyinfe/semi-foundation/typography/typography.scss';
import { BaseProps } from '../_base/baseComponent';
const prefixCls = cssClasses.PREFIX;
interface TypographyProps extends BaseProps {
    component?: React.ElementType;
    forwardRef?: React.RefObject<any>
}
class Typography extends PureComponent<TypographyProps> {
    static defaultProps = {
        component: 'article',
        style: {},
        className: '',
    };

    static propTypes = {
        component: PropTypes.string,
        style: PropTypes.object,
        className: PropTypes.string,
    };

    render() {
        const { component, className, children, forwardRef, ...rest } = this.props;
        const Component = component;
        const classNames = cls(prefixCls, className);
        return (
            <Component
                className={classNames}
                ref={forwardRef}
                {...rest}
            >
                {children}
            </Component>
        );
    }
}

export default Typography;
